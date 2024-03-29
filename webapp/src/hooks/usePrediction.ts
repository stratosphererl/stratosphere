import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";

const GET_REPLAY_DOWNLOAD_LINK = gql`
    query Query($getReplayFileUrlId: String!) {
        getReplayFileURL(id: $getReplayFileUrlId)
    }
`;

const GET_REPLAY_PREDICTION = gql`
    mutation Mutation($file: Upload!) {
        predict(file: $file) {
            keys
            predictions
            model_name
        }
    }
`;

function useReplayFile(url: string | null, filename = "replay") {
    const [data, setData] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (url && !data) {
            setLoading(true);
            setError(null);
            setData(null);
            fetch(url)
                .then((response) => {
                    response.blob().then((blob) => {
                        setData(
                            new File([blob], `${filename}.replay`, {
                                type: blob.type,
                                lastModified: Date.now(),
                            })
                        );
                        setLoading(false);
                    })
                    .catch((err) => {
                        setError(err);
                        setLoading(false);
                    });
                })
                .catch((err) => {
                    setError(err);
                    setLoading(false);
                });
        }
    }, [url]);
    
    return { data, loading, error };
}

export default function usePrediction(replayid: string) {
    const [isFetching, setFetching] = useState(false);

    const { data: link, loading: linkLoading, error: linkError } = useQuery(
        GET_REPLAY_DOWNLOAD_LINK, {
            variables: {
                getReplayFileUrlId: replayid
            }
        });
    
    const { data: file, loading: fileLoading, error: fileError } = 
        useReplayFile(link?.getReplayFileURL, replayid);
    
    const [predict, { 
        data: predictionData, 
        loading: predictionLoading, 
        error: predictionError 
    }] = useMutation(GET_REPLAY_PREDICTION);

    useEffect(() => {
        if (file && !predictionData && !isFetching) {
            console.log("Fetching predictions")
            setFetching(true);
            predict({ variables: { file: file } }).then(() => {
                console.log("Predicted");
                setFetching(false);
            }).catch((err) => {
                console.log(err);
            });
        }

        console.log(link, file, predictionData)
        console.log(linkLoading, fileLoading, predictionLoading)
    }, [file, predict]);

    return {
        data: predictionData,
        loading: linkLoading || fileLoading || predictionLoading,
        error: linkError || fileError || predictionError
    };
}