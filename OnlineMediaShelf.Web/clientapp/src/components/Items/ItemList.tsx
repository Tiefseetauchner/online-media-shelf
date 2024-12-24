import {
  useNavigate
} from "react-router-dom";
import {
  navigateToItem
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
  showBarcode?: boolean;
  onItemClick?: (itemId: number) => void;
  showSelect?: boolean;
  onItemSelect?: (itemId: number) => void;
  onItemDeselect?: (itemId: number) => void;
  selectedItems?: number[];
}

interface ItemState {
  hoveredItemId?: number;

  [key: number]: {
    holdStarter: number | null;
  };
}

export function ItemList(props: ItemListProps) {
  const holdDelay = 400;
  const showDelete = props.showDelete ?? false;
  const [showBarcode, setShowBarcode] = useState(true);
  const [itemState, setItemState] = useState<ItemState>({});

  const navigate = useNavigate();

  const onItemClick = props.onItemClick == undefined ? (itemId: number) => {
    navigateToItem(itemId, navigate);
  } : props.onItemClick;

  const onItemSelect = props.showSelect && props.onItemSelect ? props.onItemSelect : onItemClick;
  const onItemDeselect = props.showSelect && props.onItemDeselect ? props.onItemDeselect : onItemClick;

  const itemMouseDown = (itemId: number): void => {
    let holdStarter = setTimeout(function () {
      if (!props.selectedItems?.includes(itemId))
        onItemSelect(itemId);
      else
        onItemDeselect(itemId);

      setItemState(prevState => ({
        ...prevState,
        [itemId]: {holdStarter: null}
      }));
    }, holdDelay);

    setItemState(prevState => ({
      ...prevState,
      [itemId]: {holdStarter: holdStarter}
    }));
  }

  const itemMouseUp = (itemId: number): void => {
    setItemState(prevState => {
      if (prevState[itemId].holdStarter) {
        clearTimeout(prevState[itemId].holdStarter);
        onItemClick(itemId);
      }

      return {
        ...prevState,
        [itemId]: {holdStarter: null}
      }
    });
  }

  useEffect(() => {
    if (window.window.innerWidth < 500)
      setShowBarcode(false);
    else
      setShowBarcode(true);
  }, [])

  const columns = [
    props.showSelect ? {
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
    } : undefined,
    {
      columnKey: "title",
      renderHeaderCell: () =>
        <p
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>Title</p>,
      width: "35%"
    },
    {
      columnKey: "description",
      renderHeaderCell: () =>
        <p
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>Description</p>,
      width: "65%"
    },
    showBarcode ? {
        columnKey: "barcode",
        renderHeaderCell: () =>
          <p
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
          </p>,
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
      },
    showDelete ? {
      columnKey: "deleteButton",
      renderHeaderCell: () => <></>,
      width: "32px"
    } : undefined,
  ];

  return (
    <Table
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
            key={item.title}
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
            <TableCell
              onMouseDown={() => itemMouseDown(item.id!)}
              onMouseUp={() => itemMouseUp(item.id!)}
              style={{
                cursor: "pointer",
                lineBreak: "anywhere"
              }}>
              <TableCellLayout>
                {item.title}
              </TableCellLayout>
            </TableCell>
            <TableCell
              onMouseDown={() => itemMouseDown(item.id!)}
              onMouseUp={() => itemMouseUp(item.id!)}
              style={{cursor: "pointer"}}>
              <TableCellLayout
                style={{
                  overflowX: "hidden",
                  textOverflow: "ellipsis",
                  textWrap: "nowrap",
                }}>
                {item.description}
              </TableCellLayout>
            </TableCell>
            {showBarcode ?
              <TableCell
                onMouseDown={() => itemMouseDown(item.id!)}
                onMouseUp={() => itemMouseUp(item.id!)}>
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
              <TableCell/>}
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