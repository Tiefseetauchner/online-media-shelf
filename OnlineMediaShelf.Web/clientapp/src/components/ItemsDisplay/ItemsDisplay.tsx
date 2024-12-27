import {
  IItemModel
} from "../../OMSWebClient.ts";
import {
  ItemList
} from "./ItemList.tsx";
import {
  ItemGrid
} from "./ItemGrid.tsx";

interface ItemsDisplayProps {
  showSelect?: boolean;
  onDelete?: ((itemId: number) => void);
  displayMode: string;
  shownFields: string[];
  items: IItemModel[];
  selectedItemIds: number[];
  showDelete?: boolean;
  onItemSelect: (itemId: number) => void;
  onItemDeselect: (itemId: number) => void;
  onItemsRightClick: (e: React.MouseEvent, itemIds: number[]) => void;
  onItemClick?: (itemId: number) => void;
}

export function ItemsDisplay(props: ItemsDisplayProps) {
  return (
    <>
      {props.displayMode === "list" && (
        <ItemList
          shownFields={props.shownFields}
          items={props.items}
          showSelect={props.showSelect}
          showDelete
          onDelete={props.onDelete}
          selectedItems={props.selectedItemIds}
          onItemSelect={props.onItemSelect}
          onItemDeselect={props.onItemDeselect}
          onItemsRightClick={props.onItemsRightClick}
          onItemClick={props.onItemClick}
        />
      )}
      {props.displayMode === "grid" && (
        <ItemGrid
          shownFields={props.shownFields}
          items={props.items}
          showSelect
          selectedItems={props.selectedItemIds}
          onItemSelect={props.onItemSelect}
          onItemDeselect={props.onItemDeselect}
          onItemsRightClick={props.onItemsRightClick}
          onItemClick={props.onItemClick}
        />
      )}
    </>
  );
}
