import { Facet } from "@react-ecs/core";

export class Vector3 {
  constructor(public x: number, public y: number, public z: number) {}
}

export class Transform extends Facet<Transform> {
  position?: Vector3;
  velocity?: Vector3;
  rotation?: Vector3;
}

export class GameTime extends Facet<GameTime> {
  time?: number;
  is_overtime?: boolean;
}

export class Boost extends Facet<Boost> {
  active?: boolean;
  capacity?: number;
}

export class BallFlags extends Facet<BallFlags> {
  hitByOrangeTeam?: boolean | null;
}

export class IsOrange extends Facet<IsOrange> {}

export class IsBot extends Facet<IsBot> {}

export class IsDemolished extends Facet<IsDemolished> {}

export class IsPlayer extends Facet<IsPlayer> {}

export class Name extends Facet<Name> {
  name?: string;
  id?: number;
}

export class Frame extends Facet<Frame> {
  frame?: number = 0;
}

export class Drawable extends Facet<Drawable> {
  draw?: (ctx: CanvasRenderingContext2D, transform: Transform) => void;
}
