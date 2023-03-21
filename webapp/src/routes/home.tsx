import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/contexts"

export default function Home() {

  const user = useContext(UserContext)

  const userValue = user.user
  const setUserValue = user.reviseUser
import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/contexts"

export default function Home() {

  const user = useContext(UserContext)

  const userValue = user.user
  const setUserValue = user.reviseUser

  if (userValue.id !== "0") {
    return (<Navigate to="/browse/0"/>)
  } else {
    return (
      <div>
        <div>home.tsx</div>
      </div>
    );
  }
}