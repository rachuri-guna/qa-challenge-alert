export class ChallengePage {
    constructor(page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Hackathons, Programming Challenges, and Coding Competitions' });
        this.liveSection = page.locator("//div[@class='ongoing challenge-list']");
        this.challengeCards = this.liveSection.locator("//div[@class='challenge-card-modern']");
    }

    async goto() {
        console.log('Navigating to challenges page...');
        await this.page.goto('https://www.hackerearth.com/challenges/', {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
        });
    }

    async isHeadingVisible() {
        console.log('Checking if heading is visible...');
        await this.heading.waitFor({ state: 'visible' });
        const visible = await this.heading.isVisible();
        return visible;
    }

    async getLiveChallengeLinksAndTitles() {
        console.log('Fetching live challenge links and titles...');
        const links = [];
        const count = await this.challengeCards.count();
        for (let i = 0; i < count; i++) {
            const card = this.challengeCards.nth(i);
            const title = await card.locator('.challenge-name').textContent();
            const link = await card.locator('a.challenge-card-link').getAttribute('href');
            if (!title || !link) continue;

            const absoluteLink = link.startsWith('http') ? link : `https://www.hackerearth.com${link}`;
            links.push({ title: title.trim(), link: absoluteLink });
        }
        return links;
    }
}

