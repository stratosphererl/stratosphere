import { useECS, useAnimationFrame, useTimer } from "@react-ecs/core";
import { Canvas } from "./components/canvas";
import { CanvasViewSystem, TransformSystem } from "./systems";
import { Player } from "./entities/player";
import { Ball } from "./entities/ball";
import { Map } from "./entities/field";
import { useReplayFrames } from "../helper/dataLoader";
import { useEffect, useState } from "react";
import ResponseDataWrapper from "../../../data/ResponseDataWrapper";

export default function Replay2DView({ analyzedReplay }: { analyzedReplay: ResponseDataWrapper }) {
  const ECS = useECS();
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      ECS.update(1);
    }, 150);

    return () => clearInterval(intervalId); // clear the interval when the component unmounts
  }, [ECS, frames]);

  const framesURL = analyzedReplay.getFramesLink();
  const { data, loading, error } = useReplayFrames(framesURL);

  const [team1, team2] = analyzedReplay.getTeamsPlayers();

  return (
    <div className="flex justify-center items-center">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Canvas>
          <ECS.Provider>
            <CanvasViewSystem />
            <TransformSystem data={data} />
            {team1.map((player) => (
              <Player isOrange={false} name={data[0].findIndex((entity: any) => entity.name === player.name)} />
            ))}
            {team2.map((player) => (
              <Player isOrange={true} name={data[0].findIndex((entity: any) => entity.name === player.name)} />
            ))}
            <Ball name={data[0].findIndex((entity: any) => entity.name === "ball")} />
            <Map />
          </ECS.Provider>
        </Canvas>
      )}
    </div>
  );
}
