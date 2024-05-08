import {
  Menu,
  MenuTrigger,
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
  routes
} from "../App.tsx";
import {
  Link
} from "react-router-dom";
import {
  CSSProperties
} from "react";

function Header() {
  const sidebarButtonStyle: CSSProperties = {
    width: "100%",
    justifyContent: "start",
  };

  return (<>
    <Menu>
      <Toolbar
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: tokens.colorNeutralBackground4
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