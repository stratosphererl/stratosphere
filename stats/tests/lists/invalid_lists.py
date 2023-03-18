def invalid_list_get_replay_count_arena():
    return [-5432, -1, 6001]

def invalid_list_get_replay_count_duration():
    return [(27,30), (30,41), (-30, 600), (720, -600)]

def invalid_list_get_replay_count_rank():
    return [(-10, 4), (107,2), (4,-1003), (2,234)]

def invalid_list_get_replay_count_season():
    return [(-7,2),(54,2),(2,-300),(2,909)]

def invalid_list_get_user_count_platform():
    return [-17, 2, 9001]

def invalid_list_get_user_count_rank():
    return [(-100,2), (100,2), (2,-100), (2,100)]