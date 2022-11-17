import StratosphereLogo from '../assets/logo.png'
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'


export default function Header() {
    const {theme} = useContext(ThemeContext)

   return (
   <header className="color">
        <img src={StratosphereLogo} className="block w-25 m-auto logo"/>
        <small className={`m-auto block text-center mb-8 ${theme === 'dark' ? 'text-white' : ' text-black'}`}>pre-Alpha v0.0.3</small>
      </header>
   )
}