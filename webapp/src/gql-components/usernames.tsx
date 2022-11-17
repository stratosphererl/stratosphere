import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "../components/loading";

const GET_ALL_PLAYERS = gql`
query Replays {
  getPlayers {
    username
  }
}
`

export function UserNameComponent() {
    const [delay, setDelay] = useState(true);
    const {error, data, loading} = useQuery(GET_ALL_PLAYERS);
  
    useEffect(() => {
      setTimeout(() => {
         console.log("This is a mock delay announcement")
         setDelay(false)
      }, 3000)
    }, []);
  
    // Change delay to loading later
    if (delay)
      return <LoadingAnimation />
  
    if (error)
      return <p>Error you suck!</p>
  
    let id = 0;
    return (
      <div>
        <div className="text-center">
        <h1 className="text-5xl text-yellow-400 font-bold mt-0 mb-6">Player Names</h1>
          {
            data?.getPlayers?.map((player: any) => <p className="text-white font-semibold" key={++id}>{player.username}</p>)
          }
        </div>
      </div>
    );
  }