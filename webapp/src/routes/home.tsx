import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/contexts";

export default function Home() {
  const user = useContext(UserContext);

  const userValue = user.user;
  const setUserValue = user.reviseUser;

  const userValue = user.user;
  const setUserValue = user.reviseUser;

  if (userValue.id !== "0") {
    return <Navigate to="/browse/0" />;
  } else {
    return (
      <div>
        <div style={{ height: 972, width: 1912 }}>home.tsx</div>
        <div style={{ height: 1766, width: 1912 }}>TEST</div>
      </div>
    );
  }
}
