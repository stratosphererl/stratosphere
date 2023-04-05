import { useFacet } from "@react-ecs/core";
import { observer } from "mobx-react";
import { GameTime } from "../facets";

export const GameTimeDisplay = observer(() => {
  const gameTime = useFacet(GameTime);
  const time = gameTime.time;
  const isOvertime = gameTime.is_overtime;

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  const minutesString = minutes < 10 ? `0${minutes}` : minutes;
  const secondsString = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <h3 className="text-center">
      {minutesString}:{secondsString}
      {isOvertime && "+"}
    </h3>
  );
});
