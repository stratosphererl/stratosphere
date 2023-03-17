import logo from "../../assets/logo/72.png"

export default function Header() {
    return (
        <div className="gray-2-gradient flex items-center">
            <a href="/home">
                <img className="header-logo-padding" src={logo}></img>
            </a>
            <HeaderTextButton text="Upload" link="/upload"/>
            <HeaderTextButton text="Browse" link="/browse/0"/>
            <HeaderTextButton text="Overlay" link="/overlay"/>
            <HeaderTextButton text="Statistics" link="/stats/0"/>
            <HeaderTextButton text="About" link="/about"/>
            <div style={{width: 747}}/>
            <HeaderBlockButton text="Login" link="/login"/>
        </div>
    );
}

export function HeaderTextButton(props: {text: string, link: string}) {
    return (
        <a href={props.link}>
            <button type="button" className="header-text-padding text-size-32 montserrat-semibold-italic ocean-blue-stroke-2">{props.text}</button>
        </a>
    )
}

export function HeaderBlockButton(props: {text: string, link: string}) {
    return (
        <a href={props.link}>
            <button type="button" className="header-block-button">{props.text}</button>
        </a>
    )
}