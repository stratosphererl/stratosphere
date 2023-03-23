import GoalChart from "./visualizations/goals";

import GraphLegend from "./visualizations/legend";
import PlayerBarGraph from "./visualizations/stacked";
import TugGraph from "./visualizations/tug";

import goal_chart_data from "./visualizations/mock_data/goal_chart_data"
import Heatmap from "./visualizations/heatmap";

import TestHeatmapData from "./visualizations/mock_data/position_heatmap_data";

import stadium from "../assets/std-stadium-stolen-temporarily.svg";

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

    const width_height_ratio = 362 / 246;
    const width = 1000
        
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
                <GoalChart 
                    data={goal_chart_data} 
                    data_display={["Scorer", "Speed"]} 
                    postfixes={{"Speed": " kph"}} 
                    underlayed_image={stadium} 
                    svg_height={width / width_height_ratio}
                    svg_width={width}
                />
            </div>
            <div className="pt-10">
                <div style={{width: width, height: width / width_height_ratio}} >
                    <Heatmap 
                        data={TestHeatmapData} 
                        svg_width={width} 
                        svg_height={width / width_height_ratio} 
                        size={width * .008} 
                        x_domain={[-5000, 5000]}
                        y_domain={[-7500, 7500]}
                        color_range={["transparent", "grey", "green", "orange", "red"]}
                        color_density={15}
                        overlayed_image={stadium}
                        // underlayed_image={stadium}
                    />
                </div>
            </div>
        </div>
    )
}