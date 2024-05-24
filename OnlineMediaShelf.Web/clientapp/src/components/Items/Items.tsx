import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  IItemModel,
  ItemClient
} from "../../OMSWebClient.ts";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Title1,
  ToggleButton,
  useToastController
} from "@fluentui/react-components";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import {
  UserContext
} from "../../App.tsx";
import {
  CreateItemDialog
} from "./CreateItemDialog.tsx";
import {
  useNavigate
} from "react-router-dom";
import {
  navigateToItem
} from "../../utilities/routes.ts";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import Barcode
  from "react-barcode";


interface ItemsState {
  items?: IItemModel[];
  isDialogOpen: boolean;
}

export function Items() {
  const [state, setState] = useState<ItemsState>({isDialogOpen: false})
  const [showBarcode, setShowBarcode] = useState(false)

  const {user} = useContext(UserContext);

  const navigate = useNavigate();
  const {dispatchToast} = useToastController();

  const columns = [
    {
      columnKey: "title",
      label: "Title",
      width: "35%"
    },
    {
      columnKey: "description",
      label: "Description",
      width: "65%"
    },
    showBarcode &&
    {
      columnKey: "barcode",
      label: "Barcode",
      width: "165px"
    }
  ];

  useEffect(() => {
    async function populateItems() {
      var client = new ItemClient();

      try {
        // TODO (Tiefseetauchner): Paging
        let items = await client.getAllItems();

        setState({
          ...state,
          items: items
        })
      } catch (e: any) {
        showErrorToast("An error occured while loading the items. Please try again later.", dispatchToast)
      }
    }

    populateItems();
  }, []);

  return <>
    <CreateItemDialog
      open={state.isDialogOpen}
      onOpenChange={(_, data) => setState({
        ...state,
        isDialogOpen: data.open
      })}/>

    <Title1>Items
      {user?.currentUser?.isLoggedIn ?
        <Button
          style={{float: "right"}}
          icon={
            <FontAwesomeIcon
              icon={faPlus}/>}
          onClick={() => setState({
            ...state,
            isDialogOpen: true
          })}>Create Item</Button> :
        <></>}
    </Title1>

    {state.items &&
        <Table
            aria-label={"Items Table"}>
            <TableHeader>
                <TableRow>
                  {columns.filter(c => c != false).map((column) =>
                    <TableHeaderCell
                      key={column.columnKey}
                      style={{
                        width: column.width
                      }}>
                      {column.label}
                    </TableHeaderCell>
                  )}
                </TableRow>
            </TableHeader>
            <TableBody>
              {state.items.map(item =>
                <TableRow
                  key={item.title}>
                  <TableCell
                    onClick={() => navigateToItem(item.id, navigate)}
                    style={{cursor: "pointer"}}>
                    <TableCellLayout>
                      {item.title}
                    </TableCellLayout>
                  </TableCell>
                  <TableCell
                    onClick={() => navigateToItem(item.id, navigate)}
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
                  {
                    showBarcode &&
                      <TableCell>
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
                      </TableCell>
                  }
                </TableRow>
              )}
            </TableBody>
        </Table>}

    <ToggleButton
      onClick={() => setShowBarcode(!showBarcode)}>Display Barcode</ToggleButton>
  </>;
}