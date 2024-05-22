import {
  Link,
  useRouteError
} from "react-router-dom";
import {
  CSSProperties
} from "react";
import {
  tokens
} from "@fluentui/react-components";
import {
  routes
} from "../utilities/routes.ts";

export function ErrorPage() {
  const error: any = useRouteError();

  let errorStyle: CSSProperties = {
    textAlign: "center",
    width: "100%",
  }

  return (
    <div
      style={errorStyle}>
      <h1>Oh no!</h1>
      <p>While loading the page, an error occured.</p>
      <p
        style={{
          fontStyle: "italic",
          color: tokens.colorNeutralForeground2
        }}>
        {error.statusText || error.message}
      </p>

      <Link
        to={routes.root}>
        <h3>Back Home!</h3>
      </Link>
    </div>)
}