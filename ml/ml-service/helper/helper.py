import pandas as pd
from models.Models import duels_model, doubles_model, standard_model

DUELS_COLUMNS = 14 * 2 + 6 + 3 + 1
DOUBLES_COLUMNS = 14 * 4 + 6 + 3 + 1
STANDARD_COLUMNS = 14 * 6 + 6 + 3 + 1

def getModel(df: pd.DataFrame):
    if len(df.columns) == DUELS_COLUMNS:
        return duels_model
    elif len(df.columns) == DOUBLES_COLUMNS:
        return doubles_model
    elif len(df.columns) == STANDARD_COLUMNS:
        return standard_model
    
    raise Exception("Invalid DataFrame columns")