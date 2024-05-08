import Header
  from "./Header.tsx";
import {
  Outlet
} from "react-router-dom";

export function Layout() {
  return (
    <div
      style={{minHeight: "100vh"}}>
      <Header></Header>

      <Outlet/>
    </div>
  );
}