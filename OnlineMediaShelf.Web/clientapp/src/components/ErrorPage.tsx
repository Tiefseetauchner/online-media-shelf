import {
  Link,
  useRouteError
} from "react-router-dom";
import {
  CSSProperties
} from "react";
import {
  Title1,
  Title3,
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
      <Title1>Oh no!</Title1>
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
        <Title3>Back Home!</Title3>
      </Link>
    </div>)
}