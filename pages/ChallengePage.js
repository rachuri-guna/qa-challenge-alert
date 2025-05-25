export class ChallengePage {
    constructor(page) {
        this.page = page;
        this.heading = page.locator('#challenge-list-title');
        this.liveSection = page.locator("//div[@class='ongoing challenge-list']");
        this.challengeCards = this.liveSection.locator("//div[@class='challenge-card-modern']");
    }

    async goto() {
        console.log('Navigating to challenges page...');
        await this.page.goto('https://www.hackerearth.com/challenges/');
    }

    async isHeadingVisible() {
        console.log('Checking if heading is visible...');
        return this.heading.isVisible();
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
