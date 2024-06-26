import {
  SkeletonItem
} from "@fluentui/react-components";
import {
  ShelfCard
} from "./ShelfCard.tsx";
import {
  IShelfModel
} from "../../OMSWebClient.ts";

interface ShelfCardDisplayProps {
  shelves: IShelfModel[];
}

export function ShelfList(props: ShelfCardDisplayProps) {
  return props.shelves == undefined ?
    <SkeletonItem/> :
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}>
      {props.shelves.map(shelf =>
        <ShelfCard
          key={shelf.id}
          shelfId={shelf.id!}/>)}
    </div>;
}