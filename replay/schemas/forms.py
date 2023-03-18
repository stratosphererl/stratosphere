import pydantic

class ReplayUpdateForm(pydantic.BaseModel):
    name: str

