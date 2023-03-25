import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { UserContext } from "../../context/contexts"

import StratosphereLogo from "../../assets/logo/500.png"
import BackgroundTransition from "../../assets/images/home-transition.png"

import HomeImage1 from "../../assets/images/home1.png"
import HomeImage2 from "../../assets/images/home2.png"
import HomeImage3 from "../../assets/images/home3.png"

import ".//home.css"

export default function Home() {

  const user = useContext(UserContext)

  const userValue = user.user
  const setUserValue = user.reviseUser

  if (userValue.id !== "0") {
    return (<Navigate to="/browse/1"/>)
  } else {
    return (
      <div className="mt-24">
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
        {/* <footer className="flex justify-center top-margin-72">
          <a href="/login">
            <button className="home-login-button flex justify-center bottom-margin-48">
              <div className="vertical-text">LOGIN</div>
            </button>
          </a>
        </footer> */}
        <img src={BackgroundTransition} className="home-background-transition"></img>

        {/* Block 1: Want to Improve?*/}
        <HomePresentationBlock
          img={HomeImage1}
          title="WANT TO IMPROVE?"
          shortName="Upload"
          longName="Upload your replay"
          text={
            <p className="home-body-text -mb-1">
              Send your replay to our
              <InTextColoring text="backend services"/>
              in order to receive
              <InTextColoring text="simple data"/>
              about your play and that of your opponents,
              <InTextColoring text="aggregated match statistics"/>
              for you to parse through, and
              <InTextColoring text="unique analytics"/>
              gathered via
              <InTextColoring text="machine learning"/>
            </p>
          }/>

        <div className="margin-spacing bg-black"></div>

        {/* Block 2: See Your Opponents? */}
        <HomePresentationBlock 
          img = {HomeImage2}
          title = "SEE YOUR OPPONENTS?"
          shortName = "Browse"
          longName = "Browse other replays"
          text={
            <p className="home-body-text -mb-1">
              Browse through the over
              <InTextColoring text="1000 replays"/>
              that
              <InTextColoring text="100s of users"/>
              and counting have uploaded to our platform to get a feel for the
              <InTextColoring text="type of skills"/>
              and
              <InTextColoring text="tactics"/>
              which players of
              <InTextColoring text="any rank"/>
              posses and consider how to
              <InTextColoring text="counter"/>
              them 
            </p>
          }/>

          <div className="margin-spacing bg-black"></div>

          {/* Block 3: Have Data In-Game? */}
          <HomePresentationBlock
          img = {HomeImage3}
          title = "HAVE DATA IN-GAME?"
          shortName="Download"
          longName="Download our overlay"
          text = {
            <p className="home-body-text -mb-1">
              <InTextColoring text="In addition"/>
              to seeing our analytics online, you can
              <InTextColoring text="view them while in-game!"/>
              Learn more about your play, as you play, in a comprehensive manner and
              <InTextColoring text="automatically upload replays"/>
              to our site for
              <InTextColoring text="further analysis"/>
            </p>
          }/>
      </div>
    );
  }
}

export function HomePresentationBlock (props: {img: string, title: string, shortName: string, longName: string, text: JSX.Element}) {
  return (
    <div className="home-main">
      <div className="flex flex-nowrap justify-center">
        <img src={props.img} className="ml-8 home-image"/>
        <div className="mx-8 home-text-box my-auto">
          <h1 className="chill-blue-stroke-2 italic home-subtitle">{props.title}</h1>
          {props.text}
          { window.innerWidth < 845 ? // Change display of text based on initial screen width
            <a href="/upload" className="home-lower-button mt-6"><div className="vertical-text">{props.shortName}</div></a> :
            <a href="/upload" className="home-lower-button mt-6"><div className="vertical-text">{props.longName}</div></a>
          }
        </div>
      </div>
    </div>
  )
}

export function InTextColoring(props: {text: string}) {
  return (
    <i><span className="home-text-ice-blue">&nbsp;{props.text}&nbsp;</span></i>
  )
}