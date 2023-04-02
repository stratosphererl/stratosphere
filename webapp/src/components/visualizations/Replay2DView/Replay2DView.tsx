import { useECS, useAnimationFrame, Entity } from "@react-ecs/core";
import { Canvas } from "./components/canvas";
import { CanvasViewSystem } from "./systems";
import { Ball, Player } from "./entities";

export default function Replay2DView() {
  const ECS = useECS();
  useAnimationFrame((dt) => ECS.update(dt));

  return (
    <Canvas>
      <ECS.Provider>
        <CanvasViewSystem />
        <Player isOrange={true} />
        <Player isOrange={false} />
        <Ball />
      </ECS.Provider>
    </Canvas>
  );
}
