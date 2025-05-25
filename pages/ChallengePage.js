export class ChallengePage {
    constructor(page) {
        this.page = page;
        this.heading = page.locator('#challenge-list-title');
        this.liveSection = page.locator("//div[@class='ongoing challenge-list']");
        this.challengeCards = this.liveSection.locator("//div[@class='challenge-card-modern']");
    }

    async goto() {
        console.log('Navigating to challenges page...');
        await this.page.goto('https://www.hackerearth.com/challenges/', { waitUntil: 'networkidle' });
    }

    async isHeadingVisible() {
        console.log('Checking if heading is visible...');
        try {
            await this.heading.waitFor({ state: 'visible', timeout: 15000 });
            const visible = await this.heading.isVisible();
            return visible;
        } catch (e) {
            // Take a screenshot and save the HTML for debugging
            await this.page.screenshot({ path: 'ci-debug.png', fullPage: true });
            const html = await this.page.content();
            require('fs').writeFileSync('ci-debug.html', html);
            console.error('Heading not visible:', e);
            return false;
        }
    }

    async getLiveChallengeLinksAndTitles() {
        console.log('Fetching live challenge links and titles...');
        const links = [];
        const count = await this.challengeCards.count();
        console.log(`Found ${count} challenge cards.`);
        for (let i = 0; i < count; i++) {
            const card = this.challengeCards.nth(i);
            const title = await card.locator(".challenge-name").textContent();
            const link = await card.locator("a.challenge-card-link").getAttribute("href");
            const absoluteLink = link.startsWith('http') ? link : `https://www.hackerearth.com${link}`;
            links.push({ title: title.trim(), link: absoluteLink });
        }
        return links;
    }
}
