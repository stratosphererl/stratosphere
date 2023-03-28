interface ScorebaordEntry {name: string, score: number, goals: number, assists: number, saves: number, shots: number}

export default class ResponseWrapper {
    constructor(private data: any) {}

    getScoreboardData() {
        const teams: [ScorebaordEntry[], ScorebaordEntry[]] = [[],[]];
        this.data.players.forEach((player: any) => {
            teams[player.isOrange].push({
                name: player.name,
                score: player.score,
                goals: player.goals,
                assists: player.assists,
                saves: player.saves,
                shots: player.shots,
            })
        });

        teams.forEach((team) => team.sort((a, b) => b.score - a.score));

        return teams;
    }

}