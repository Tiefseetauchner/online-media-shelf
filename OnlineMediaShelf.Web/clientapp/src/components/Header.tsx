import {
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
  faHouse,
  faList,
  faUser,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {
  UserContext
} from "../App.tsx";
import {
  Link
} from "react-router-dom";
import {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import {
  routes
} from "../utilities/routes.ts";


interface NavBarButtonProps extends PropsWithChildren {
  icon: IconDefinition;
  to: string;
}

function Header() {

  const [open, setOpen] = useState(false);

  const {user} = useContext(UserContext);

  function NavBarButton(props: NavBarButtonProps) {
    const sidebarButtonStyle: CSSProperties = {
      width: "100%",
      justifyContent: "start",
    };

    return <Link
      onClick={() => toggleMenu()}
      to={props.to}>
      <ToolbarButton
        style={sidebarButtonStyle}
        icon={
          <FontAwesomeIcon
            icon={props.icon}/>}>
        {props.children}
      </ToolbarButton>
    </Link>;
  }

  const toggleMenu = () => setOpen(prevState => !prevState);

  return (<>
    <Toolbar
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: tokens.colorBrandBackground2,
        display: "flex"
      }}>
      <ToolbarButton
        icon={
          <FontAwesomeIcon
            icon={faBars}/>}
        onClick={() => toggleMenu()}/>
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
                to={routes.userAccount}>
                <ToolbarButton>
                  {user.currentUser.userName}
                </ToolbarButton>
              </Link> :
              <Link
                to={routes.login}>
                <ToolbarButton>
                  Login
                </ToolbarButton>
              </Link>
        }
      </div>
    </Toolbar>

    <div
      style={{
        display: open ? "block" : "none",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        boxSizing: "border-box",
        zIndex: 100,
        width: "100vw",
        backgroundColor: "#00000055"
      }}
      onClick={() => toggleMenu()}></div>

    <div
      style={{
        position: "fixed",
        left: open ? 0 : "-250px",
        top: 0,
        height: "100vh",
        boxSizing: "border-box",
        zIndex: 100,
        width: "250px",
        backgroundColor: tokens.colorNeutralBackground2,
        overflow: "auto",
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
        <NavBarButton
          to={routes.root}
          icon={faHouse}>Home</NavBarButton>
        <NavBarButton
          to={routes.shelf}
          icon={faBookOpen}>Shelves</NavBarButton>
        <NavBarButton
          to={routes.item}
          icon={faList}>All Items</NavBarButton>
        {
          user?.currentUser == undefined ?
            <NavBarButton
              to={routes.shelf}
              icon={faUser}>
              <SkeletonItem
                shape="rectangle"
                size={16}/>
            </NavBarButton> :
            user.currentUser?.isLoggedIn ?
              <>
                <NavBarButton
                  to={routes.userAccount}
                  icon={faUser}>{user.currentUser.userName}</NavBarButton>
              </> :
              <NavBarButton
                to={routes.login}
                icon={faUser}>Login</NavBarButton>
        }
      </Toolbar>
    </div>
  </>);
}

export default Header;