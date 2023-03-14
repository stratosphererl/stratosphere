import GraphLegend from "./replay-graphs/GraphLegend";
import PlayerBarGraph from "./replay-graphs/PlayerBarGraph";

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

export default function() {
    return (
        <div className="flex">
            <PlayerBarGraph data={data} group_label={group_label} sub_groups={sub_groups} />
            <GraphLegend keys={sub_groups} />
        </div>
    )
}