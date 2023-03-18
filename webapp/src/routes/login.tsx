import { useContext } from "react"
import { UserContext } from "../context/contexts"

export default function Login() {
    const user = useContext(UserContext)

    const userValue = user.user
    const setUserValue = user.reviseUser

    return (
        <div>
            <div>login.tsx</div>
            <div>{JSON.stringify(userValue)}</div>
            <button onClick={() => setUserValue("ABC")}>click this</button>
        </div>
    );
}