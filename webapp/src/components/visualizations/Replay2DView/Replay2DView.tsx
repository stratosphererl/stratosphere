import { useECS, useAnimationFrame, useTimer } from "@react-ecs/core";
import { Canvas } from "./components/canvas";
import { CanvasViewSystem, TransformSystem } from "./systems";
import { Player } from "./entities/player";
import { Ball } from "./entities/ball";
import { Map } from "./entities/field";
import { useReplayFrames } from "../helper/dataLoader";
import { useState } from "react";
import { useEffect } from "react";

export default function Replay2DView() {
  const ECS = useECS();

  useEffect(() => {
    const intervalId = setInterval(() => {
      ECS.update(1);
    }, 1000 / 5);

    return () => clearInterval(intervalId); // clear the interval when the component unmounts
  }, [ECS]);

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
            <Player isOrange={false} name={1} />
            <Player isOrange={false} name={2} />
            <Player isOrange={true} name={3} />
            <Player isOrange={true} name={4} />
            <Player isOrange={true} name={5} />
            <Ball name={6} />
            <Map />
          </ECS.Provider>
        </Canvas>
      )}
    </div>
  );
}
