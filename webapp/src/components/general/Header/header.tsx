import logo from "../../../assets/logo/700.png"
import Dropdown from "../Dropdown/dropdown"
import { useContext } from "react"
import { UserContext } from "../../../context/contexts"
import "./header.css"

export default function Header() {
    const navStyle = "text-2xl self-center montserrat font-semibold italic ocean-blue-stroke-2"
    const {user, reviseUser} = useContext(UserContext)

    const logOut = () => {
        reviseUser("0")
    }

    return (
        <header style={{justifyContent: "space-between"}} className="p-4 gray-2-gradient flex">
            <nav className="flex gap-4">
            <a href={user.id !== "0" ? "/browse/0" : "/home"}>
                <img 
                style={{display: "inline-block", maxHeight: "72px", maxWidth: "72px"}} 
                className="header-logo-padding"
                src={logo}>
                </img>
            </a>
            <a className={`${navStyle}`} href="/upload">Upload</a>
            <a className={`${navStyle}`} href="/browse/0">Browse</a>
            <a className={`${navStyle}`} href="/overlay">Overlay</a>
            <a className={`${navStyle}`} href="/stats/0">Statistics</a>
            <a className={`${navStyle}`} href="/about">About</a>
            </nav>
            {
                user.id === "0" ?
                <div className="flex gap-4">
                    <a className="header-block header-block-button" href="/login">Login</a>
                </div>
                :
                <Dropdown DropdownButton={<button className="header-block header-block-button justify-self-end">Profile</button>}>
                    <a href="/browse/1" className="mini-header-block-button-regular">Replays</a>
                    <a href="/stats/1" className="mini-header-block-button-regular">Stats</a>
                    <a href="/settings" className="mini-header-block-button-regular">Settings</a>
                    <a onClick={logOut} href="/home" className="mini-header-block-button-logout">Logout</a>
                </Dropdown>
            }
        </header>
    )
}