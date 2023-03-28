// import { gql, useQuery } from "@apollo/client";

import ResponseWrapper from "../data/ResponseWrapper";
import response from "../data/mock/response.json";

export default function useReplay(replayid: string) {
    // const { data, loading, error } = useQuery(gql`
    //     query ... {
    //         ...
    //     }`
    // );

    const data = response;
    const loading = false;
    const error = false;

    return {
        data: new ResponseWrapper(data),
        loading: loading,
        error: error,
    }
}