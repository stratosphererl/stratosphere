interface ScorebaordEntry {name: string, score: number, goals: number, assists: number, saves: number, shots: number}
interface TeamTugEntry {possession: number, goals: number, saves: number, shots: number, assists: number, 
    aerials: number, clears: number, hits: number, demos: number, boost: number}
interface BoostDataEntry {name: string, small_pads: number, big_pads: number, time_full: number, time_low: number, 
    time_empty: number, time_decent: number, wasted_small: number, wasted_big: number, boost_used: number}
interface HitDataEntry {name: string, goals: number, assists: number, saves: number, shots: number, clears: number, demos: number}

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

    private getTeamTugEntry(isOrange: boolean): TeamTugEntry {
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

    private getTeamsPlayers() {
        const team1 = this.data.players.filter((player: any) => player.isOrange == 0) as any[];
        const team2 = this.data.players.filter((player: any) => player.isOrange == 1) as any[];

        return [team1, team2];
    }

    getPlayerHitData(insertSeparator: boolean = false) {
        const [team1, team2] = this.getTeamsPlayers();

        const hitData: HitDataEntry[] = [];

        const addHitData = (team: any[]) => {
            team.forEach((player: any) => {
                hitData.push({
                    name: player.name,
                    goals: player.goals,
                    assists: player.assists,
                    saves: player.saves,
                    shots: player.shots,
                    clears: player.stats.hitCounts.totalClears,
                    demos: player.stats.demoStats?.numDemosInflicted ?? 0,
                });
            });
        }

        addHitData(team1);

        if (insertSeparator) {
            hitData.push({
                name: "",
                goals: 0,
                assists: 0,
                saves: 0,
                shots: 0,
                clears: 0,
                demos: 0,
            });
        }

        addHitData(team2);

        return hitData;

    }

    getBoostData(insertSeparator: boolean = false) {
        const [team1, team2] = this.getTeamsPlayers();
        
        const boostData: BoostDataEntry[] = [];

        const addBoostData = (team: any[]) => {
            team.forEach((player: any) => {
                const boostStats = player.stats.boost;
                boostData.push({
                    name: player.name,
                    small_pads: boostStats.numSmallBoosts,
                    big_pads: boostStats.numLargeBoosts,
                    time_full: boostStats.timeFullBoost,
                    time_low: boostStats.timeLowBoost,
                    time_empty: boostStats.timeNoBoost,
                    time_decent: this.data.gameMetadata.length - boostStats.timeFullBoost - boostStats.timeLowBoost - boostStats.timeNoBoost,
                    wasted_small: boostStats.wastedSmall,
                    wasted_big: boostStats.wastedBig,
                    boost_used: boostStats.boostUsage,
                });
            });
        }

        addBoostData(team1);

        if (insertSeparator) {
            boostData.push({
                name: "",
                small_pads: 0,
                big_pads: 0,
                time_full: 0,
                time_low: 0,
                time_empty: 0,
                time_decent: 0,
                wasted_small: 0,
                wasted_big: 0,
                boost_used: 0,
            });
        }

        addBoostData(team2);

        return boostData;
    }

    getPossessionTimes(insertSeparator: boolean = false) {
        const [team1, team2] = this.getTeamsPlayers();

        const possessionData: {name: string, possession: number}[] = [];

        const addPossessionData = (team: any[]) => {
            team.forEach((player: any) => {
                possessionData.push({
                    name: player.name,
                    possession: player.stats.possession.possessionTime,
                });
            });
        }

        addPossessionData(team1);

        if (insertSeparator) {
            possessionData.push({
                name: "",
                possession: 0,
            });
        }

        addPossessionData(team2);

        return possessionData;
    }

    getDribbleData(insertSeparator: boolean = false) {
        const [team1, team2] = this.getTeamsPlayers();

        const dribbleData: {name: string, dribbles: number, dribbleTime: number}[] = [];

        const addDribbleData = (team: any[]) => {
            team.forEach((player: any) => {
                dribbleData.push({
                    name: player.name,
                    dribbles: player.stats.ballCarries?.totalCarries ?? 0,
                    dribbleTime: player.stats.ballCarries?.totalCarryTime ?? 0,
                });
            });
        }

        addDribbleData(team1);

        if (insertSeparator) {
            dribbleData.push({
                name: "",
                dribbles: 0,
                dribbleTime: 0,
            });
        }

        addDribbleData(team2);

        return dribbleData;
    }

    getAerialPosistionData(insertSeparator: boolean = false) {
        const [team1, team2] = this.getTeamsPlayers();

        const aerialData: {name: string, ground: number, low: number, high: number}[] = [];

        const addAerialData = (team: any[]) => {
            team.forEach((player: any) => {
                const positionalTendencies = player.stats.positionalTendencies;
                aerialData.push({
                    name: player.name,
                    ground: positionalTendencies?.timeOnGround ?? 0,
                    low: positionalTendencies?.timeLowInAir ?? 0,
                    high: positionalTendencies?.timeHighInAir ?? 0,
                });
            });
        };

        addAerialData(team1);

        if (insertSeparator) {
            aerialData.push({
                name: "",
                ground: 0,
                low: 0,
                high: 0,
            });
        }

        addAerialData(team2);

        return aerialData;
    }

    getPlayerPositionViaBall() {
        const [team1, team2] = this.getTeamsPlayers();
        const players = team1.concat(team2);

        const positionData: [{ [key: string]: number }, { [key: string]: number }] = [{},{}];

        players.forEach((player: any) => {
            positionData[0][player.name] = player.stats.positionalTendencies?.timeBehindBall ?? 0;
        });
        players.forEach((player: any) => {
            positionData[1][player.name] = player.stats.positionalTendencies?.timeInFrontBall ?? 0;
        });

        return [positionData as [any, any], players.map((player: any) => player.name) as string[]];
    }

    private getFieldPositioning(positionalTendencies: any) {
        return {
            defendingHalf: (positionalTendencies?.timeInDefendingHalf ?? 0) as number,
            attackingHalf: (positionalTendencies?.timeInAttackingHalf ?? 0) as number,
            defendingThird: (positionalTendencies?.timeInDefendingThird ?? 0) as number,
            neutralThird: (positionalTendencies?.timeInNeutralThird ?? 0) as number,
            attackingThird: (positionalTendencies?.timeInAttackingThird ?? 0) as number,
        }
    }

    getPlayerPositionData(frameData: any) {
        const positionData: {
            name: string,
            tendencies: { defendingHalf: number, attackingHalf: number, 
                defendingThird: number, neutralThird: number, attackingThird: number },
            positions: { x: number, y: number }[],
            isOrange: boolean,
        }[][] = [];

        const [team1, team2] = this.getTeamsPlayers();

        const nameToIndex = new Map();
        if (frameData?.length)
            frameData[0].forEach((entity: any, index: number) => {
                nameToIndex.set(entity.name, index);
            });

        const addPositionData = (team: any[]) => {
            const teamData: {
                name: string,
                tendencies: { defendingHalf: number, attackingHalf: number,
                    defendingThird: number, neutralThird: number, attackingThird: number },
                positions: { x: number, y: number }[],
                isOrange: boolean
            }[] = [];

            team.forEach((player: any) => {
                const positionalTendencies = player.stats.positionalTendencies;

                const name = player.name;
                const tendencies = this.getFieldPositioning(positionalTendencies);
                const positions: { x: number, y: number }[] = [];
                const isOrange = player.isOrange as boolean;

                if (frameData?.length) {
                    let lastPosition: { x: number, y: number } = { x: 10000, y: 10000 };
                    frameData.forEach((frame: any) => {
                        const index = nameToIndex.get(name);
                        const entity = frame[index];
                        if (typeof entity?.position?.x === "number" && typeof entity?.position?.y === "number" 
                            && (Math.abs(entity.position.x - lastPosition.x) > 0.1 || Math.abs(entity.position.y - lastPosition.y) > 0.1)){
                            positions.push({ x: entity.position.y, y: entity.position.x });
                            lastPosition = { x: entity.position.x, y: entity.position.y };
                        }
                    });
                }

                teamData.push({ name: name, tendencies: tendencies, positions: positions, isOrange: isOrange })
            });

            positionData.push(teamData);
        }

        addPositionData(team1);
        addPositionData(team2);

        return positionData;
    }

    getBallPositionData(frames: any[]) {
        const name = "Ball Heatmap";
        const tendencies = this.getFieldPositioning(this.data.gameStats.ballStats.positionalTendencies);
        const positions: { x: number, y: number }[] = [{ x: 0, y: 0 }];

        // TODO: Push positional data
        if (frames.length) {
            const ballIndex = frames[0].findIndex((entity: any) => entity.name === "ball");
            let lastPosition: { x: number, y: number } = { x: 10000, y: 10000 };
            frames.forEach((frame: any) => {
                const ball = frame[ballIndex];
                if (typeof ball?.position?.x === "number" && typeof ball?.position?.y === "number"
                    && (Math.abs(ball.position.x - lastPosition.x) > 0.1 || Math.abs(ball.position.y - lastPosition.y) > 0.1)) {
                    positions.push({ x: ball.position.y, y: ball.position.x });
                    lastPosition = { x: ball.position.x, y: ball.position.y };
                }
            });
        }

        const ballData = {
            name: name,
            tendencies: tendencies,
            positions: positions
        };

        return ballData;
    }

    private getPlayerFromId(id: string) {
        return this.data.players.find((player: any) => player.id.id === id);
    }

    getGoalData(frames: any[]) {
        const goals = this.data.gameMetadata.goals as any[];

        console.log(frames)

        const goalData = goals.map((goal: any) => {
            let frameNumber = goal.frameNumber;

            let x = 0;
            let y = 0;
            let velocity = 0;

            if (frames.length) {
                const ballIndex = frames[0].findIndex((entity: any) => entity.name === "ball");
                while (!Number.isFinite(frames[frameNumber][ballIndex].velocity.y))
                    frameNumber--;
                
                const ball = frames[frameNumber][ballIndex];

                x = ball.position.x;

                velocity = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2) * .03623188;
            }

            const player = this.getPlayerFromId(goal.playerId.id);
                
            // Todo: Check if the player is orange and invert x depending on that (I don't know which way around it is yet)

            return {
                name: player.name,
                x: x,
                y: y,
                velocity: velocity,
            }
        });

        return goalData;
    }
}