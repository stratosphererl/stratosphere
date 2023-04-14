def carball_parse(path : str):
    """
    Takes a path to a replay file and returns the analyzed replay, only accepts decompiled replays (aka output from boxcars_parse)

    :param path: Path to the replay file, only .replay files are supported

    :return: The analyzed replay
    """
    import carball
    from carball.json_parser.game import Game
    from carball.analysis.analysis_manager import AnalysisManager

    _json = carball.decompile_replay(path)
    game = Game()
    game.initialize(loaded_json=_json)

    analysis_manager = AnalysisManager(game)
    analysis_manager.create_analysis()

    parsed_replay = analysis_manager.get_json_data()
    
    return parsed_replay

def boxcars_parse(path : str):
    """
    Takes a path to a replay file and returns a tuple of the replay id and the parsed replay

    :param path: Path to the replay file, only .replay files are supported
    """
    from boxcars_py import parse_replay

    with open(path, "rb") as f:
        raw_replay = parse_replay(f.read())
        id = raw_replay['properties']['Id']
        
        return (id, raw_replay)