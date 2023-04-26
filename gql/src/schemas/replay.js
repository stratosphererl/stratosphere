const { gql } = require("apollo-server");
const fetch = require("node-fetch");
const {
  REPLAY_SERVICE_PORT,
  REPLAY_SERVICE_URL,
} = require("../config/datasources");

const replayDef = gql(`
type Mutators {
  ballType: String
  gameMutatorIndex: Int
}

type Members {
  id: String
}

type LeaderId {
  id: String
}

type Parties {
  members: [Members]
  leaderId: LeaderId
}

type CarryStats {
  averageZDistance: Float
  averageXyDistance: String
  averageBallZVelocity: Float
  varianceXyDistance: String
  varianceZDistance: Float
  varianceBallZVelocity: Float
  averageCarrySpeed: Float
  distanceAlongPath: Float
}

type PlayerId {
  id: String
}

type BallCarries {
  startFrameNumber: Int
  endFrameNumber: Int
  hasFlick: Boolean
  carryTime: Float
  straightLineDistance: Float
  carryStats: CarryStats
  playerId: PlayerId
}

type FirstTouchPlayer {
  id: String
}

type StartPosition {
  posX: Int
  posY: Float
  posZ: Float
}

type PlayerPosition {
  posX: Int
  posY: Float
  posZ: Float
}

type Player {
  id: String
}

type Touch {
  kickoffGoal: Float
  firstTouchPlayer: FirstTouchPlayer
  players: [Players]
}

type KickoffStats {
  startFrame: Int
  touchFrame: Int
  touchTime: Float
  type: String
  touch: Touch
}

type Kickoffs {
  startFrameNumber: Int
  endFrameNumber: Int
}

type PositionalTendencies {
  timeOnGround: Float
  timeLowInAir: Float
  timeHighInAir: Float
  timeInDefendingHalf: Float
  timeInAttackingHalf: Float
  timeInDefendingThird: Float
  timeInNeutralThird: Float
  timeInAttackingThird: Float
  timeBehindBall: Int
  timeInFrontBall: Int
  timeNearWall: Float
  timeInCorner: Float
  timeOnWall: Float
}

type BallStats {
  averages: Averages
  positionalTendencies: PositionalTendencies
}

type BallData {
  posX: Float
  posY: Float
  posZ: Float
}

type Hits {
  frameNumber: Int
  collisionDistance: Float
  distance: Float
  distanceToGoal: Float
  nextHitFrameNumber: Int
  goalNumber: Int
  isKickoff: Boolean
  ballData: BallData
  playerId: PlayerId
}

type GameStats {
  neutralPossessionTime: Float
  ballCarries: [BallCarries]
  kickoffStats: [KickoffStats]
  kickoffs: [Kickoffs]
  ballStats: BallStats
  hits: [Hits]
}

type CenterOfMass {
  averageDistanceFromCenter: Float
  averageMaxDistanceFromCenter: Float
  timeClumped: Float
  timeBoondocks: Float
  positionalTendencies: PositionalTendencies
}

type HitCounts {
  totalHits: Int
  totalPasses: Int
  totalSaves: Int
  totalShots: Int
  totalDribbles: Int
  totalDribbleConts: Int
  totalAerials: Int
  totalClears: Int
}

type Possession {
  possessionTime: Float
  turnovers: Int
  turnoversOnMyHalf: Int
  turnoversOnTheirHalf: Int
  wonTurnovers: Int
}

type PlayerIds {
  id: String
}

type Teams {
  score: Int
  isOrange: Boolean
  stats: Stats
  playerIds: [PlayerIds]
}

type PartyLeader {
  id: String
}

type AverageCounts {
  pass: Float
  passed: Float
  dribble: Float
  dribbleContinuation: Float
  shot: Float
  goal: Float
  assist: Int
  assisted: Int
  save: Int
  aerial: Int
}

type PerPossessionStats {
  averageDuration: Float
  averageHits: Int
  count: Int
  averageCounts: AverageCounts
}

type RelativePositioning {
  timeInFrontOfCenterOfMass: Float
  timeBehindCenterOfMass: Float
  timeMostForwardPlayer: Float
  timeMostBackPlayer: Float
  timeBetweenPlayers: Float
}

type Speed {
  timeAtSlowSpeed: Float
  timeAtSuperSonic: Float
  timeAtBoostSpeed: Float
}

type Controller {
  isKeyboard: Boolean
  analogueSteeringInputPercent: Float
  analogueThrottleInputPercent: Float
  timeBallcam: Float
  timeHandbrake: Float
}

type Averages {
  averageSpeed: Float
  averageHitDistance: Float
  averageDistanceFromCenter: Float
}

type Distance {
  ballHitForward: Float
  ballHitBackward: Float
  timeClosestToBall: Float
  timeFurthestFromBall: Float
  timeCloseToBall: Float
  timeClosestToTeamCenter: Float
  timeFurthestFromTeamCenter: Float
}

type Boost {
  boostUsage: Float
  numSmallBoosts: Int
  numLargeBoosts: Int
  wastedCollection: Float
  wastedUsage: Float
  timeFullBoost: Float
  timeLowBoost: Float
  timeNoBoost: Float
  numStolenBoosts: Int
  averageBoostLevel: Float
  wastedBig: Float
  wastedSmall: Float
}

type Stats {
  kickoffStats: KickoffStats
  perPossessionStats: PerPossessionStats
  relativePositioning: RelativePositioning
  speed: Speed
  controller: Controller
  hitCounts: HitCounts
  averages: Averages
  positionalTendencies: PositionalTendencies
  possession: Possession
  distance: Distance
  boost: Boost
}

type Loadout {
  banner: Int
  boost: Int
  car: Int
  goalExplosion: Int
  skin: Int
  trail: Int
  wheels: Int
  version: Int
  topper: Int
  antenna: Int
  engineAudio: Int
  primaryColor: Int
  accentColor: Int
  primaryFinish: Int
  accentFinish: Int
  avatarBorderUserColor: String
}

type CameraSettings {
  stiffness: Float
  height: Int
  transitionSpeed: Float
  pitch: Int
  swivelSpeed: Float
  fieldOfView: Int
  distance: Int
}

type Id {
  id: String
}

type Players {
  name: String
  titleId: Int
  score: Int
  goals: Int
  assists: Int
  saves: Int
  shots: Int
  isOrange: Int
  isBot: Boolean
  timeInGame: Float
  firstFrameInGame: Int
  partyLeader: PartyLeader
  stats: Stats
  loadout: Loadout
  cameraSettings: CameraSettings
  id: Id
}

type Season {
  name: String
  id: Int
}

type PrimaryPlayer {
  id: String
}

type Goals {
  frameNumber: Int
  playerId: PlayerId
}

type Score {
  team0Score: Int
  team1Score: Int
}

type Map {
  id: Int
  base_name: String
  variant: String
}

type GameMetadata {
  id: String
  name: String
  version: Int
  time: String
  frames: Int
  length: Float
  gameServerId: String
  serverName: String
  matchGuid: String
  teamSize: Int
  playlist: String
  uploadDate: String
  ranks: String
  uploader: String
  season: Season
  primaryPlayer: PrimaryPlayer
  goals: [Goals]
  score: Score
  map: Map
}

type Replay {
  _id: String
  version: Int
  mutators: Mutators
  parties: [Parties]
  gameStats: GameStats
  teams: [Teams]
  players: [Players]
  gameMetadata: GameMetadata
}

type PageInfo {
    page: Int
    total: Int
    data: [GameMetadata]
}

type Query {
    replay(id: String!): Replay
    replays: PageInfo
}


`);

const replayResolvers = {
  Query: {
    replay: async (parent, args) => {
      return fetch(
        `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/${args.id}`
      ).then((res) => {
        if (!res.ok) {
          res.json().then((json) => {
            throw new Error(json.detail);
          });
        } else {
          return res.json();
        }
      });
    },
    replays: async (parent, args) => {
      return fetch(
        `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/`
      ).then((res) => {
        if (!res.ok) {
          res.json().then((json) => {
            throw new Error(json.detail);
          });
        } else {
          return res.json().then((json) => {
            console.log(json);
            return json;
          });
        }
      });
    },
  },
};

module.exports = { replayDef, replayResolvers };
