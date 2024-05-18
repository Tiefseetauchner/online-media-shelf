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
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  TableCellLayout,
  TableColumnDefinition,
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
  routes
} from "../../routes.ts";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import Barcode
  from "react-barcode";


interface ItemsState {
  items?: IItemModel[];
  isDialogOpen: boolean;
}

const columns: TableColumnDefinition<IItemModel>[] = [
  createTableColumn<IItemModel>({
    columnId: 'title',
    compare: (a, b) => (a.title || '').localeCompare(b.title || ''),
    renderHeaderCell: () => 'Title',
    renderCell: (item) =>
      <TableCellLayout>{item.title}</TableCellLayout>,
  }),
  createTableColumn<IItemModel>({
    columnId: 'description',
    compare: (a, b) => (a.description || '').localeCompare(b.description || ''),
    renderHeaderCell: () => 'Description',
    renderCell: (item) =>
      <TableCellLayout
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          textWrap: "nowrap",
        }}>{item.description}</TableCellLayout>
  }),
  createTableColumn<IItemModel>({
    columnId: 'barcode',
    compare: (a, b) => (a.barcode || '').localeCompare(b.barcode || ''),
    renderHeaderCell: () => 'Barcode',
    renderCell: (item) => <>
      <TableCellLayout>
        <Barcode
          height={15}
          width={1.3}
          fontSize={12}
          renderer={"svg"}
          background={"#0000"}
          format={"EAN13"}
          value={item.barcode!}/>
      </TableCellLayout>
    </>
    ,
  }),
];

export function Items() {
  const [state, setState] = useState<ItemsState>({isDialogOpen: false})

  const {user} = useContext(UserContext);

  const navigate = useNavigate();
  const {dispatchToast} = useToastController();

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

    <h1>Items
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
    </h1>


    {state.items ?
      <DataGrid
        items={state.items}
        columns={columns}
        sortable
        getRowId={(item) => item.id}
        focusMode="composite"
      >
        <DataGridHeader>
          <DataGridRow>
            {({renderHeaderCell}) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<IItemModel>>
          {({
              item,
              rowId
            }) => (
            <DataGridRow<IItemModel>
              onClick={() => navigate(`${routes.item}/${item.id}`)}
              style={{cursor: "pointer"}}
              key={rowId}>
              {({renderCell}) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid> :
      <></>}
  </>;
}