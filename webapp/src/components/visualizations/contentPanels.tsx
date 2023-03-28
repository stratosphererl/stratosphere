import TugGraph from "./tug";
import PlayerBarGraph from "./stacked";

import ResponseDataWrapper from "../../data/ResponseDataWrapper";
import GraphLegend from "./legend";
import Heatmap from "./heatmap";
import GoalChart from "./goals";

import stadium from "../../assets/std-stadium-stolen-temporarily.svg";
import stadiumUnderlay from "../../assets/stadium.svg";
import stadiumOverlay from "../../assets/stadium-outline.svg";
import goalSVG from "../../assets/goal.svg";

interface Props {
  data: ResponseDataWrapper;
}

export function Scoreboard({ data }: Props) {
  const teams = data.getScoreboardData();

  const goals = teams.map((team) =>
    team.reduce((acc, player) => acc + player.goals, 0)
  );

  return (
    <>
      <h1 className="text-center">Scoreboard</h1>
      <div className="pt-8 px-16 flex flex-col space-y-8">
        {teams.map((team, index) => (
          <div key={`score-table-${index}`}>
            <div className="text-center font-extrabold text-2xl mb-2">
              {goals[index]} {index ? "Orange Team" : "Blue Team"}
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-4xl">
                  <th className="pb-2">Player</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Goals</th>
                  <th className="pb-2">Assists</th>
                  <th className="pb-2">Saves</th>
                  <th className="pb-2">Shots</th>
                </tr>
              </thead>
              <tbody>
                {team.map((player) => (
                  <tr
                    key={`table-entry-${player.name}`}
                    className="text-center text-xl"
                    style={{
                      backgroundColor: index
                        ? "var(--sky-orange)"
                        : "var(--sky-blue)",
                      border: "1px solid",
                      borderColor: "black",
                    }}
                  >
                    <td className="py-2">{player.name}</td>
                    <td className="py-2">{player.score}</td>
                    <td className="py-2">{player.goals}</td>
                    <td className="py-2">{player.assists}</td>
                    <td className="py-2">{player.saves}</td>
                    <td className="py-2">{player.shots}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}

export function TeamComparison({ data }: Props) {
  const [
    teamComparisonData,
    teamComparisonGroups,
    teamComparisonGroupNames,
  ]: any[] = data.getTeamTugData();

  return (
    <>
      <h1 className="text-center">Team Comparison</h1>
      <div className="w-full flex justify-center">
        <TugGraph
          data={teamComparisonData}
          sub_groups={teamComparisonGroups}
          sub_group_names={teamComparisonGroupNames}
          svg_width={1500}
          svg_height={800}
          colors={["var(--sky-blue)", "var(--sky-orange)"]}
        />
      </div>
    </>
  );
}

export function PlayerComparison({ data }: Props) {
  const playerData = data.getPlayerHitData() as any;
  const displayNames: { [key: string]: string } = {
    goals: "Goals",
    assists: "Assists",
    saves: "Saves",
    shots: "Shots",
    clears: "Clears",
    demos: "Demos",
  };

  const label = "name";
  const groups = ["goals", "assists", "saves", "shots", "clears", "demos"];
  const colors = [
    "var(--sky-blue)",
    "var(--sky-orange)",
    "var(--sky-green)",
    "var(--sky-purple)",
    "var(--sky-yellow)",
    "var(--sky-red)",
  ];

  return (
    <>
      <h1 className="text-center">Player Comparison</h1>
      <div className="w-full flex justify-between">
        <div className="w-[70%]">
          <PlayerBarGraph
            data={playerData}
            group_label={label}
            sub_groups={groups}
            svg_width={1500}
            svg_height={1000}
            sub_group_display_names={displayNames}
            margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
            color_scale={colors}
            axis_font_size={30}
            default_oppacity={0.9}
          />
        </div>
        <div className="w-[30%] flex flex-col justify-center">
          <GraphLegend
            colors={colors}
            keys={groups.map((group) => displayNames[group])}
            svg_width={500}
            svg_height={400}
          />
        </div>
      </div>
    </>
  );
}

export function BoostAnalysis({ data }: Props) {
  const boostData = data.getBoostData() as any;
  const displayNames: { [key: string]: string } = {
    small_pads: "Small Pads",
    big_pads: "Big Pads",
    time_full: "Time Full",
    time_low: "Time Low",
    time_empty: "Time Empty",
    time_decent: "Time Decent",
    wasted_small: "Wasted Small",
    wasted_big: "Wasted Big",
    boost_used: "Boost Used",
  };

  const label = "name";

  const used_groups = ["boost_used"];
  const used_colors = ["var(--sky-blue)"];

  const collected_groups = ["small_pads", "big_pads"];
  const collected_colors = ["var(--sky-blue)", "var(--sky-orange)"];

  const time_groups = ["time_empty", "time_low", "time_decent", "time_full"];
  const time_colors = [
    "var(--sky-red)",
    "var(--sky-orange)",
    "var(--sky-yellow)",
    "var(--sky-green)",
  ];

  const wasted_groups = ["wasted_big", "wasted_small"];
  const wasted_colors = ["var(--sky-blue)", "var(--sky-orange)"];

  return (
    <>
      <h1 className="text-center">Boost Analysis</h1>
      <div className="w-full flex flex-col justify-center">
        <h2 className="text-center mt-5 underline">Boost Used</h2>
        <div className="w-full flex justify-between">
          <div className="w-[70%]">
            <PlayerBarGraph
              data={boostData}
              group_label={label}
              sub_groups={used_groups}
              svg_width={1500}
              svg_height={600}
              sub_group_display_names={displayNames}
              margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
              color_scale={used_colors}
              axis_font_size={30}
            />
          </div>
        </div>

        <h2 className="text-center mt-5 underline">Boost Collected</h2>
        <div className="w-full flex justify-between">
          <div className="w-[70%]">
            <PlayerBarGraph
              data={boostData}
              group_label={label}
              sub_groups={collected_groups}
              svg_width={1500}
              svg_height={600}
              sub_group_display_names={displayNames}
              margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
              color_scale={collected_colors}
              axis_font_size={30}
            />
          </div>
          <div className="w-[30%] flex flex-col justify-center">
            <GraphLegend
              keys={collected_groups.map((key) => displayNames[key])}
              svg_width={1500}
              svg_height={400}
              colors={collected_colors}
            />
          </div>
        </div>

        <h2 className="text-center mt-10 underline">Time with Boost Levels</h2>
        <div className="w-full flex justify-between">
          <div className="w-[70%]">
            <PlayerBarGraph
              data={boostData}
              group_label={label}
              sub_groups={time_groups}
              svg_width={1500}
              svg_height={600}
              sub_group_display_names={displayNames}
              margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
              color_scale={time_colors}
              axis_font_size={30}
              ticks={5}
            />
          </div>
          <div className="w-[30%] flex flex-col justify-center">
            <GraphLegend
              keys={time_groups.map((key) => displayNames[key])}
              svg_width={1500}
              svg_height={700}
              colors={time_colors}
            />
          </div>
        </div>

        <h2 className="text-center mt-10 underline">Boost Wasted</h2>
        <div className="w-full flex justify-between">
          <div className="w-[70%]">
            <PlayerBarGraph
              data={boostData}
              group_label={label}
              sub_groups={wasted_groups}
              svg_width={1500}
              svg_height={600}
              sub_group_display_names={displayNames}
              margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
              color_scale={wasted_colors}
              axis_font_size={30}
              ticks={5}
            />
          </div>
          <div className="w-[30%] flex flex-col justify-center">
            <GraphLegend
              keys={wasted_groups.map((key) => displayNames[key])}
              svg_width={1500}
              svg_height={400}
              colors={wasted_colors}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function Possession({ data }: Props) {
  const possessionData = data.getPossessionTimes() as any;
  const dribbleData = data.getDribbleData() as any;

  return (
    <>
      <h1 className="text-center">Possession</h1>
      <div className="w-[75%] space-y-10 pt-10 m-auto text-center underline">
        <div>
          <h2>Possession Times</h2>
          <PlayerBarGraph
            data={possessionData}
            group_label="name"
            sub_groups={["possession"]}
            color_scale={["var(--sky-blue)"]}
            sub_group_display_names={{ possession: "Possession Time" }}
            margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
            svg_width={1500}
            svg_height={600}
            axis_font_size={30}
          />
        </div>

        <div>
          <h2>Dribbles</h2>
          <PlayerBarGraph
            data={dribbleData}
            group_label="name"
            sub_groups={["dribbles"]}
            color_scale={["var(--sky-orange)"]}
            sub_group_display_names={{ dribbles: "Dribbles" }}
            margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
            svg_width={1500}
            svg_height={600}
            axis_font_size={30}
          />
        </div>

        <div>
          <h2>Dribble Time</h2>
          <PlayerBarGraph
            data={dribbleData}
            group_label="name"
            sub_groups={["dribbleTime"]}
            color_scale={["var(--sky-orange)"]}
            sub_group_display_names={{ dribbleTime: "Dribble Time" }}
            margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
            svg_width={1500}
            svg_height={600}
            axis_font_size={30}
          />
        </div>
      </div>
    </>
  );
}

function DisplayTendency({
  tendency,
  color,
  percent_but_different,
}: {
  tendency: number;
  color: string;
  percent_but_different: number;
}) {
  const percent = tendency * 100;
  return (
    <div
      className="text-center text-xs 2xl:text-base"
      style={{
        backgroundColor: color,
        width: percent_but_different + "%",
        border: "solid #777 1px",
      }}
    >
      {percent.toFixed(0)}%
    </div>
  );
}

function HeatmapAndTendencies({
  name,
  tendencies,
  positions,
  isOrange,
}: {
  name?: string;
  tendencies: {
    defendingHalf: number;
    attackingHalf: number;
    defendingThird: number;
    neutralThird: number;
    attackingThird: number;
  };
  positions: { x: number; y: number }[];
  isOrange: boolean;
}) {
  const mapWidth = 2 * (5120 + 880);
  const mapHeight = 2 * 4096;

  const width = 200;

  const uu2px = width / mapWidth;
  const ball_size = 190;

  const color_range = [
    "transparent",
    "grey",
    "green",
    "yellow",
    "orange",
    "red",
  ];

  const totalTime = tendencies.defendingHalf + tendencies.attackingHalf;
  Object.keys(tendencies).forEach((key) => {
    (tendencies as any)[key] = (tendencies as any)[key] / totalTime;
  });

  return (
    <div key={`heatmap-${name}`} className="w-[80%] m-auto mt-[40px]">
      {name ? <h2 className="text-center">{name}</h2> : null}
      <div className="mb-2 w-[100%] mx-auto">
        <div className="flex justify-evenly">
          <DisplayTendency
            tendency={
              isOrange ? tendencies.attackingHalf : tendencies.defendingHalf
            }
            color={"var(--sky-blue)"}
            percent_but_different={50}
          />
          <DisplayTendency
            tendency={
              isOrange ? tendencies.defendingHalf : tendencies.attackingHalf
            }
            color={"var(--sky-orange)"}
            percent_but_different={50}
          />
        </div>
        <div className="flex justify-evenly">
          <DisplayTendency
            tendency={
              isOrange ? tendencies.attackingThird : tendencies.defendingThird
            }
            color={"var(--sky-blue)"}
            percent_but_different={(1 / 3) * 100}
          />
          <DisplayTendency
            tendency={tendencies.neutralThird}
            color="#999"
            percent_but_different={(1 / 3) * 100}
          />
          <DisplayTendency
            tendency={
              isOrange ? tendencies.defendingThird : tendencies.attackingThird
            }
            color={"var(--sky-orange)"}
            percent_but_different={(1 / 3) * 100}
          />
        </div>
      </div>
      <Heatmap
        data={positions}
        x_domain={[-mapWidth / 2, mapWidth / 2]}
        y_domain={[-mapHeight / 2, mapHeight / 2]}
        svg_width={width}
        svg_height={mapHeight * uu2px}
        size={ball_size * uu2px}
        underlayed_image={stadiumUnderlay}
        overlayed_image={stadiumOverlay}
        color_range={color_range}
      />
    </div>
  );
}

export function Position({ data }: Props) {
  const aerialData = data.getAerialPosistionData() as any;

  const nameLabel = "name";
  const aerialGroups = ["ground", "low", "high"];
  const aerialDisplayNames: { [key: string]: string } = {
    ground: "Ground",
    low: "Low",
    high: "High",
  };
  const aerialColors = [
    "var(--sky-orange)",
    "var(--sky-yellow)",
    "var(--sky-blue)",
  ];

  const [playerBallData, playerNames] = data.getPlayerPositionViaBall() as [
    [any, any],
    string[]
  ];
  const tugColors = ["var(--sky-green)", "var(--sky-red)"] as [string, string];

  const teamPlayerPositions = data.getPlayerPositionData();
  const playerPositions = teamPlayerPositions[0].concat(teamPlayerPositions[1]);

  return (
    <>
      <h1 className="text-center">Positioning</h1>
      <div className="space-y-10">
        <div className="mt-10 text-center">
          <h2 className="underline">Aerial Positions</h2>
          <p className="italic">
            Time in low air (below crossbar) and high air (above crossbar).
            Measured in seconds.
          </p>
          <div className="flex justify-between">
            <div className="w-[75%]">
              <PlayerBarGraph
                data={aerialData}
                group_label={nameLabel}
                sub_groups={aerialGroups}
                color_scale={aerialColors}
                sub_group_display_names={aerialDisplayNames}
                margin={{ left: 100, right: 100, top: 20, bottom: 50 }}
                svg_width={1500}
                svg_height={800}
                axis_font_size={30}
              />
            </div>
            <div className="w-[25%] flex flex-col justify-center">
              <GraphLegend
                keys={aerialGroups.map((key) => aerialDisplayNames[key])}
                svg_width={1500}
                svg_height={800}
                colors={aerialColors}
              />
            </div>
          </div>
        </div>
        <div className="mx-[5%]">
          <h2 className="text-center underline">Position via Ball</h2>
          <p className="text-center italic">
            Time spent behind and in front of the ball. Measured in seconds.
          </p>
          <div className="flex justify-between text-[10px] leading-[12px] md:text-lg sm:text-sm font-semibold">
            <div>Time Behind Ball</div>
            <div className="text-right">Time In Front of Ball</div>
          </div>
          <TugGraph
            data={playerBallData}
            sub_groups={playerNames}
            svg_width={1500}
            svg_height={800}
            outer_padding={0}
            colors={tugColors}
          />
        </div>
        <div>
          <h2 className="text-center underline mb-[-20px]">
            Player Position Heatmaps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {playerPositions.map((player) => (
              <HeatmapAndTendencies
                key={`heatmap-${player.name}`}
                name={player.name}
                tendencies={player.tendencies}
                positions={player.positions}
                isOrange={player.isOrange}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function Ball({ data }: Props) {
  const positionData = data.getBallPositionData();
  const goalData = data.getGoalData();

  const goalWidth = 2 * 893;
  const goalHeight = 640;

  const width = 300;
  const uu2px = width / goalWidth;

  const ballSize = 190;

  return (
    <>
      <h1 className="text-center">The Ball</h1>
      <div className="text-center space-y-10 pt-10">
        <div className="w-3/4 m-auto">
          <h2 className="underline">Goals Scored</h2>
          <GoalChart
            data={goalData}
            x_domain={[-goalWidth / 2, goalWidth / 2]}
            y_domain={[0, goalHeight]}
            svg_width={width}
            svg_height={goalHeight * uu2px}
            ball_size={ballSize * uu2px}
            data_display={["name", "velocity"]}
            underlayed_image={goalSVG}
          />
        </div>
        <div className="w-3/4 m-auto">
          <h2 className="underline mb-[-30px]">{positionData.name}</h2>
          <HeatmapAndTendencies
            tendencies={positionData.tendencies}
            positions={positionData.positions}
            isOrange={false}
          />
        </div>
      </div>
    </>
  );
}
