import {useParams} from "react-router-dom";

export function ShelfView() {
  const {shelfId} = useParams();
  return (<>
    <h1>Shelf View</h1>
    <p>{shelfId}</p>
  </>)
}