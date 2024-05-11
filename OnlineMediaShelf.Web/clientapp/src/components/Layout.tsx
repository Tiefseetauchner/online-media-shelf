import Header from "./Header.tsx";
import {Outlet} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AccountClient} from "../OMSWebClient.ts";
import {UserContext} from "../App.tsx";

export function Layout() {
  const {setUser} = useContext(UserContext);

  useEffect(() => {
    new AccountClient().getCurrentUser().then((userResponse) => setUser ? setUser({
      currentUser: userResponse
    }) : null);
  }, [])

  return (
    <div
      style={{minHeight: "100vh"}}>
      <Header></Header>

      <Outlet/>
    </div>
  );
}