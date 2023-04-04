import { useECS, useAnimationFrame, useTimer } from "@react-ecs/core";
import { Canvas } from "./components/canvas";
import { CanvasViewSystem, TransformSystem } from "./systems";
import { Player } from "./entities/player";
import { Ball } from "./entities/ball";
import { Map } from "./entities/field";
import { useReplayFrames } from "../helper/dataLoader";
import { useEffect, useState } from "react";

export default function Replay2DView() {
  const ECS = useECS();
  const [frames, setFrames] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      ECS.update(1);
    }, 150);

    return () => clearInterval(intervalId); // clear the interval when the component unmounts
  }, [ECS, frames]);

  const url = "http://localhost:5004/frames.csv.zip";
  const { data, loading, error } = useReplayFrames(url);

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
            <Player isOrange={false} name={0} />
            <Player isOrange={true} name={1} />
            <Player isOrange={false} name={2} />
            <Player isOrange={true} name={3} />
            <Player isOrange={true} name={4} />
            <Player isOrange={false} name={5} />
            <Ball name={6} />
            <Map />
          </ECS.Provider>
        </Canvas>
      )}
    </div>
  );
}
