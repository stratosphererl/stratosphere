import TugGraph from "./tug";

import ResponseWrapper from "../../data/ResponseWrapper"

interface Props {
    data: ResponseWrapper;
}

export function Scoreboard({data}: Props) {
    const teams = data.getScoreboardData();

    const goals = teams.map((team) => team.reduce((acc, player) => acc + player.goals, 0))

    return (
        <>
            <h1 className="text-center">Scoreboard</h1>
            <div className="pt-8 px-16 flex flex-col space-y-8">
                {teams.map((team, index) =>
                    <div>
                        <div className="text-center font-extrabold text-2xl mb-2">{goals[index]} {index ? "Orange Team" : "Blue Team"}</div>
                        <table className="w-full">
                            <tr className="text-4xl">
                                <th className="pb-2">Player</th>
                                <th className="pb-2">Score</th>
                                <th className="pb-2">Goals</th>
                                <th className="pb-2">Assists</th>
                                <th className="pb-2">Saves</th>
                                <th className="pb-2">Shots</th>
                            </tr>
                            {team.map((player) => 
                                <tr className="text-center text-xl" style={{backgroundColor: (index ? "orange" : "blue"), border: "1px solid", borderColor: "black"}}>
                                    <td className="py-2">{player.name}</td>
                                    <td className="py-2">{player.score}</td>
                                    <td className="py-2">{player.goals}</td>
                                    <td className="py-2">{player.assists}</td>
                                    <td className="py-2">{player.saves}</td>
                                    <td className="py-2">{player.shots}</td>
                                </tr>
                            )}
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}

export function TeamComparison({data}: Props) {

    const teamComparisonData = [
        {goals: 10, saves: 10, shots: 10},
        {goals: 5, saves: 5, shots: 5},
    ] as [any, any];

    const teamComparisonGroups = [
        "goals",
        "saves",
        "shots",
    ]

    return (<>
        <h1 className="text-center">Team Comparison</h1>
        <div className="w-full flex justify-center">
            <TugGraph data={teamComparisonData} sub_groups={teamComparisonGroups} />
        </div>
    </>)
}