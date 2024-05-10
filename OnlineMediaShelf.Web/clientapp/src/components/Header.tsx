import {
  Menu,
  MenuTrigger,
  Skeleton,
  SkeletonItem,
  tokens,
  Toolbar,
  ToolbarButton
} from "@fluentui/react-components";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBookOpen,
  faHouse
} from "@fortawesome/free-solid-svg-icons";
import {
  routes,
  UserContext
} from "../App.tsx";
import {
  Link
} from "react-router-dom";
import {
  CSSProperties,
  useContext,
  useEffect,
  useState
} from "react";
import {
  AccountClient
} from "../OMSWebClient.ts";

function Header() {
  const sidebarButtonStyle: CSSProperties = {
    width: "100%",
    justifyContent: "start",
  };

  const {user} = useContext(UserContext);

  return (<>
    <Menu>
      <Toolbar
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: tokens.colorBrandBackground2,
          display: "flex"
        }}>
        <MenuTrigger>
          <ToolbarButton
            icon={
              <FontAwesomeIcon
                icon={faBars}/>}
          />
        </MenuTrigger>
        <Link
          to={routes.root}>
          <ToolbarButton>Online Media Shelves </ToolbarButton>
        </Link>
        <div
          style={{
            position: "absolute",
            right: "10px",
          }}>
          {
            user?.currentUser == undefined ?
              <ToolbarButton>
                <SkeletonItem
                  shape="rectangle"
                  size={16}/>
              </ToolbarButton> :
              user.currentUser?.isLoggedIn ?
                <Link
                  to={routes.myShelves}>
                  <ToolbarButton>
                    {user.currentUser.userName}
                  </ToolbarButton>
                </Link> :
                <Link
                  to={routes.login}>
                  <ToolbarButton
                    style={{float: "right"}}>
                    Login
                  </ToolbarButton>
                </Link>
          }
        </div>
      </Toolbar>

      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          boxSizing: "border-box",
          zIndex: 100,
          width: "250px",
          backgroundColor: tokens.colorNeutralBackground2
        }}>
        <div
          style={{
            width: "100%",
            display: "block",
            textAlign: "center"
          }}>
          <h3>Online Media Shelves</h3>
        </div>
        <Toolbar
          vertical={true}
          style={{
            alignItems: "stretch",
            width: "100%",
            boxSizing: "border-box",
          }}>
          <Link
            to={routes.root}>
            <ToolbarButton
              style={sidebarButtonStyle}
              icon={
                <FontAwesomeIcon
                  icon={faHouse}/>}>
              Home
            </ToolbarButton>
          </Link>
          <Link
            to={routes.myShelves}>
            <ToolbarButton
              style={sidebarButtonStyle}
              icon={
                <FontAwesomeIcon
                  icon={faBookOpen}/>}>
              My Shelves
            </ToolbarButton>
          </Link>
        </Toolbar>
      </div>
    </Menu>
  </>);
}

export default Header;