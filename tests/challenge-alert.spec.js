import { test, expect } from '@playwright/test';
import { ChallengePage } from '../pages/ChallengePage.js';
import { getAISummary } from '../utils/aiSummarize.js';
import { sendEmail } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

test('Weekly QA Challenge Alert', async ({ page }) => {
    const challengePage = new ChallengePage(page);
    await challengePage.goto();

    // await expect(await challengePage.isHeadingVisible()).toBeTruthy();

    const challenges = await challengePage.getLiveChallengeLinksAndTitles();

    const challengeSummaries = [];

    for (const ch of challenges) {
      await page.goto(ch.link);
      const htmlContent = await page.content(); // full HTML of challenge page
    
      const summary = await getAISummary(htmlContent);
      challengeSummaries.push(summary);
    }
    
    const finalSummary = challengeSummaries.join('\n\n');
    await sendEmail('🧠 Weekly Challenges from HackerEarth', finalsummary);
});
