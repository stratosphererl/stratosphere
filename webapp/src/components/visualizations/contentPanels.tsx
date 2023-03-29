import TugGraph from "./tug";
import PlayerBarGraph from "./stacked";

import ResponseDataWrapper from "../../data/ResponseDataWrapper"
import GraphLegend from "./legend";

interface Props {
    data: ResponseDataWrapper;
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
                                <tr className="text-center text-xl" style={{backgroundColor: (index ? "var(--sky-orange)" : "var(--sky-blue)"), border: "1px solid", borderColor: "black"}}>
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

    const [teamComparisonData, teamComparisonGroups, teamComparisonGroupNames]: any[] = data.getTeamTugData();

    return (<>
        <h1 className="text-center">Team Comparison</h1>
        <div className="w-full flex justify-center">
            <TugGraph data={teamComparisonData} sub_groups={teamComparisonGroups} sub_group_names={teamComparisonGroupNames} svg_width={1500} svg_height={800} 
            colors={["var(--sky-blue)", "var(--sky-orange)"]} />
        </div>
    </>)
}

export function BoostAnalysis({data}: Props) {
    const boostData = data.getBoostData() as any;
    const displayNames: {[key: string]: string} = {
        "small_pads": "Small Pads",
        "big_pads": "Big Pads",
        "time_full": "Time Full",
        "time_low": "Time Low",
        "time_empty": "Time with Empty",
        "wasted_small": "Wasted Small",
        "wasted_big": "Wasted Big",
    }

    const label = "name";
    const collected_groups = ["small_pads", "big_pads"];
    const collected_colors = ["var(--sky-blue)", "var(--sky-orange)"];

    const time_groups = ["time_full", "time_low", "time_empty"];
    const time_colors = ["var(--sky-blue)", "var(--sky-orange)", "white"];

    const wasted_groups = ["wasted_big", "wasted_small"];
    const wasted_colors = ["var(--sky-blue)", "var(--sky-orange)"];

    return (<>
        <h1 className="text-center">Boost Analysis</h1>
        <div className="w-full flex flex-col justify-center">
            <h2 className="text-center mt-5 underline">Boost Collected</h2>
            <div className="w-full flex justify-between">
                <div className="w-[70%]">
                    <PlayerBarGraph data={boostData} group_label={label} sub_groups={collected_groups} svg_width={1500} svg_height={600} sub_group_display_names={displayNames}
                    margin={{left: 100, right: 100, top: 20, bottom: 50}} color_scale={collected_colors} axis_font_size={30} />
                </div>
                <div className="w-[30%] flex flex-col justify-center">
                    <GraphLegend keys={collected_groups.map((key) => displayNames[key])} svg_width={1500} svg_height={400} colors={collected_colors} />
                </div>
            </div>

            <h2 className="text-center mt-10 underline">Time with Boost Levels</h2>
            <div className="w-full flex justify-between">
                <div className="w-[70%]">
                    <PlayerBarGraph data={boostData} group_label={label} sub_groups={time_groups} svg_width={1500} svg_height={600} sub_group_display_names={displayNames}
                    margin={{left: 100, right: 100, top: 20, bottom: 50}} color_scale={time_colors} axis_font_size={30} ticks={5} />
                </div>
                <div className="w-[30%] flex flex-col justify-center">
                    <GraphLegend keys={time_groups.map((key) => displayNames[key])} svg_width={1500} svg_height={400} colors={time_colors} />
                </div>
            </div>

            <h2 className="text-center mt-10 underline">Boost Wasted</h2>
            <div className="w-full flex justify-between">
                <div className="w-[70%]">
                    <PlayerBarGraph data={boostData} group_label={label} sub_groups={wasted_groups} svg_width={1500} svg_height={600} sub_group_display_names={displayNames}
                    margin={{left: 100, right: 100, top: 20, bottom: 50}} color_scale={wasted_colors} axis_font_size={30} ticks={5} />
                </div>
                <div className="w-[30%] flex flex-col justify-center">
                    <GraphLegend keys={wasted_groups.map((key) => displayNames[key])} svg_width={1500} svg_height={400} colors={wasted_colors} />
                </div>
            </div>
        </div>
    </>)
}