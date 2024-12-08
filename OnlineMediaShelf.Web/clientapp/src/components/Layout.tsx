import Header
  from "./Header.tsx";
import {
  Link,
  Outlet
} from "react-router-dom";
import {
  useContext,
  useEffect
} from "react";
import {
  AccountClient
} from "../OMSWebClient.ts";
import {
  UserContext
} from "../App.tsx";
import {
  Caption2,
  tokens,
  useToastController
} from "@fluentui/react-components";
import {
  Container
} from "react-bootstrap";
import {
  routes
} from "../utilities/routes.ts";
import {
  showErrorToast
} from "../utilities/toastHelper.tsx";

export function Layout() {
  const {setUser} = useContext(UserContext);

  const {dispatchToast} = useToastController();

  useEffect(() => {
    new AccountClient().getCurrentUser().then((userResponse) => setUser ? setUser({
      currentUser: userResponse
    }) : null).catch(() => showErrorToast("Could not get current user", dispatchToast));
  }, [])

  return (
    <div
      className={"d-flex flex-column min-vh-100"}>
      <Header/>

      <div
        style={{padding: tokens.spacingHorizontalM}}>
        <Outlet/>
      </div>

      <footer
        className="text-center bg-dark mt-auto">
        <Container
          className="text-white py-4 py-lg-5">
          <ul
            className="list-inline">
            <li
              className="list-inline-item me-4">
              <Link
                className="link-light"
                to={routes.root}>Home</Link>
            </li>
            <li
              className="list-inline-item me-4">
              <Link
                className="link-light"
                to={routes.privacy}>Privacy Policy</Link>
            </li>
          </ul>
          <Caption2
            className="mb-0">This is an open source project, licensed under <Link
            to={"https://github.com/tiefseetauchner/online-media-shelf/?tab=MIT-1-ov-file#readme"}>MIT</Link>. User-generated images on this site may be subject to copyright.
          </Caption2>
        </Container>
      </footer>
    </div>
  );
}