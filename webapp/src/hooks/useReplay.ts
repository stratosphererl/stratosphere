// import { gql, useQuery } from "@apollo/client";

import ResponseDataWrapper from "../data/ResponseDataWrapper";
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
    data: new ResponseDataWrapper(data),
    loading: loading,
    error: error,
  };
}
