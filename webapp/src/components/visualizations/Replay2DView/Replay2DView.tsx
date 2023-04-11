import { useECS, useAnimationFrame, Entity } from "@react-ecs/core";
import { Canvas } from "./components/canvas";
import {
  CanvasViewSystem,
  FrameSystem,
  GameTimeSystem,
  TransformSystem,
} from "./systems";
import { Player } from "./entities/player";
import { Ball } from "./entities/ball";
import { Map } from "./entities/field";
import { useReplayFrames } from "../helper/dataLoader";
import { useRef } from "react";
import { GameTimeDisplay } from "./components/gameTimeDisplay";
import { GameTime, Frame } from "./facets";

export default function Replay2DView() {
  const ECS = useECS();

  useAnimationFrame((dt) => ECS.update(dt));

  useAnimationFrame((dt) => ECS.update(dt));

  useAnimationFrame((dt) => ECS.update(dt));

  const url = "http://localhost:16000/frames.csv.zip";
  const url = "http://localhost:16000/frames.csv.zip";
  const { data, loading, error } = useReplayFrames(url);

  return (
    <div className="flex-col justify-center items-center">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <ECS.Provider>
          <GameTimeSystem data={data} />
          <Entity>
            <GameTimeDisplay />
            <GameTime />
          </Entity>
          <Canvas>
            <CanvasViewSystem />
            <TransformSystem data={data} />
            <Player isOrange={false} name={{ id: 0, name: "Doria._" }} />
            <Player isOrange={false} name={{ id: 2, name: "Juls." }} />
            <Player isOrange={false} name={{ id: 5, name: "Joshuarw015" }} />
            <Player isOrange={true} name={{ id: 1, name: "deucedave" }} />
            <Player isOrange={true} name={{ id: 3, name: "mini." }} />
            <Player isOrange={true} name={{ id: 4, name: "$T3WiE" }} />
            <Ball name={{ id: 6, name: "ball" }} />
            <Map />
          </Canvas>
        </ECS.Provider>
      )}
    </div>
  );
}
