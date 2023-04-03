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
    "https://download1072.mediafire.com/p05hu8kxbbugGJADvWJmNs8mnouDM92MEY5mtk_fHQyMF2Io_0fer6KsSMPumEb7ZlkP4EKVriumtQgctXwi5zul8YQG/bjss5bx7e23f49w/frames.csv.zip";
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
