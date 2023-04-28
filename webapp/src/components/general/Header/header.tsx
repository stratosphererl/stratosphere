import logo from "../../../assets/logo/500.png"
import Dropdown from "../Dropdown/dropdown"
import { useContext } from "react"
import { UserContext } from "../../../context/contexts"
import "./header.css"

export default function Header() {
    const navStyle = "text-2xl self-center montserrat font-semibold italic ocean-blue-stroke-2"
    const dropdownStyle = "text-xl px-6 py-4 border-t-0"

    const {user, reviseUser} = useContext(UserContext)

    // The logout button should be its own component, but I'm lazy
    const logOut = () => {
        reviseUser("0")
    }

    return (
        <header className="p-4 gray-2-gradient flex mb-5 justify-between">
            <nav className="flex gap-4">
                <a href={user.id !== "0" ? "/browse/0" : "/home"}>
                    <img 
                    style={{display: "inline-block", maxHeight: "56px", maxWidth: "56px", margin: "8px"}} 
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
                    <a className="primary-btn" href="/login">Login</a>
                </div>
                :
                <Dropdown DropdownButton={<button className="primary-btn justify-self-end">Profile</button>}>
                    <a href="/browse/1" className={`${dropdownStyle} primary-btn`}>Replays</a>
                    <a href="/stats/1" className={`${dropdownStyle} primary-btn`}>Stats</a>
                    <a href="/settings" className={`${dropdownStyle} primary-btn`}>Settings</a>
                    <a onClick={logOut} href="/home" className={`${dropdownStyle} warning-btn`}>Logout</a>
                </Dropdown>
            }
        </header>
    )
}