import './App.css'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
          "From App.tsx"
      </div>
    </ThemeProvider>
  )
}

export default App