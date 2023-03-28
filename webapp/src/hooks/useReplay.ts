// import { gql, useQuery } from "@apollo/client";

import ResponseWrapper from "../data/ResponseWrapper";
import response from "../data/mock/response.json";

export default function useReplay(replayid: string) {
  // const { data, loading, error } = useQuery(gql`
  //     query ... {
  //         ...
  //     }`
  // );

  const data = new ResponseWrapper(response);
  const loading = false;
  const error = false;

  return {
    data: new ResponseDataWrapper(data),
    loading: loading,
    error: error,
  };
}

    return {
        data: data,
        loading: loading,
        error: error,
    }
}