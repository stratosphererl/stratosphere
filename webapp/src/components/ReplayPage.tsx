import { useState, useEffect } from "react";
import GoalChart from "./replay-graphs/GoalChart";

import GraphLegend from "./replay-graphs/GraphLegend";
import PlayerBarGraph from "./replay-graphs/PlayerBarGraph";
import TugGraph from "./replay-graphs/TugGraph";

import goal_chart_data from "./replay-graphs/goal_chart_data"
import PositionHeatmap from "./replay-graphs/position";
import TestPositionHeatmap from "./replay-graphs/TestHeatmap";

const data: any[] = [
    {
        "name": "Player 1",
        "Goals": 2,
        "Assists": 1,
        "Saves": 2,
        "Shots": 3,
    },
    {
        "name": "Player 2",
        "Goals": 1,
        "Assists": 2,
        "Saves": 1,
        "Shots": 2,
    },
    {
        "name": "Player 3",
        "Goals": 1,
        "Assists": 1,
        "Saves": 1,
        "Shots": 1,
    },
    {
        "name": "Player 4",
        "Goals": 3,
        "Assists": 1,
        "Saves": 1,
        "Shots": 4,
    },
    {
        "name": "Player 5",
        "Goals": 1,
        "Assists": 3,
        "Saves": 1,
        "Shots": 3,
    },
    {
        "name": "Player 6",
        "Goals": 1,
        "Assists": 1,
        "Saves": 1,
        "Shots": 1,
    }
];

const group_label = "name";

const sub_groups = ["Goals", "Assists", "Saves", "Shots"];

const tug_graph_data = [{}, {}] as [any, any];

sub_groups.forEach((key) => {
    tug_graph_data[0][key] = data.slice(0, 3).map((d) => d[key]).reduce((x, y) => x + y) as number;
});
sub_groups.forEach((key) => {
    tug_graph_data[1][key] = data.slice(3, 6).map((d) => d[key]).reduce((x, y) => x + y) as number;
});

export default function() {
        
    return (
        <div>
            <div id="player-bar-graph" className="flex">
                <PlayerBarGraph data={data} group_label={group_label} sub_groups={sub_groups} />
                <GraphLegend keys={sub_groups} />
            </div>
            <div id="team-tug-graph">
                <TugGraph data={tug_graph_data} sub_groups={sub_groups} />
            </div>
            <div>
                <GoalChart data={goal_chart_data} data_display={["Scorer", "Speed"]} postfixes={{"Speed": " kph"}} />
            </div>
            <div className="pt-10">
                <PositionHeatmap />
            </div>
            <div className="pt-10">
                <TestPositionHeatmap />
            </div>
        </div>
    )
}