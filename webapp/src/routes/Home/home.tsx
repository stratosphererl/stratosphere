import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/contexts"

import StratosphereLogo from "../../assets/logo/500.png"
import BackgroundTransition from "../../assets/images/home-transition.png"
import ".//home.css"

export default function Home() {

  const user = useContext(UserContext)

  const userValue = user.user
  const setUserValue = user.reviseUser

  if (userValue.id !== "0") {
    return (<Navigate to="/browse/1"/>)
  } else {
    return (
      <div className="">
        <div className="m-auto flex items-center justify-center mb-[48px] text-logo">
          <img src={StratosphereLogo} className="logo-dims"/>
          <div className="home-chill-blue-stroke-4 strat-text">Stratosphere</div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-wrap items-center">
            <h2 className="w-full flex justify-center home-black-stroke-4 font-36 bottom-margin-24 flex-wrap text-center md:text-center">
              <div>Rocket League's</div>
              <InTextColoring text="coolest"/>
              <div>match analytics platform</div>
            </h2>
            <h2 className="w-screen flex justify-center home-black-stroke-4 font-36 flex-wrap text-center md:text-center">
              <div>Supported by</div>
              <InTextColoring text="intuitive design"/>
              <div>and</div>
              <InTextColoring text="machine learning"/>
            </h2>
          </div>
        </div>
        <footer className="flex justify-center top-margin-72">
          <a href="/login">
            <button className="home-login-button flex justify-center bottom-margin-48">
              <div className="home-login-text">LOGIN</div>
            </button>
          </a>
        </footer>
        <img src={BackgroundTransition} className="home-background-transition"></img>
        <div className="home-main"></div>
      </div>
    );
  }
}

export function InTextColoring(props: {text: string}) {
  return (
    <div className="home-text-ocean-blue">&nbsp;{props.text}&nbsp;</div>
  )
}