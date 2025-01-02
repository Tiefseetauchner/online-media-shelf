import {
  useNavigate
} from "react-router-dom";
import {
  routes
} from "../../utilities/routes.ts";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow
} from "@fluentui/react-components";
import Barcode
  from "react-barcode";
import {
  IItemModel
} from "../../OMSWebClient.ts";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import {
  useEffect,
  useState
} from "react";

interface ItemListProps {
  items: IItemModel[];
  showDelete?: boolean;
  onDelete?: (itemId: number) => void;
  onItemClick?: (itemId: number) => void;
  showSelect?: boolean;
  onItemSelect?: (itemId: number) => void;
  onItemDeselect?: (itemId: number) => void;
  selectedItems?: number[];
  onItemsRightClick?: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, itemIds: number[]) => void;
  shownFields: string[];
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

export function ItemList(props: ItemListProps) {
  const holdDelay = 400;
  const showDelete = props.showDelete ?? false;
  const [showBarcode, setShowBarcode] = useState(true);
  const [itemState, setItemState] = useState<ItemState>({
    touchStart: {}
  });

  const navigate = useNavigate();

  const onItemClick = props.onItemClick == undefined ? (itemId: number) => {
    navigate(routes.item(itemId.toString()));
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
        window.open(routes.item(itemId.toString()), "_blank");

      return;
    }

    handleButtonUp(itemId);
  }

  const didTouchMoveSignificantly = (e: React.TouchEvent<HTMLTableCellElement>) => {
    const oldX = itemState.touchStart.x ?? 0;
    const oldY = itemState.touchStart.y ?? 0;
    const newX = e.changedTouches[0].clientX;
    const newY = e.changedTouches[0].clientY;

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

  useEffect(() => {
    if (window.window.innerWidth < 500)
      setShowBarcode(false);
    else
      setShowBarcode(true);
  }, []);

  const columns = [];

  if (props.showSelect)
    columns.push({
      columnKey: "selector",
      renderHeaderCell: () =>
        <Checkbox
          checked={props.selectedItems && props.selectedItems.length == 0 ?
            false :
            props.selectedItems?.length == props.items.length ?
              true :
              "mixed"}
          onClick={() => {
            if (props.selectedItems && props.selectedItems.length == 0) {
              props.items.forEach(item => onItemSelect(item.id!));
            } else {
              props.items.forEach(item => onItemDeselect(item.id!));
            }
          }}/>,
      width: "48px"
    });

  if (props.shownFields.includes("title"))
    columns.push({
      columnKey: "title",
      renderHeaderCell: () =>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>Title</div>,
    });

  if (props.shownFields.includes("description"))
    columns.push({
      columnKey: "description",
      renderHeaderCell: () =>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>Description</div>,
    });

  if (props.shownFields.includes("authors"))
    columns.push({
      columnKey: "authors",
      renderHeaderCell: () =>
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>Authors</div>,
    });

  if (props.shownFields.includes("barcode"))
    columns.push(
      showBarcode ? {
          columnKey: "barcode",
          renderHeaderCell: () =>
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              Barcode
              <Button
                icon={
                  <FontAwesomeIcon
                    icon={faChevronRight}/>
                }
                onClick={() => setShowBarcode(false)}
                appearance={"subtle"}/>
            </div>,
          width: "165px"
        } :
        {
          columnKey: "barcode",
          renderHeaderCell: () =>
            <Button
              icon={
                <FontAwesomeIcon
                  icon={faChevronLeft}/>
              }
              onClick={() => setShowBarcode(true)}
              appearance={"subtle"}/>,
          width: "32px"
        });

  if (showDelete)
    columns.push({
      columnKey: "deleteButton",
      renderHeaderCell: () => <></>,
      width: "32px"
    });

  return (
    <Table
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      aria-label={"Items Table"}>
      <TableHeader>
        <TableRow>
          {columns.filter(column => column != undefined).map((column) =>
            <TableHeaderCell
              key={column!.columnKey}
              style={{width: column!.width}}>
              {column!.renderHeaderCell()}
            </TableHeaderCell>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.items?.map(item =>
          <TableRow
            className={props.selectedItems?.includes(item.id!) ? "bg-body-secondary" : ""}
            key={item.id}
            onMouseEnter={() => setItemState(prevState => ({
              ...prevState,
              hoveredItemId: item.id
            }))}
            onMouseLeave={() => setItemState(prevState => ({
              ...prevState,
              hoveredItemId: undefined
            }))}>
            {props.showSelect &&
                <TableCell
                    onClick={() => props.selectedItems!.includes(item.id!) ? onItemDeselect(item.id!) : onItemSelect(item.id!)}>
                  {
                    props.selectedItems && (props.selectedItems.includes(item.id!) || itemState.hoveredItemId == item.id) &&
                      <Checkbox
                          checked={props.selectedItems!.includes(item.id!)}/>
                  }
                </TableCell>
            }
            {props.shownFields.includes("title") &&
                <TableCell
                    onMouseDown={(e) => itemMouseDown(e, item.id!)}
                    onMouseUp={(e) => itemMouseUp(e, item.id!)}
                    onTouchStart={(e) => itemTouchDown(e, item.id!)}
                    onTouchEnd={(e) => itemTouchUp(e, item.id!)}
                    style={{
                      cursor: "pointer",
                      lineBreak: "anywhere"
                    }}>
                    <TableCellLayout>
                      {item.title}
                    </TableCellLayout>
                </TableCell>}
            {props.shownFields.includes("description") &&
                <TableCell
                    onMouseDown={(e) => itemMouseDown(e, item.id!)}
                    onMouseUp={(e) => itemMouseUp(e, item.id!)}
                    onTouchStart={(e) => itemTouchDown(e, item.id!)}
                    onTouchEnd={(e) => itemTouchUp(e, item.id!)}
                    style={{cursor: "pointer"}}>
                    <TableCellLayout
                        style={{
                          overflowX: "hidden",
                          textOverflow: "ellipsis",
                          textWrap: "nowrap",
                        }}>
                      {item.description}
                    </TableCellLayout>
                </TableCell>}
            {props.shownFields.includes("authors") &&
                <TableCell
                    onMouseDown={(e) => itemMouseDown(e, item.id!)}
                    onMouseUp={(e) => itemMouseUp(e, item.id!)}
                    onTouchStart={(e) => itemTouchDown(e, item.id!)}
                    onTouchEnd={(e) => itemTouchUp(e, item.id!)}
                    style={{cursor: "pointer"}}>
                    <TableCellLayout
                        style={{
                          overflowX: "hidden",
                          textOverflow: "ellipsis",
                          textWrap: "nowrap",
                        }}>
                      {item.authors?.map(_ => _.name).join(", ")}
                    </TableCellLayout>
                </TableCell>}
            {props.shownFields.includes("barcode") && (showBarcode ?
              <TableCell
                onMouseDown={(e) => itemMouseDown(e, item.id!)}
                onMouseUp={(e) => itemMouseUp(e, item.id!)}
                onTouchStart={(e) => itemTouchDown(e, item.id!)}
                onTouchEnd={(e) => itemTouchUp(e, item.id!)}>
                <TableCellLayout>
                  {item.barcode ?
                    <Barcode
                      height={15}
                      width={1.3}
                      fontSize={12}
                      renderer={"svg"}
                      background={"#0000"}
                      format={item.barcode.length == 12 ? "UPC" : "EAN13"}
                      value={item.barcode}/> :
                    <>No barcode available</>}
                </TableCellLayout>
              </TableCell> :
              <TableCell/>)}
            {(showDelete && props.onDelete != undefined) &&
                <TableCell>
                    <TableCellLayout>
                        <Button
                            onClick={() => props.onDelete!(item.id!)}
                            icon={
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                color={"red"}/>}/>
                    </TableCellLayout>
                </TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}