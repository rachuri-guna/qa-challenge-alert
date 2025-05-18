export function summarizeChallenges(challenges) {
    return challenges.map((ch, index) => {
        return `🔹 ${ch.title}\n🔗 ${ch.link}`;
    }).join("\n\n");
}
