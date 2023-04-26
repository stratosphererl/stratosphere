import { useContext } from "react"
import { UserContext } from "../context/contexts"

export function importUserContext() {
    const user = useContext(UserContext)

    const userValue = user.user
    const setUserValue = user.reviseUser

    return [userValue, setUserValue]
}