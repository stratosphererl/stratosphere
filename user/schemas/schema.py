from dataclasses import dataclass

@dataclass
class UserSchema():
    id: int
    platform: str
    username: str
    date_created: str | None
    number_of_replays: int  | None = 0
    wins: int | None = 0
    losses: int | None = 0
    total_goals: int | None = 0
    total_assists: int | None = 0
    total_saves: int | None = 0
    total_shots: int | None = 0
