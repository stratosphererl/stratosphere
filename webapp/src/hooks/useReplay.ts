import { gql, useQuery } from "@apollo/client";

import ResponseDataWrapper from "../data/ResponseDataWrapper";

const GET_REPLAY = gql`
    query Query($getReplayId: String!) {
        getReplay(id: $getReplayId) {
            players {
                name
                saves
                score
                shots
                assists
                goals
                isOrange
                id {
                    id
                }
                stats {
                    ballCarries {
                        totalCarries
                        totalCarryTime
                    }
                    boost {
                        boostUsage
                        numLargeBoosts
                        numSmallBoosts
                        timeFullBoost
                        timeLowBoost
                        timeNoBoost
                        wastedBig
                        wastedSmall
                    }
                    hitCounts {
                        totalClears
                    }
                    positionalTendencies {
                        timeBehindBall
                        timeHighInAir
                        timeInAttackingHalf
                        timeInAttackingThird
                        timeInDefendingHalf
                        timeInDefendingThird
                        timeInFrontBall
                        timeInNeutralThird
                        timeLowInAir
                        timeOnGround
                    }
                    possession {
                        possessionTime
                    }
                }
            }
            teams {
                isOrange
                playerIds {
                    id
                }
                score
                stats {
                    boost {
                        boostUsage
                    }
                    hitCounts {
                        totalAerials
                        totalClears
                        totalHits
                    }
                    possession {
                        possessionTime
                    }
                }
            }
            gameStats {
                ballStats {
                    positionalTendencies {
                    timeInAttackingHalf
                    timeInAttackingThird
                    timeInDefendingHalf
                    timeInDefendingThird
                    timeInNeutralThird
                    }
                }
            }
            gameHeader {
                gameMode
                gameType
                frames
                id
                length
                map {
                    id
                    name
                    variant
                }
                matchType
                name
                overtime
                players {
                    is_bot
                    is_orange
                    name
                    online_id
                    platform
                    rank {
                        mmr
                        id
                        title
                        division
                    }
                }
                ranked
                region
                season {
                    id
                    name
                }
                teamSize
                teams {
                    playerIds {
                        id
                    }
                    isOrange
                    score
                }
                time
                uploadDate
                version
                goals {
                    frame_number
                    player_name
                }
            }
        }
    }
`;

const GET_FRAMES_URL = gql`
    query Query($getReplayFramesFileUrlId: String!) {
        getReplayFramesFileURL(id: $getReplayFramesFileUrlId)
    }
`

export default function useReplay(replayid: string) {
    const { data, loading, error } = useQuery(GET_REPLAY, {
        variables: { getReplayId: replayid },
    });
    const { data: framesData, loading: framesLoading, error: framesError } = useQuery(GET_FRAMES_URL, {
        variables: { getReplayFramesFileUrlId: replayid },
    });

    const dataWrapper = new ResponseDataWrapper(data?.getReplay, framesData?.getReplayFramesFileURL);

    return {
        data: dataWrapper,
        loading: loading || framesLoading,
        error: error || framesError,
    }
}