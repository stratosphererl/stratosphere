import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, gql } from "@apollo/client";

import MainPane from "../../components/general/MainPane/mainPane"
import LoginButton from "../../components/general/Button/Login/loginButton"
import { UserContext } from "../../context/contexts"
import {getRandomInt, generatePlatform, generateName} from "../../tools/randomNames";
import "./login.css"

const CREATE_USER = gql`
mutation Mutation($createUserId: Int!, $platform: String!, $username: String!) {
  createUser(id: $createUserId, platform: $platform, username: $username) {
    date_created
    id
    losses
    number_of_replays
    total_assists
    platform
    total_goals
    total_saves
    total_shots
    username
    wins
  }
}
`;

export default function Login() {
    const {user, reviseUser} = useContext(UserContext)
    const navigate = useNavigate();

    const [createUser, {data, error}] = useMutation(CREATE_USER, {onCompleted: () => {
        console.log(data);
        // reviseUser(data.createUser);
        // navigate("/browse/1");
    }});

    const disclaimerParagraphClasses = "leading-normal mt-5"

    const generateMockUser = () => {
        return {
            createUserId: getRandomInt(0, 1000000),
            username: generateName(),
            platform: generatePlatform(),
        }
    }

    const logIn = () => {
        createUser({variables: generateMockUser()});
        // reviseUser("test");
        // navigate("/browse/1");
        // navigate(0);
    }

    return (
        <MainPane className="login" title="">
            <div>
                <h1 className="text-center">Login</h1>
                <p className="text-center mt-[-0.6rem]">New to Stratosphere? Signing up is free.</p>
                
                <div className="flex flex-col gap-10 items-center m-10">
                    <LoginButton onClick={logIn} label={{value: "Sign in with Steam"}}>
                        <i className="fa fa-steam"></i>
                    </LoginButton>

                    <p className="divider">or</p>

                    <LoginButton label={{value: "Sign in with Epic Games"}} icon={{backgroundColor: "rgb(50,50,50)"}} onClick={logIn} >
                        <i className="fa fa-epicgames"></i>
                    </LoginButton>
                </div>

                <div className="glass-inner p-10 round mt-10">
                    <h2>Disclaimer</h2>
                    <p className={disclaimerParagraphClasses}>To provide profile services to users in the most effective and secure manner possible, we use third-party authentication via Steam and Epic Games.</p>
                    <p className={disclaimerParagraphClasses}>Please select the platform and use login credentials for an account which has Rocket League in its library. Your profile will then be associated with your Rocket League account, which may improve in-game functionality if you were to use our overlay plugin.</p>
                    <p className={disclaimerParagraphClasses}>We will not receive your login credentials, and do not store such information whatsoever. </p>
                </div>
            </div>
        </MainPane>
    );
}