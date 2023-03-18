import logo from "../../assets/logo/72.png"
import { useContext } from "react"
import { HeaderContext, UserContext } from "../../context/contexts"

export default function Header() {
    const userValue = useContext(UserContext).user
    const setUserValue = useContext(UserContext).reviseUser

    const dropdownValue = useContext(HeaderContext).showDropdown
    const toggleDropdownValue = useContext(HeaderContext).toggleDropdown

    const dropdownTitles = ["Replays","Stats","Settings","Logout"]
    const dropdownLinks = ["/browse/1","/stats/1","/settings","/about"]

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
            {
                (userValue.id === "0") ? 
                <HeaderLinkButton text="Login" link="/login"/> : 
                
                (dropdownValue === false ?
                    <HeaderToggleButton text="Profile" toggle={toggleDropdownValue}/> :
                    <div style={{height: 73}}>
                        <HeaderToggleButton text="Profile" toggle={toggleDropdownValue}/>
                        <ProfileDropdown titles={dropdownTitles} links={dropdownLinks}/>
                    </div>
                )
            }

            {/* {
                (dropdownValue === true) ?
                <ProfileDropdown titles={dropdownTitles} links={dropdownLinks}/> : // Add setUserValue("0") inside component
                <div></div>
            } */}

        </div>
    )
}

export function HeaderTextButton(props: {text: string, link: string}) {
    return ( <a href={props.link}> <button type="button" className="header-text-padding text-size-32 montserrat-semibold-italic ocean-blue-stroke-2">{props.text}</button> </a> )
}

export function HeaderLinkButton(props: {text: string, link: string}) {
    return ( <a href={props.link}> <button type="button" className="header-block-button">{props.text}</button> </a> )
}

export function HeaderToggleButton(props: {text: string, toggle: Function}) {
    return ( <button type="button" className="header-block-button" onClick={() => props.toggle()}>{props.text}</button> )
}

export function ProfileDropdown(props: {titles: string[], links: string[]}) {
    return (
        props.titles.map((item, i) => (
            <div className="flex flex-nowrap">
                <div style={{width: 23, height: 62}}></div>
                <a href={props.links[i]}> <button className="mini-header-block-button">{props.titles[i]}</button> </a>
            </div>
        ))
    )
}