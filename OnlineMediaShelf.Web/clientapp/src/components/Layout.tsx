import Header from "./Header.tsx";
import {Outlet} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AccountClient} from "../OMSWebClient.ts";
import {UserContext} from "../App.tsx";
import {tokens} from "@fluentui/react-components";

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
      <Header/>
      
      <div style={{padding: tokens.spacingHorizontalM}}>
        <Outlet/>
      </div>
    </div>
  );
}