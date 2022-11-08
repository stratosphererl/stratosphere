import './App.css'
import HeatmapFromGQL from './gql-components/HeatmapFromGQL'
// import ParseReplay from './gql-components/ParseReplay'
import { UserNameComponent } from './gql-components/usernames'
import ReplayCanvas from './replayViewer/ReplayCanvas'

function App() {
  return (
    <div className="App">
      <header className="justify-center">
        <p className="text-center font-bold text-6xl">Hello World</p>
        <HeatmapFromGQL />
        <ReplayCanvas />
        <UserNameComponent />
      </header>
    </div>
  )
}

export default App