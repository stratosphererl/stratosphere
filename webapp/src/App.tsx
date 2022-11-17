import './App.css'
import Header from './components/Header'
import Main from './components/Main'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'
import ThemeSwitch from './components/ThemeSwitch'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
          <ThemeSwitch  />
          <Header />
          <Main />
      </div>
    </ThemeProvider>
  )
}

export default App