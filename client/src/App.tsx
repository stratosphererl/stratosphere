import './App.css'
import { useState, useEffect } from "react"
import { useQuery, gql } from "@apollo/client"

const GET_ALL_PLAYERS = gql`
query Replays {
  getPlayers {
    username
  }
}
`

function LoadingComponent() {
  return(
    <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  )
}

function UserNameComponent() {
  const [delay, setDelay] = useState(true);
  // you would otherwise use loading for conditional rendering, but its too fast so can create a fake delay
  const {error, data, loading} = useQuery(GET_ALL_PLAYERS)

  useEffect(() => {
    setTimeout(() => {
       console.log("This is a mock delay announcement")
       setDelay(false)
    }, 3000)

  }, []);
  
  if(delay)
    return <LoadingComponent/>

  console.log(data.getPlayers)    
  return data.getPlayers.map((player: any) => <p>{player.username}</p>)
}

function App() {
  const [listShown, setListShown] = useState(false)
  return (
    <div className="App">
      <h1>Stratosphere</h1>
      <button disabled={listShown} onClick={() => setListShown(true)}>Get Rocket League Users</button>
      <div style={{visibility: listShown ? 'visible' : 'hidden'}}>
        <h2><strong>Player List:</strong></h2>
        {
          listShown ? <UserNameComponent></UserNameComponent> : ""
        }
      </div>
    </div>
  )
}

export default App
