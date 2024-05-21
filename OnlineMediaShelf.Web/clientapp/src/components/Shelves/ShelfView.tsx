import {
  useNavigate,
  useParams
} from "react-router-dom";
import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  IItemModel,
  IShelfModel,
  ShelfClient
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
  Skeleton,
  SkeletonItem,
  TableCellLayout,
  TableColumnDefinition
} from "@fluentui/react-components";
import {
  UserContext
} from "../../App.tsx";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import {
  AddItemToShelfDialog
} from "./AddItemToShelfDialog.tsx";
import Barcode
  from "react-barcode";

interface ShelfState {
  shelf?: IShelfModel;
  isDialogOpen: boolean;
}

export function ShelfView() {
  const {shelfId} = useParams();

  const [state, setState] = useState<ShelfState>({isDialogOpen: false});

  const {user} = useContext(UserContext);

  const navigate = useNavigate()

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
    createTableColumn<IItemModel>({
      columnId: 'deleteButton',
      compare: (a, b) => (a.barcode || '').localeCompare(b.barcode || ''),
      renderCell: (item) => <>
        <TableCellLayout>
          <Button
            onClick={() => {
              async function removeItemFromShelf(shelfId: string, itemId: number) {
                console.log("aaa");
              }

              removeItemFromShelf(shelfId!, item.id!);
            }}
            icon={
              <FontAwesomeIcon
                icon={faTrashCan}
                color={"red"}/>}/>
        </TableCellLayout>
      </>
      ,
    }),
  ];

  useEffect(() => {
    async function populateShelf() {
      const client = new ShelfClient();

      let result = await client.getShelf(parseInt(shelfId!));

      setState({
        ...state,
        shelf: result
      });
    }

    populateShelf();
  }, [state.isDialogOpen]);

  return (<>
    {
      state.shelf == undefined ?
        <Skeleton>
          <h1>
            <SkeletonItem
              style={{width: "250px"}}/>
          </h1>
          <SkeletonItem/>
        </Skeleton> :
        <>
          <AddItemToShelfDialog
            shelfId={state.shelf.id!}
            open={state.isDialogOpen}
            onOpenChange={(_, data) => setState({
              ...state,
              isDialogOpen: data.open
            })}/>

          <h1>{state.shelf.user?.userName}{state.shelf.user?.userName?.endsWith("s") ? "'" : "'s"} "{state.shelf.name}" Shelf</h1>
          <p>{state.shelf.description}</p>

          {user?.currentUser?.isLoggedIn && user.currentUser.userId == state.shelf.user?.userId ?
            <Button
              icon={
                <FontAwesomeIcon
                  icon={faPlus}/>}
              onClick={() => setState({
                ...state,
                isDialogOpen: true
              })}>Add item to shelf</Button> : <></>}

          <DataGrid
            items={state.shelf.items!}
            columns={columns}
            getRowId={(item) => item.id}
            sortable={true}
            selectionMode={"single"}
            subtleSelection
            selectionAppearance={"neutral"}>
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
                  style={{cursor: "pointer"}}
                  key={rowId}
                  selectionCell={null}>
                  {({renderCell}) => (
                    <DataGridCell>{renderCell(item)}</DataGridCell>
                  )}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
        </>
    }

  </>)
}