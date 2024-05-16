import {
  useParams
} from "react-router-dom";

export function ItemView() {
  const {itemId} = useParams();
  return <p>Item {itemId}</p>
}

