export class ChallengePage {
    constructor(page) {
        this.page = page;
        this.heading = page.getByRole('heading', {
            name: 'Hackathons, Programming Challenges, and Coding Competitions'
        });
        this.liveSection = page.locator("//div[@class='ongoing challenge-list']");
        this.challengeCards = this.liveSection.locator("//div[@class='challenge-card-modern']");
    }

    async goto() {
        await this.page.goto('https://www.hackerearth.com/challenges/');
    }

    async isHeadingVisible() {
        return this.heading.isVisible();
    }

    async getLiveChallengeLinksAndTitles() {
        const links = [];
        const count = await this.challengeCards.count();
        for (let i = 0; i < count; i++) {
            const card = this.challengeCards.nth(i);
            const title = await card.locator(".challenge-name").textContent();
            const link = await card.locator("a.challenge-card-link").getAttribute("href");
            links.push({ title: title.trim(), link: `https://www.hackerearth.com${link}` });
        }
        return links;
    }
}
