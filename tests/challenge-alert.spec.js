import { test, expect } from '@playwright/test';
import { ChallengePage } from '../pages/ChallengePage.js';
import { getAISummary } from '../utils/aiSummarize.js';
import { sendEmail } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });

let challengePage;
test.beforeEach(async ({ page }) => {
    test.setTimeout(120000); // Set timeout to 2 minutes for this test only
    challengePage = new ChallengePage(page);
    await challengePage.goto(); 
});

test('Verify if navigated to Challenge Page', async () => {
  const url = await challengePage.page.url();
  await expect(url).toContain('/challenges');
});

test('Checking Challenge Page Heading Visibility', async () => {
    const headingVisible = await challengePage.isHeadingVisible();
    await expect(headingVisible).toBeTruthy();
});

test('Challenge Page Live Challenges Section', async () => {
    const isVisible = await challengePage.liveSection.isVisible();
    await expect(isVisible).toBeTruthy();
});

test('Challenge Page Live Challenges Count', async () => {
    const count = await challengePage.challengeCards.count();
    if (count === 0) {
        console.warn('⚠️ No live challenges found. Exiting spec run.');
        process.exit(0);
    } else {
        await expect(count).toBeGreaterThan(0);
    }
});

test('Validate Challenge Page Live Challenges Links', async () => {
    const challenges = await challengePage.getLiveChallengeLinksAndTitles();
    await expect(challenges.length).toBeGreaterThan(0);
    console.log(`✅ Found ${challenges.length} live challenges.`);
    for (const ch of challenges) {
        console.log(`🔗 Challenge: ${ch.title} - Link: ${ch.link}`);
        await expect(ch.link).toMatch(/^https?:\/\//);
    }
});

test('Weekly QA Challenge Alert', async ({ browser }) => {
    test.setTimeout(900000); // 15 minutes
    const challenges = await challengePage.getLiveChallengeLinksAndTitles();
    const challengeSummaries = [];
    for (const ch of challenges) {
        try {
            console.log(`🔍 Visiting challenge: ${ch.title}`);
            // 🆕 Open new page for each challenge
            const context = await browser.newContext({ ignoreHTTPSErrors: true });
            const page = await context.newPage();
            await page.goto(ch.link, { waitUntil: 'domcontentloaded', timeout: 60000 });
            const htmlContent = await page.content();
            console.log(`📝 Summarizing challenge: ${ch.title}`);
            const summary = await getAISummary(htmlContent);
            console.log(`📝 Summary challenge of ${ch.title}:${summary}`);
            challengeSummaries.push(`### ${ch.title}\n${summary}`);
            await page.close();
            await context.close();
        } catch (error) {
            console.error(`❌ Failed to summarize challenge: ${ch.title}`, error.message);
        }
    }
    const finalSummary = challengeSummaries.join('\n\n');
    await sendEmail('🧠 Weekly Challenges from HackerEarth', finalSummary);
});

