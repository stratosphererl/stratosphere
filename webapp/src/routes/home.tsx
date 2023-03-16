import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/contexts";

export default function Home() {
  const user = useContext(UserContext);

  const userValue = user.user;
  const setUserValue = user.reviseUser;

  return userValue.id !== "0" ? (
    <Navigate to="/browse/0" />
  ) : (
    <div>
      <div>home.tsx</div>
    </div>
  );
}
