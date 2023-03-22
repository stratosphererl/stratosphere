import "./footer.css"
import "../../../index.css"
import DiscordLogo from "../../../assets/media/discord.png"
import PatreonLogo from "../../../assets/media/patreon.png"
import TwitterLogo from "../../../assets/media/twitter.png"
import GithubLogo from "../../../assets/media/github-light.png"
import BakkesLogo from "../../../assets/media/bakkes.png"
import DarkmodeLogo from "../../../assets/mode/darkmode-light.png"

export default function Header() {
    return (
        <footer style={{height: 267, display: "flex", flexWrap: "wrap", justifyContent: "center"}} className="footer gray-2-gradient-inverted">
            <div className="horizontal-footer-bar upper-margin"></div>
            <div className="flex flex-wrap">
                <MediaIcon src={DiscordLogo} link="https://discord.com/"/>
                <MediaIcon src={PatreonLogo} link="https://www.patreon.com/"/>
                <MediaIcon src={TwitterLogo} link="https://twitter.com/"/>
                <MediaIcon src={GithubLogo} link="https://github.com/stratosphererl/stratosphere"/>
                <MediaIcon src={BakkesLogo} link="https://bakkesplugins.com/"/>
                <div className="vertical-footer-bar bar-padding"/>
                {/* TODO: change the src depending on current theme context state */}
                <a><img onClick={ChangeDisplayMode} className="footer-icon show-pointer" src={DarkmodeLogo}></img></a>
            </div>
            <div className="horizontal-footer-bar"></div>
            <div>© Stratosphere 2023</div>
        </footer>
    )
}

// TODO: Implement change of theme context state
export function ChangeDisplayMode() {
    console.log("Clicked!")
}

export function MediaIcon(props: {src: string, link: string}) {
    return (
        <a href={props.link}>
            <img src={props.src} className="footer-icon icon-padding"></img>
        </a>
    )
}