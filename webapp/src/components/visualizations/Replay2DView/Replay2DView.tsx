import { useECS, useAnimationFrame, useTimer } from "@react-ecs/core";
import { Canvas } from "./components/canvas";
import { CanvasViewSystem, TransformSystem } from "./systems";
import { Player } from "./entities/player";
import { Ball } from "./entities/ball";
import { Map } from "./entities/field";
import { useReplayFrames } from "../helper/dataLoader";
import { useEffect, useState } from "react";
import ResponseDataWrapper from "../../../data/ResponseDataWrapper";

interface PredictionType {
  data: {
    predict: {
      keys: string[];
      predictions: number[][];
      model_type: string;
    }
  } | null;
  loading: boolean;
  error: Error | null;
}

function PredictionBar( { predictions, frame } : { predictions: PredictionType, frame: number }) {
  if (predictions.error) {
    console.log(predictions.error);
    return <div>Predictions Unavailable</div>
  }

  if (predictions.loading) {
    return <div>Loading Predictions...</div>
  }

  if (predictions.data === null) {
    return <div>?</div>
  }

  const { keys, predictions: preds } = predictions.data.predict;

  const orangeIndex = keys.indexOf("orange");

  const orange_prediction = preds[frame]?.[orangeIndex] * 100;
  const blue_prediction = 100 - orange_prediction;

  return (
    <div className="h-[500px] flex flex-col justify-evenly mr-2">
      <div className="px-2" style={{height: `${orange_prediction}%`, backgroundColor: "var(--sky-orange)"}}>
        {orange_prediction.toFixed(0)}
      </div>
      <div className="px-2" style={{height: `${blue_prediction}%`, backgroundColor: "var(--sky-blue)"}}>
        {blue_prediction.toFixed(0)}
      </div>
    </div>
  )
}

export default function Replay2DView({ analyzedReplay, predictions }: 
  { analyzedReplay: ResponseDataWrapper, predictions: any }) {
  const ECS = useECS();
  const [frame, setFrame] = useState(0);
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
      <div className="flex">
        <PredictionBar predictions={predictions} frame={frame} />
        {loading || !data ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
          ) : (
          <Canvas>
            <ECS.Provider>
              <CanvasViewSystem />
              <TransformSystem data={data} onUpdate={(f: number) => setFrame(f)} />
              {team1.map((player) => (
                <Player key={player.name} isOrange={false} name={data[0].findIndex((entity: any) => entity.name === player.name)} />
              ))}
              {team2.map((player) => (
                <Player key={player.name} isOrange={true} name={data[0].findIndex((entity: any) => entity.name === player.name)} />
              ))}
              <Ball name={data[0].findIndex((entity: any) => entity.name === "ball")} />
              <Map />
            </ECS.Provider>
          </Canvas>
        )}
      </div>
    </div>
  );
}
