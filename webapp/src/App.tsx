import './App.css'
import ParseReplay from './gql-components/ParseReplay'
import { UserNameComponent } from './gql-components/usernames'

function App() {
  return (
    <div className="App">
      <header className="justify-center">
        <p className="font-bold text-6xl">Hello World</p>
        <ParseReplay />
        <UserNameComponent />
      </header>
    </div>
  )
}

export default App
