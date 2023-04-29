const { gql } = require("apollo-server-express");
const fetch = require("node-fetch");
const {
  REPLAY_SERVICE_PORT,
  REPLAY_SERVICE_URL,
  AUTH_TOKEN,
} = require("../config/datasources");
const { GraphQLUpload } = require("graphql-upload");
const FormData = require("form-data");
const { ApolloError } = require("apollo-server");

const replayDef = gql(`

scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

type ParseMeta {
  version: Int
  analysisFail: Boolean
}

type Mutators {
  ballType: String
  gameMutatorIndex: Int
}

type FiftyFifties {
  startingFrame: Int
  endingFrame: Int
  isNeutral: Boolean
  players: [PlayersFull]
  hits: [Int]
}

type CarryStats {
  averageZDistance: Float
  averageXyDistance: Float
  averageBallZVelocity: Float
  varianceXyDistance: Float
  varianceZDistance: Float
  varianceBallZVelocity: Float
  averageCarrySpeed: Float
  distanceAlongPath: Float
}

type PlayerId {
  id: String
}

type FirstTouchPlayer {
  id: String
}

type StartPosition {
  posX: Float
  posY: Float
  posZ: Float
}

type PlayerPosition {
  posX: Float
  posY: Float
  posZ: Float
}

type Player {
  id: String
}

type Touch {
  kickoffGoal: Float
  firstTouchPlayer: FirstTouchPlayer
  players: [PlayersFull]
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
  dribble: Boolean
  distance: Float
  distanceToGoal: Float
  nextHitFrameNumber: Int
  goalNumber: Int
  isKickoff: Boolean
  pressure: Int
  ballData: BallData
  playerId: PlayerId
}

type GameStats {
  neutralPossessionTime: Float
  fiftyFifties: [FiftyFifties]
  ballCarries: [BallCarries]
  kickoffStats: [KickoffStats]
  kickoffs: [Kickoffs]
  ballStats: BallStats
  hits: [Hits]
}

type HitCounts {
  totalHits: Int
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

type BallCarries {
  totalCarries: Int
  longestCarry: Float
  furthestCarry: Float
  totalCarryTime: Float
  averageCarryTime: Float
  fastestCarrySpeed: Float
  totalCarryDistance: Float
  carryStats: CarryStats
}

type AverageCounts {
  pass: Int
  passed: Int
  dribble: Float
  dribbleContinuation: Float
  shot: Float
  goal: Float
  assist: Int
  assisted: Int
  save: Float
  aerial: Float
}

type PerPossessionStats {
  averageDuration: Float
  averageHits: Float
  count: Int
  averageCounts: AverageCounts
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
}

type Distance {
  ballHitForward: Float
  ballHitBackward: Float
  timeClosestToBall: Float
  timeFurthestFromBall: Float
  timeCloseToBall: Float
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
  ballCarries: BallCarries
  perPossessionStats: PerPossessionStats
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
  boostPaint: Int
  goalExplosionPaint: Int
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
  swivelSpeed: Int
  fieldOfView: Int
  distance: Int
}

type Id {
  id: String
}

type PlayersFull{
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
  stats: Stats
  loadout: Loadout
  cameraSettings: CameraSettings
  id: Id
}

type PlayersHeader {
  name: String
  online_id: String
  is_orange: Boolean
  score: Int
  assists: Int
  saves: Int
  shots: Int
  is_bot: Boolean
  platform: String
  rank: Rank
}

type Goals {
  player_name: String
  player_team: Int
  frame_number: Int
}

type Rank {
  mmr: String
  id: Int
  title: String
  division: String
}

type Season {
  id: Int
  name: String
}

type Map {
  id: Int
  name: String
  variant: String
}

type GameHeader {
  id: String
  name: String
  uploadDate: Float
  length: Float
  overtime: Float
  region: String
  ranked: Boolean
  time: Int
  teamSize: Int
  matchType: String
  gameMode: String
  gameType: String
  frames: Int
  primaryPlayerId: String
  version: Int
  demos: [String]
  goals: [Goals]
  teams: [Teams]
  players: [PlayersHeader]
  season: Season
  map: Map
}

type Replay {
  version: Int
  parseMeta: ParseMeta
  mutators: Mutators
  gameStats: GameStats
  teams: [Teams]
  players: [PlayersFull]
  gameHeader: GameHeader
}

type PageInfo {
    page: Int
    total: Int
    data: [GameHeader]
}


type FileUploadResponse {
    filename: String!
    taskId: String! 
    status: String!
}

type FileUploadStatus {
    replay_id: String!
    process_time: String
    stage: ProcessStage
}

type ProcessStage {
    name: String!
    current: Int!
    total: Int!
}

type FileUploadTaskResponseProgress {
    state: String!
    status: FileUploadStatus!
}

type ReplaysCount {
  count: Int
}

enum MMRPlaylistOptions {
  Duel,
  Doubles,
  Standard,
  Hoops,
  Rumble,
  Dropshot,
  SnowDay,
  Tournament
}


input MMRFromPlaylistForm {
  playlist: MMRPlaylistOptions!
  mmr: Int!
}

type MMRFromPlaylistResponse {
  id: Int
  name: String
  division: String
}

type Options {
  gameTypes: [String]
  regions: [String]
  gameModes: [String]
  ranks: [String]
  seasons: [String]
  maps: [String]
}

type DurationCount {
  duration: Int
  count: Int
}

type RankCount {
  rank: String
  count: Int
}

type SeasonCount {
  season: String
  count: Int
}

type RegionCount {
  region: String
  count: Int
}

type platformCount {
  platform: String
  count: Int
}

type DurationCountResult {
  _id: String
  durations: [DurationCount]
}

type RankCountResult {
  _id: String
  ranks: [RankCount]
}

type SeasonCountResult {
  _id: String
  seasons: [SeasonCount]
}

type RegionCountResult {
  _id: String
  regions: [RegionCount]
}

type PlatformCountResult {
  _id: String
  platforms: [platformCount]
}

input UpdateReplayForm {
  id: String!
  name: String!
}

input DeleteReplayForm {
  id: String!
}

input Search {
  page: Int = 0
  limit: Int = 30
  name: String
  map: String
  gameMode: String
  gameType: String
  region: String
  season: String
  duration: String
  rank: String
  player: String
}

type Query {
    getReplay(id: String!): Replay
    getReplaysCount: ReplaysCount
    getTaskStatus(taskId: String!): FileUploadTaskResponseProgress
    getRankFromPlaylistAndMMR(input: MMRFromPlaylistForm!): MMRFromPlaylistResponse
    getOptions: Options
    getDurationCount: [DurationCountResult]
    getRankCount: [RankCountResult]
    getSeasonCount: [SeasonCountResult]
    getRegionCount: [RegionCountResult]
    getPlatformCount: [PlatformCountResult]
    searchReplays(input: Search!): PageInfo
    getReplayFileURL(id: String!): String
    getReplayFramesFileURL(id: String!): String
}

type Mutation {
    uploadReplay(file: Upload!): [FileUploadResponse]
    updateReplay(input: UpdateReplayForm!): Boolean
    deleteReplay(input: DeleteReplayForm!): Boolean
}
`);

const streamToBuffer = async (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk);
    });
    stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
    stream.on("error", (error) => {
      reject(error);
    });
  });
};

async function uploadFile(formData) {
  const response = await fetch(
    `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays`,
    {
      method: "POST",
      ...formData.getHeaders(),
      body: formData,
    }
  );

  if (!response.ok) {
    const { detail } = await response.json();
    throw new Error(detail[0].msg);
  }

  return await response.json();
}

const replayResolvers = {
  Upload: GraphQLUpload,
  Mutation: {
    uploadReplay: async (parent, args) => {
      const { createReadStream, filename, mimetype } = await args.file;
      const stream = createReadStream();
      const fileBuffer = await streamToBuffer(stream);
      const formData = new FormData();
      formData.append("files", fileBuffer, {
        filename,
        contentType: mimetype,
      });
      const res = await uploadFile(formData, filename);

      const mappedResponse = res.map((r) => {
        return {
          filename: r.filename,
          taskId: r["task-id"],
          status: r.status,
        };
      });

      return mappedResponse;
    },
    updateReplay: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/${args.input.id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ name: args.input.name }),
      });

      if (!res.ok) {
        throw new ApolloError("Unable to update replay", res.status);
      }

      return true;
    },
    deleteReplay: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/${args.input.id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!res.ok) {
        throw new ApolloError("Unable to delete replay", res.status);
      }

      return true;
    },
  },
  Query: {
    getReplay: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/${args.id}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const json = await res.json();
        const detail = json ? json.detail : "Unable to get replay";
        throw new ApolloError(detail, res.status);
      }

      const json = await res.json();

      return json;
    },
    searchReplays: async (parent, args) => {
      let url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/search?`;
      for (const [key, value] of Object.entries(args.input)) {
        if (value) {
          url += `${key}=${value}&`;
        }
      }
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new ApolloError("Unable to search replays", res.status);
      }

      const json = await res.json();

      return json;
    },
    getReplaysCount: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/count`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return {
        count: json.data[0].count,
      };
    },
    getRankFromPlaylistAndMMR: async (parent, args) => {
      if (args.input.playlist === "SnowDay") {
        args.input.playlist = "Snow Day";
      }
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/mmr/${args.input.playlist}/${args.input.mmr}`;
      const res = await fetch(encodeURI(url));
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return json;
    },
    getOptions: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/options`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return json["options"];
    },
    getTaskStatus: async (parent, args) => {
      const response = await fetch(
        `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/status/${args.taskId}`
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.detail);
      }

      return json;
    },
    getDurationCount: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/stats/duration`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return json[0].result;
    },
    getRankCount: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/stats/rank`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return json[0].result;
    },
    getSeasonCount: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/stats/season`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return json[0].result;
    },
    getRegionCount: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/stats/region`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return json[0].result;
    },
    getPlatformCount: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/stats/platform`;
      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw new ApolloError(json.detail, res.status);
      }

      return json[0].result;
    },
    getReplayFileURL: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/download/${args.id}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new ApolloError("Unable to get replay file", res.status);
      }

      if (res.url.includes("replay")) {
        return res.url.replace("replay", "localhost");
      }

      return res.url;
    },
    getReplayFramesFileURL: async (parent, args) => {
      const url = `http://${REPLAY_SERVICE_URL}:${REPLAY_SERVICE_PORT}/api/v1/replays/download/frames/${args.id}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new ApolloError("Unable to get replay frames file", res.status);
      }

      if (res.url.includes("replay")) {
        return res.url.replace("replay", "localhost");
      }

      return res.url;
    },
  },
};

module.exports = { replayDef, replayResolvers };
