import { useECS, useAnimationFrame, useTimer } from "@react-ecs/core";
import { Canvas } from "./components/canvas";
import { CanvasViewSystem, FrameByFrameSystem } from "./systems";
import { Player } from "./entities/player";
import { Ball } from "./entities/ball";
import { Map } from "./entities/field";
import { useReplayFrames } from "../helper/dataLoader";
import { useState } from "react";
import { Transform, Vector3 } from "./facets";

export default function Replay2DView() {
  const ECS = useECS();

  useAnimationFrame((delta) => {
    ECS.update(delta);
  });

  const url =
    "http://127.0.0.1:5004/frames.csv.zip";
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
            <FrameByFrameSystem data={data} />
            <Player isOrange={true} />
            <Map />
          </ECS.Provider>
        </Canvas>
      )}
    </div>
  );
}
