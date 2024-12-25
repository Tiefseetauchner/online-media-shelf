import {
  IItemModel
} from "../../OMSWebClient.ts";
import {
  useState
} from "react";
import {
  useNavigate
} from "react-router-dom";
import {
  navigateToItem,
  routes
} from "../../utilities/routes.ts";
import {
  ItemCard
} from "./ItemCard.tsx";

interface ItemGridProps {
  items: IItemModel[];
  showDelete?: boolean;
  onDelete?: (itemId: number) => void;
  onItemClick?: (itemId: number) => void;
  showSelect?: boolean;
  onItemSelect?: (itemId: number) => void;
  onItemDeselect?: (itemId: number) => void;
  selectedItems?: number[];
  onItemsRightClick?: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, itemIds: number[]) => void;
}

interface ItemState {
  hoveredItemId?: number;
  touchStart: {
    x?: number;
    y?: number;
  };

  [key: number]: {
    holdStarter: number | null;
    isHeld: boolean;
  };
}

export function ItemGrid(props: ItemGridProps) {
  const holdDelay = 400;
  const [itemState, setItemState] = useState<ItemState>({
    touchStart: {}
  });

  const navigate = useNavigate();

  const onItemClick = props.onItemClick == undefined ? (itemId: number) => {
    navigateToItem(itemId, navigate);
  } : props.onItemClick;

  const onItemSelect = props.showSelect && props.onItemSelect ? props.onItemSelect : onItemClick;
  const onItemDeselect = props.showSelect && props.onItemDeselect ? props.onItemDeselect : onItemClick;

  const handleButtonDown = (itemId: number, shouldSelect: () => boolean): void => {
    if (props.selectedItems && props.selectedItems?.length > 0) {
      return;
    }

    let holdStarter = setTimeout(function () {
      if (shouldSelect()) {
        if (!props.selectedItems?.includes(itemId))
          onItemSelect(itemId);
        else
          onItemDeselect(itemId);
      }

      setItemState(prevState => ({
        ...prevState,
        [itemId]: {
          holdStarter: null,
          isHeld: true
        }
      }));
    }, holdDelay);

    setItemState(prevState => ({
      ...prevState,
      [itemId]: {
        holdStarter: holdStarter,
        isHeld: true
      }
    }));
  };

  const handleButtonUp = (itemId: number): void => {
    if (!itemState[itemId]?.isHeld && props.selectedItems && props.selectedItems?.length > 0) {
      if (!props.selectedItems?.includes(itemId))
        onItemSelect(itemId);
      else
        onItemDeselect(itemId);

      return;
    }

    if (itemState[itemId].holdStarter) {
      clearTimeout(itemState[itemId].holdStarter);
      onItemClick(itemId);
    }

    setItemState(prevState => ({
      ...prevState,
      [itemId]: {
        holdStarter: null,
        isHeld: false
      }
    }));
  };

  const itemMouseDown = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, itemId: number): void => {
    if (e.button != 0) {
      e.preventDefault();
      e.stopPropagation();

      return;
    }

    handleButtonDown(itemId, () => true);
  }

  const itemMouseUp = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, itemId: number): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.button != 0) {
      if (e.button == 2 && props.onItemsRightClick)
        props.onItemsRightClick(e, props.selectedItems && props.selectedItems.includes(itemId) ? props.selectedItems : [itemId]);

      if (e.button == 1)
        window.open(`${routes.item}/${itemId}`, "_blank");

      return;
    }

    handleButtonUp(itemId);
  }

  const didTouchMoveSignificantly = (e: React.TouchEvent<HTMLTableCellElement>) => {
    const oldX = itemState.touchStart.x ?? 0;
    const oldY = itemState.touchStart.y ?? 0;
    const newX = e.changedTouches[0].clientX;
    const newY = e.changedTouches[0].clientY;

    console.log(oldX, newX, oldY, newY);

    return Math.abs(newX - oldX) > 20 || Math.abs(newY - oldY) > 50;
  };

  const itemTouchDown = (e: React.TouchEvent<HTMLTableCellElement>, itemId: number): void => {
    e.preventDefault();
    e.stopPropagation();

    setItemState(prevState => ({
      ...prevState,
      touchStart: {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
    }));

    handleButtonDown(itemId, () => !didTouchMoveSignificantly(e));
  };

  const itemTouchUp = (e: React.TouchEvent<HTMLTableCellElement>, itemId: number): void => {
    e.preventDefault();
    e.stopPropagation();

    if (didTouchMoveSignificantly(e))
      return;

    handleButtonUp(itemId);
  };

  return (<>
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}>
      {props.items.map(item =>
        <ItemCard
          onMouseDown={itemMouseDown}
          onMouseUp={itemMouseUp}
          onTouchStart={itemTouchDown}
          onTouchEnd={itemTouchUp}
          key={item.id}
          item={item}/>)}
    </div>
  </>);
}