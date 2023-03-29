interface ScorebaordEntry {name: string, score: number, goals: number, assists: number, saves: number, shots: number}
interface TeamTugEntry {possession: number, goals: number, saves: number, shots: number, assists: number, 
    aerials: number, clears: number, hits: number, demos: number, boost: number}

export default class ResponseDataWrapper {
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

    getTeamTugEntry(isOrange: boolean): TeamTugEntry {
        const team: any = this.data.teams.find((team: any) => team.isOrange == isOrange);
        const players: any[] = this.data.players.filter((player: any) => player.isOrange == isOrange);

        const tugEntry = {
            possession: team.stats.possession.possessionTime as number,
            goals: team.score as number,
            saves: players.map((player: any) => player.saves).reduce((a: number, b: number) => a + b, 0) as number,
            shots: players.map((player: any) => player.shots).reduce((a: number, b: number) => a + b, 0) as number,
            assists: players.map((player: any) => player.assists).reduce((a: number, b: number) => a + b, 0) as number,
            aerials: team.stats.hitCounts.totalAerials as number,
            clears: team.stats.hitCounts.totalClears as number,
            hits: team.stats.hitCounts.totalHits as number,
            demos: players.map((player: any) => player.stats.demoStats?.numDemosInflicted ?? 0).reduce((a: number, b: number) => a + b, 0) as number,
            boost: players.map((player: any) => player.stats.boost.boostUsage).reduce((a: number, b: number) => a + b, 0) as number,
        };

        return tugEntry;
    }

    getTeamTugData() {
        const key_names = {
            possession: "Possession Time (sec)",
            goals: "Goals",
            saves: "Saves",
            shots: "Shots",
            assists: "Assists",
            aerials: "Aerial Hits",
            clears: "Clears",
            hits: "Hits",
            demos: "Demos",
            boost: "Boost Used"
        }

        const keys = Object.keys(key_names);

        const teams: [TeamTugEntry, TeamTugEntry] = [
            this.getTeamTugEntry(false),
            this.getTeamTugEntry(true)
        ];

        return [teams, keys, key_names]
    }

}