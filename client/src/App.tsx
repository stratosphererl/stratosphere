import './App.css'
import { useState, useEffect } from "react"
import { useQuery, gql } from "@apollo/client"

// gql query
const GET_ALL_PLAYERS = gql`
query Replays {
  getPlayers {
    username
  }
}
`

function LoadingComponent() {
  const cells = [1,2,3,4,5,6,7,8,9];
  return(
    <div className="lds-grid">
      {
        // a total of 9 divs that makes up the loading grid
        cells.map(cell => <div></div>)
      }
      </div>
  )
}
function UserNameComponent({setButtonDisabled, setErrorShown}) {
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
  
  
  if (error) {
    setButtonDisabled(false)
    setErrorShown(true)
    return console.log("Error!")
  }

  return data.getPlayers.map((player: any) => <p>{player.username}</p>)
}

function App() {
  const [listShown, setListShown] = useState<boolean>(false)
  const [errorShown, setErrorShown] = useState<boolean>(false)

  return (
    <div className="App">
      <h1>Stratosphere ⚽🏎️</h1>
      <button
       className={errorShown ? "btn-error-trans" : ""} 
       disabled={listShown} 
       onClick={() => {
        if(errorShown)
          setErrorShown(false)
        setListShown(true)
        }}>Get Rocket League Users
      </button>
      <div style={{visibility: listShown ? 'visible' : 'hidden'}}>
        <h2><strong>Player List:</strong></h2>
        {
          listShown ? <UserNameComponent setButtonDisabled={setListShown} setErrorShown={setErrorShown}/> : ""
        }
      </div>
    </div>
  )
}

export default App
