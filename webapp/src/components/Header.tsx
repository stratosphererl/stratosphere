import StratosphereLogo from '../assets/logo.png'

export default function Header() {
   return (
   <header className="color">
        <img src={StratosphereLogo} className="block w-25 m-auto logo"/>
        <small className="m-auto block text-center decoration-slate-50 mb-8">pre-Alpha v0.0.3</small>
      </header>
   )
}