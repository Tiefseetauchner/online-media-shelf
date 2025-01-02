import {
  useParams
} from "react-router-dom";
import {
  Title1
} from "@fluentui/react-components";

export function UserView() {
  const {userId} = useParams();

  return (<>
    <Title1>{userId}</Title1>
  </>);
}