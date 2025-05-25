import { test, expect } from '@playwright/test';
import { ChallengePage } from '../pages/ChallengePage.js';
import { getAISummary } from '../utils/aiSummarize.js';
import { sendEmail } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

test('Weekly QA Challenge Alert', async ({ page }) => {
    const challengePage = new ChallengePage(page);
    await challengePage.goto();

    const headingVisible = await challengePage.isHeadingVisible();
    await expect(headingVisible).toBeTruthy();

    const challenges = await challengePage.getLiveChallengeLinksAndTitles();

    if (!challenges.length) {
        console.warn('⚠️ No live challenges found. Skipping summarization and email.');
        return;
    }

    const challengeSummaries = [];

    for (const ch of challenges) {
        try {
            console.log(`🔍 Visiting challenge: ${ch.title}`);
            await page.goto(ch.link, { waitUntil: 'domcontentloaded', timeout: 30000 });
            const htmlContent = await page.content();

            const summary = await getAISummary(htmlContent);
            challengeSummaries.push(`### ${ch.title}\n${summary}`);
        } catch (error) {
            console.error(`❌ Failed to summarize challenge: ${ch.title}`, error.message);
        }
    }

    const finalSummary = challengeSummaries.join('\n\n');
    await sendEmail('🧠 Weekly Challenges from HackerEarth', finalSummary);
});
