import {
  useNavigate
} from "react-router-dom";
import {
  navigateToItem
} from "../../utilities/routes.ts";
import {
  Button,
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
  onItemClick?: (itemId: number) => void | undefined;
}

export function ItemList(props: ItemListProps) {
  const showDelete = props.showDelete ?? false;
  const [showBarcode, setShowBarcode] = useState(true);

  const navigate = useNavigate();

  const onItemClick = props.onItemClick == undefined ? (itemId: number) => {
    navigateToItem(itemId, navigate);
  } : props.onItemClick;

  useEffect(() => {
    if (window.window.innerWidth < 500)
      setShowBarcode(false);
    else
      setShowBarcode(true);
  }, [])

  const columns = [
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
            key={item.title}>
            <TableCell
              onClick={() => onItemClick(item.id!)}
              style={{
                cursor: "pointer",
                lineBreak: "anywhere"
              }}>
              <TableCellLayout>
                {item.title}
              </TableCellLayout>
            </TableCell>
            <TableCell
              onClick={() => onItemClick(item.id!)}
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
                onClick={() => onItemClick(item.id!)}>
                <TableCellLayout>
                  {item.barcode ?
                    <Barcode
                      height={15}
                      width={1.3}
                      fontSize={12}
                      renderer={"svg"}
                      background={"#0000"}
                      format={"EAN13"}
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