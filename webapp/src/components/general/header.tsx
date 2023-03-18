import logo from "../../assets/logo/72.png"
import { useContext } from "react"
import { HeaderContext, UserContext } from "../../context/contexts"

// export default function About() {  
//     // const {user, setUser} = useContext(UserContext) // This line WORKS

//     const user = useContext(UserContext)

//     const userValue = user.user
//     const setUserValue = user.reviseUser

//     return (
//         <div>
//             <div>about.tsx</div>
//             <div>{JSON.stringify(userValue)}</div>
//             <button onClick={() => setUserValue("ABC")}>click this</button>
//         </div>
//     )
// }

export default function Header() {
    const userValue = useContext(UserContext).user
    const setUserValue = useContext(UserContext).reviseUser

    const dropdownValue = useContext(HeaderContext).showDropdown
    const toggleDropdownValue = useContext(HeaderContext).toggleDropdown

    const dropdownTitles = ["Replays","Stats","Settings","Logout"]
    const dropdownLinks = ["/browse/1","/stats/1","/settings","/home"]

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
                        <ProfileDropdown titles={dropdownTitles} links={dropdownLinks} toggle={setUserValue}/>
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

export function ProfileDropdown(props: {titles: string[], links: string[], toggle: Function}) {
    return (
        props.titles.map((item, i) => (
            <div className="flex flex-nowrap">
                <div style={{width: 23, height: 62}}></div>
                {
                    i < 3 ? 
                    <a href={props.links[i]}> <button className="mini-header-block-button-regular">{props.titles[i]}</button> </a> :
                    <a href={props.links[i]}> <button className="mini-header-block-button-logout" onClick={() => props.toggle("0")}>{props.titles[i]}</button> </a>
                }
            </div>
        ))
    )
}