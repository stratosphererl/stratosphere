from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field, validator

from pydantic import BaseModel, Field
from typing import List

import datetime


class Score(BaseModel):
    team0Score: Optional[int]=None
    team1Score: Optional[int]=None


class PlayerId(BaseModel):
    id: Optional[str]=None


class Goal(BaseModel):
    frameNumber: Optional[int]=None
    playerId: Optional[PlayerId]=None


class Demo(BaseModel):
    frameNumber: Optional[int]=None
    attackerId: Optional[PlayerId]=None
    victimId: Optional[PlayerId]=None


class ReplayHeader(BaseModel):
    id: Optional[str]=None
    name: Optional[str]=None
    map: Optional[str]=None
    version: Optional[int]=None
    time: Optional[str]=None
    frames: Optional[int]=None
    score: Optional[Score]=None
    goals: Optional[List[Goal]]=None
    demos: Optional[List[Demo]]=None
    primaryPlayer: Optional[PlayerId]=None
    length: Optional[float]=None
    gameServerId: Optional[str]=None
    serverName: Optional[str]=None
    matchGuid: Optional[str]=None
    teamSize: Optional[int]=None
    playlist: Optional[str]=None


class CameraSettings(BaseModel):
    stiffness: Optional[float]=None
    height: Optional[int]=None
    transitionSpeed: Optional[float]=None
    pitch: Optional[int]=None
    swivelSpeed: Optional[float]=None
    fieldOfView: Optional[int]=None
    distance: Optional[int]=None
    

class Loadout(BaseModel):
    banner: Optional[int]=None
    boost: Optional[int]=None
    car: Optional[int]=None
    goalExplosion: Optional[int]=None
    skin: Optional[int]=None
    trail: Optional[int]=None
    wheels: Optional[int]=None
    version: Optional[int]=None
    topper: Optional[int]=None
    antenna: Optional[int]=None
    engineAudio: Optional[int]=None
    primaryColor: Optional[int]=None
    accentColor: Optional[int]=None
    primaryFinish: Optional[int]=None
    accentFinish: Optional[int]=None
    avatarBorderUserColor: Optional[str]=None


class Boost(BaseModel):
    boostUsage: Optional[float]=None
    numSmallBoosts: Optional[int]=None
    numLargeBoosts: Optional[int]=None
    wastedCollection: Optional[float]=None
    wastedUsage: Optional[float]=None
    timeFullBoost: Optional[float]=None
    timeLowBoost: Optional[float]=None
    timeNoBoost: Optional[float]=None
    numStolenBoosts: Optional[int]=None
    averageBoostLevel: Optional[float]=None
    wastedBig: Optional[float]=None
    wastedSmall: Optional[float]=None


class Distance(BaseModel):
    ballHitForward: Optional[float]=None
    ballHitBackward: Optional[float]=None
    timeClosestToBall: Optional[float]=None
    timeFurthestFromBall: Optional[float]=None
    timeCloseToBall: Optional[float]=None


class Possession(BaseModel):
    possessionTime: Optional[float]=None
    turnovers: Optional[int]=None
    turnoversOnMyHalf: Optional[int]=None
    turnoversOnTheirHalf: Optional[int]=None
    wonTurnovers: Optional[int]=None


class PositionalTendencies(BaseModel):
    timeOnGround: Optional[float]=None
    timeLowInAir: Optional[float]=None
    timeHighInAir: Optional[float]=None
    timeInDefendingHalf: Optional[float]=None
    timeInAttackingHalf: Optional[float]=None
    timeInDefendingThird: Optional[float]=None
    timeInNeutralThird: Optional[float]=None
    timeInAttackingThird: Optional[float]=None
    timeBehindBall: Optional[float]=None
    timeInFrontBall: Optional[float]=None
    timeNearWall: Optional[float]=None
    timeInCorner: Optional[float]=None
    timeOnWall: Optional[float]=None

class AveragesSpeed(BaseModel):
    averageSpeed: Optional[float]=None

class Averages(AveragesSpeed):
    averageHitDistance: Optional[float]=None


class HitCounts(BaseModel):
    totalHits: Optional[int]=None
    totalSaves: Optional[int]=None
    totalShots: Optional[int]=None
    totalDribbles: Optional[int]=None
    totalDribbleConts: Optional[int]=None
    totalAerials: Optional[int]=None
    totalClears: Optional[int]=None


class Controller(BaseModel):
    isKeyboard: Optional[bool]=None
    analogueSteeringInputPercent: Optional[float]=None
    analogueThrottleInputPercent: Optional[float]=None
    timeBallcam: Optional[float]=None
    timeHandbrake: Optional[float]=None


class Speed(BaseModel):
    timeAtSlowSpeed: Optional[float]=None
    timeAtSuperSonic: Optional[float]=None
    timeAtBoostSpeed: Optional[float]=None


class AverageCounts(BaseModel):
    pass_: str = Field(None, alias='pass')
    passed: Optional[float]=None
    dribble: Optional[float]=None
    dribbleContinuation: Optional[float]=None
    shot: Optional[float]=None
    goal: Optional[float]=None
    assist: Optional[float]=None
    assisted: Optional[float]=None
    save: Optional[float]=None
    aerial: Optional[float]=None


class PerPossessionStats(BaseModel):
    averageCounts: Optional[AverageCounts]=None
    averageDuration: Optional[float]=None
    averageHits: Optional[float]=None
    count: Optional[int]=None


class KickoffStats(BaseModel):
    totalKickoffs: Optional[int]=None
    numTimeGoToBall: Optional[int]=None
    numTimeFirstTouch: Optional[int]=None
    averageBoostUsed: Optional[float]=None


class DemoStats(BaseModel):
    numDemosTaken: Optional[int]=None
    numDemosInflicted: Optional[int]=None


class CarryStats(BaseModel):
    averageZDistance: Optional[float]=None
    averageXyDistance: Optional[float]=None
    averageBallZVelocity: Optional[float]=None
    varianceXyDistance: Optional[float]=None
    varianceZDistance: Optional[float]=None
    varianceBallZVelocity: Optional[float]=None
    averageCarrySpeed: Optional[float]=None
    distanceAlongPath: Optional[float]=None


class BallCarries(BaseModel):
    totalCarries: Optional[int]=None
    longestCarry: Optional[float]=None
    furthestCarry: Optional[float]=None
    totalCarryTime: Optional[float]=None
    averageCarryTime: Optional[float]=None
    fastestCarrySpeed: Optional[float]=None
    totalCarryDistance: Optional[float]=None
    carryStats: Optional[CarryStats]=None


class Stats(BaseModel):
    boost: Optional[Boost]=None
    distance: Optional[Distance]=None
    possession: Optional[Possession]=None
    positionalTendencies: Optional[PositionalTendencies]=None
    averages: Optional[Averages]=None
    hitCounts: Optional[HitCounts]=None
    controller: Optional[Controller]=None
    speed: Optional[Speed]=None
    perPossessionStats: Optional[PerPossessionStats]=None
    kickoffStats: Optional[KickoffStats]=None
    demoStats: Optional[DemoStats]=None
    ballCarries: Optional[BallCarries]=None


class Player(BaseModel):
    id: Optional[PlayerId]=None
    name: Optional[str]=None
    titleId: Optional[int]=None
    score: Optional[int]=None
    goals: Optional[int]=None
    assists: Optional[int]=None
    saves: Optional[int]=None
    shots: Optional[int]=None
    cameraSettings: Optional[CameraSettings]=None
    loadout: Optional[Loadout]=None
    isOrange: Optional[int]=None
    stats: Optional[Stats]=None
    isBot: Optional[bool]=None
    timeInGame: Optional[float]=None
    firstFrameInGame: Optional[int]=None


class TeamStats(BaseModel):
    possession: Optional[Possession]=None
    hitCounts: Optional[HitCounts]=None


class Team(BaseModel):
    playerIds: Optional[List[PlayerId]]=None
    score: Optional[int]=None
    isOrange: Optional[bool]=None
    stats: Optional[TeamStats]=None

class Position(BaseModel):
    posX: Optional[float]=None
    posY: Optional[float]=None
    posZ: Optional[float]=None

class Hit(BaseModel):
    frameNumber: Optional[int]=None
    playerId: Optional[PlayerId]=None
    collisionDistance: Optional[float]=None
    ballData: Optional[Position]=None
    distance: Optional[float]=None
    distanceToGoal: Optional[float]=None
    nextHitFrameNumber: Optional[int]=None
    goalNumber: Optional[int]=None
    isKickoff: Optional[bool]=None
    shot: Optional[bool]=None
    previousHitFrameNumber: Optional[int]=None
    save: Optional[bool]=None
    dribble: Optional[bool]=None
    dribbleContinuation: Optional[bool]=None
    goal: Optional[bool]=None
    clear: Optional[bool]=None
    aerial: Optional[bool]=None


class Bump(BaseModel):
    frameNumber: Optional[int]=None
    attackerId: Optional[PlayerId]=None
    victimId: Optional[PlayerId]=None
    isDemo: Optional[bool]=None


class BallStats(BaseModel):
    positionalTendencies: Optional[PositionalTendencies]=None
    averages: Optional[AveragesSpeed]=None


class Kickoff(BaseModel):
    startFrameNumber: Optional[int]=None
    endFrameNumber: Optional[int]=None


class PlayerTouch(BaseModel):
    player: Optional[PlayerId]=None
    kickoffPosition: Optional[str]=None
    touchPosition: Optional[str]=None
    playerPosition: Optional[Position]=None
    boost: Optional[int]=None
    ballDist: Optional[float]=None
    startLeft: Optional[bool]=None
    startPosition: Optional[Position]=None


class Touch(BaseModel):
    players: Optional[List[PlayerTouch]]=None
    kickoffGoal: Optional[float]=None
    firstTouchPlayer: Optional[PlayerId]=None


class KickoffStat(BaseModel):
    startFrame: Optional[int]=None
    touchFrame: Optional[int]=None
    touchTime: Optional[float]=None
    type: Optional[str]=None
    touch: Optional[Touch]=None


class BallCarry(Kickoff):
    playerId: Optional[PlayerId]=None
    hasFlick: Optional[bool]=None
    carryTime: Optional[float]=None
    straightLineDistance: Optional[float]=None
    carryStats: Optional[CarryStats]=None


class GameStats(BaseModel):
    hits: Optional[List[Hit]]=None
    neutralPossessionTime: Optional[float]=None
    bumps: Optional[List[Bump]]=None
    ballStats: Optional[BallStats]=None
    kickoffs: Optional[List[Kickoff]]=None
    kickoffStats: Optional[List[KickoffStat]]=None
    ballCarries: Optional[List[BallCarry]]=None


class Mutators(BaseModel):
    ballType: Optional[str]=None
    gameMutatorIndex: Optional[int]=None


class DetailedReplay(BaseModel):
    gameMetadata: Optional[ReplayHeader]=None
    id: str = Field(None, alias="_id", title="Primary key", description="mongodb's Primary key")
    uploadDate: Optional[datetime.datetime]=None
    players: Optional[List[Player]]=None
    teams: Optional[List[Team]]=None
    gameStats: Optional[GameStats]=None
    version: Optional[int]=None
    mutators: Optional[Mutators]=None

    @validator('id', always=True)
    def ab(cls, v, values) -> str:
        return values['gameMetadata'].id