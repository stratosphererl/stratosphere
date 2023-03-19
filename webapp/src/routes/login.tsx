import { useContext } from "react"
import { UserContext } from "../context/contexts"

export default function Login() {
    const {user, reviseUser} = useContext(UserContext)

    const logIn = () => {
        reviseUser("ABC")
    }

    return (
        <div>
            <div>login.tsx</div>
            <div>{JSON.stringify(user)}</div>
            <a onClick={logIn} href="/browse/1">click this</a>
        </div>
    );
}