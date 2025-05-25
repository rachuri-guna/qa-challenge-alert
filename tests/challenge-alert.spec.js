import { test, expect } from '@playwright/test';
import { ChallengePage } from '../pages/ChallengePage.js';
import { getAISummary } from '../utils/aiSummarize.js';
import { sendEmail } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

test.describe.configure({ mode: 'serial' });

let challengePage;
test.beforeEach(async ({ page }) => {
    challengePage = new ChallengePage(page);
});

test('Navigate to Challenge Page', async () => {
  await challengePage.goto();
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

test('Weekly QA Challenge Alert', async () => {
    const challenges = await challengePage.getLiveChallengeLinksAndTitles();
    const challengeSummaries = [];
    for (const ch of challenges) {
        try {
            console.log(`🔍 Visiting challenge: ${ch.title}`);
            await challengePage.goto(ch.link, { waitUntil: 'domcontentloaded', timeout: 30000 });
            const htmlContent = await challengePage.page.content();
            console.log(`📝 Summarizing challenge: ${ch.title}`);
            const summary = await getAISummary(htmlContent);
            challengeSummaries.push(`### ${ch.title}\n${summary}`);
        } catch (error) {
            console.error(`❌ Failed to summarize challenge: ${ch.title}`, error.message);
        }
    }

    const finalSummary = challengeSummaries.join('\n\n');
    await sendEmail('🧠 Weekly Challenges from HackerEarth', finalSummary);
}, 900000); // 15 minutes timeout for this test only
