import MainPane from "../../components/general/MainPane/mainPane"
import { useContext } from "react"
import { UserContext } from "../../context/contexts"
import "./settings.css"

export default function Settings() {

  const {user, reviseUser} = useContext(UserContext)

  const warningParagraphClasses = "leading-normal mt-5"

  const logOut = () => {
    reviseUser("0")
  } 

  return (
    <MainPane title="Settings" className="settings">
      <div style={{height: 420, fontSize: 32, textAlign: "center"}} className="flex justify-center items-center">
        UNDER CONSTRUCTION
      </div>
      <div className="glass-inner p-10 round mt-10">
          <h2>Warning</h2>
          <p className={warningParagraphClasses}>If you delete your account, all replays and preferences associated with the account will be removed from our servers. While you can always re-create your account by logging in to our platform via Steam or Epic Games again, your previous data will not be retrievable</p>
      </div>
      <div className="flex justify-center">
        <a className="delete-account-btn mt-10" style={{textAlign: "center"}} onClick={logOut} href="/home">DELETE YOUR ACCOUNT</a>
      </div>
    </MainPane>
  );
}