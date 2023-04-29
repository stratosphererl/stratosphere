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
                goals {
                    frame_number
                    player_name
                }
                length
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

    console.log(dataWrapper)

    return {
        data: dataWrapper,
        loading: loading || framesLoading,
        error: error || framesError,
    }
}