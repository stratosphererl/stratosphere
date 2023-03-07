from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field, validator

from pydantic import BaseModel, Field
from typing import List


class Score(BaseModel):
    team0Score: int
    team1Score: int


class PlayerId(BaseModel):
    id: str


class Goal(BaseModel):
    frameNumber: int
    playerId: PlayerId


class Demo(BaseModel):
    frameNumber: int
    attackerId: PlayerId
    victimId: PlayerId


class ReplayHeader(BaseModel):
    id: str
    name: str
    map: str
    version: int
    time: str
    frames: int
    score: Score
    goals: List[Goal]
    demos: List[Demo]
    primaryPlayer: PlayerId
    length: float
    gameServerId: str
    serverName: str
    matchGuid: str
    teamSize: int
    playlist: str


class CameraSettings(BaseModel):
    stiffness: float
    height: int
    transitionSpeed: float
    pitch: int
    swivelSpeed: float
    fieldOfView: int
    distance: int
    

class Loadout(BaseModel):
    banner: int
    boost: int
    car: int
    goalExplosion: int
    skin: int
    trail: int
    wheels: int
    version: int
    topper: int
    antenna: int
    engineAudio: int
    primaryColor: int
    accentColor: int
    primaryFinish: int
    accentFinish: int
    avatarBorderUserColor: str


class Boost(BaseModel):
    boostUsage: float
    numSmallBoosts: int
    numLargeBoosts: int
    wastedCollection: float
    wastedUsage: float
    timeFullBoost: float
    timeLowBoost: float
    timeNoBoost: float
    numStolenBoosts: int
    averageBoostLevel: float
    wastedBig: float
    wastedSmall: float


class Distance(BaseModel):
    ballHitForward: float
    ballHitBackward: float
    timeClosestToBall: float
    timeFurthestFromBall: float
    timeCloseToBall: float


class Possession(BaseModel):
    possessionTime: float
    turnovers: int
    turnoversOnMyHalf: int
    turnoversOnTheirHalf: int
    wonTurnovers: int


class PositionalTendencies(BaseModel):
    timeOnGround: float
    timeLowInAir: float
    timeHighInAir: float
    timeInDefendingHalf: float
    timeInAttackingHalf: float
    timeInDefendingThird: float
    timeInNeutralThird: float
    timeInAttackingThird: float
    timeBehindBall: float
    timeInFrontBall: float
    timeNearWall: float
    timeInCorner: float
    timeOnWall: float

class AveragesSpeed(BaseModel):
    averageSpeed: float

class Averages(AveragesSpeed):
    averageHitDistance: float


class HitCounts(BaseModel):
    totalHits: int
    totalSaves: int
    totalShots: int
    totalDribbles: int
    totalDribbleConts: int
    totalAerials: int
    totalClears: int


class Controller(BaseModel):
    isKeyboard: bool
    analogueSteeringInputPercent: float
    analogueThrottleInputPercent: float
    timeBallcam: float
    timeHandbrake: float


class Speed(BaseModel):
    timeAtSlowSpeed: float
    timeAtSuperSonic: float
    timeAtBoostSpeed: float


class AverageCounts(BaseModel):
    pass_: float = Field(None, alias='pass')
    passed: float
    dribble: float
    dribbleContinuation: float
    shot: float
    goal: float
    assist: float
    assisted: float
    save: float
    aerial: float


class PerPossessionStats(BaseModel):
    averageCounts: AverageCounts
    averageDuration: float
    averageHits: float
    count: int


class KickoffStats(BaseModel):
    totalKickoffs: int
    numTimeGoToBall: int
    numTimeFirstTouch: int
    averageBoostUsed: float


class DemoStats(BaseModel):
    numDemosTaken: Optional[int] = None
    numDemosInflicted: Optional[int] = None


class CarryStats(BaseModel):
    averageZDistance: float
    averageXyDistance: float
    averageBallZVelocity: float
    varianceXyDistance: float
    varianceZDistance: float
    varianceBallZVelocity: float
    averageCarrySpeed: float
    distanceAlongPath: float


class BallCarries(BaseModel):
    totalCarries: int
    longestCarry: float
    furthestCarry: float
    totalCarryTime: float
    averageCarryTime: float
    fastestCarrySpeed: float
    totalCarryDistance: float
    carryStats: CarryStats


class Stats(BaseModel):
    boost: Boost
    distance: Distance
    possession: Possession
    positionalTendencies: PositionalTendencies
    averages: Averages
    hitCounts: HitCounts
    controller: Controller
    speed: Speed
    perPossessionStats: PerPossessionStats
    kickoffStats: KickoffStats
    demoStats: DemoStats
    ballCarries: Optional[BallCarries] = None


class Player(BaseModel):
    id: PlayerId
    name: str
    titleId: int
    score: int
    goals: int
    assists: int
    saves: int
    shots: int
    cameraSettings: CameraSettings
    loadout: Loadout
    isOrange: int
    stats: Stats
    isBot: bool
    timeInGame: float
    firstFrameInGame: int


class TeamStats(BaseModel):
    possession: Possession
    hitCounts: HitCounts


class Team(BaseModel):
    playerIds: List[PlayerId]
    score: int
    isOrange: bool
    stats: TeamStats

class Position(BaseModel):
    posX: float
    posY: float
    posZ: float

class Hit(BaseModel):
    frameNumber: int
    playerId: PlayerId
    collisionDistance: float
    ballData: Position
    distance: Optional[float] = None
    distanceToGoal: float
    nextHitFrameNumber: Optional[int] = None
    goalNumber: int
    isKickoff: bool
    shot: Optional[bool] = None
    previousHitFrameNumber: Optional[int] = None
    save: Optional[bool] = None
    dribble: Optional[bool] = None
    dribbleContinuation: Optional[bool] = None
    goal: Optional[bool] = None
    clear: Optional[bool] = None
    aerial: Optional[bool] = None


class Bump(BaseModel):
    frameNumber: int
    attackerId: PlayerId
    victimId: PlayerId
    isDemo: bool


class BallStats(BaseModel):
    positionalTendencies: PositionalTendencies
    averages: AveragesSpeed


class Kickoff(BaseModel):
    startFrameNumber: int
    endFrameNumber: int


class PlayerTouch(BaseModel):
    player: PlayerId
    kickoffPosition: str
    touchPosition: str
    playerPosition: Position
    boost: int
    ballDist: float
    startLeft: bool
    startPosition: Position


class Touch(BaseModel):
    players: List[PlayerTouch]
    kickoffGoal: Optional[float] = None
    firstTouchPlayer: PlayerId


class KickoffStat(BaseModel):
    startFrame: int
    touchFrame: int
    touchTime: float
    type: str
    touch: Touch


class BallCarry(Kickoff):
    playerId: PlayerId
    hasFlick: bool
    carryTime: float
    straightLineDistance: float
    carryStats: CarryStats


class GameStats(BaseModel):
    hits: List[Hit]
    neutralPossessionTime: float
    bumps: List[Bump]
    ballStats: BallStats
    kickoffs: List[Kickoff]
    kickoffStats: List[KickoffStat]
    ballCarries: List[BallCarry]


class Mutators(BaseModel):
    ballType: str
    gameMutatorIndex: int


class DetailedReplay(BaseModel):
    gameMetadata: ReplayHeader
    id: str = Field(None, alias="_id", title="Primary key", description="mongodb's Primary key")
    players: List[Player]
    teams: List[Team]
    gameStats: GameStats
    version: int
    mutators: Mutators

    @validator('id', always=True)
    def ab(cls, v, values) -> str:
        return values['gameMetadata'].id