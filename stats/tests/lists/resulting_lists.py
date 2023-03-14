import routers.router as routes

def resulting_list_get_replay_count_all():
    return [routes.get_replay_count_all()]

def resulting_list_get_replay_count_arena():
    return [routes.get_replay_count_arena(x) for x in (3,27)]

def resulting_list_get_user_count_all():
    return [routes.get_user_count_all()]

def resulting_list_get_user_count_platform():
    return [routes.get_user_count_platform(x) for x in (0,1)]