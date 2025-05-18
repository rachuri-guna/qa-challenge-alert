import { test, expect } from '@playwright/test';
import { ChallengePage } from '../pages/ChallengePage.js';
import { summarizeChallenges } from '../utils/summarize.js';
import { sendEmail } from '../utils/email.js';
import dotenv from 'dotenv';
dotenv.config();

test('Weekly QA Challenge Alert', async ({ page }) => {
    const challengePage = new ChallengePage(page);
    await challengePage.goto();

    await expect(await challengePage.isHeadingVisible()).toBeTruthy();

    const challenges = await challengePage.getLiveChallengeLinksAndTitles();

    const summary = summarizeChallenges(challenges);

    await sendEmail('🧠 Weekly Challenges from HackerEarth', summary);
});
