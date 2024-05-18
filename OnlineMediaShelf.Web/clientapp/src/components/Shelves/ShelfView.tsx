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
  TableCellLayout
} from "@fluentui/react-components";
import {
  UserContext
} from "../../App.tsx";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import {
  AddItemToShelfDialog
} from "./AddItemToShelfDialog.tsx";
import {
  routes
} from "../../routes.ts";

interface ShelfState {
  shelf?: IShelfModel;
  isDialogOpen: boolean;
}

export function ShelfView() {
  const {shelfId} = useParams();

  const [state, setState] = useState<ShelfState>({isDialogOpen: false});

  const {user} = useContext(UserContext);

  const navigate = useNavigate()

  useEffect(() => {
    async function populateShelf() {
      const client = new ShelfClient();

      let result = await client.getShelf(parseInt(shelfId!));

      setState({
        ...state,
        shelf: result
      });

      console.log(result);
    }

    populateShelf();
  }, []);

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
            columns={[
              createTableColumn<IItemModel>({
                columnId: "title",
                compare: (a, b) => a.title!.localeCompare(b.title!),
                renderCell: (item) =>
                  <TableCellLayout>{item.title}</TableCellLayout>,
                renderHeaderCell: () => "Title"
              })
            ]}
            getRowId={(item) => item.id}
            sortable={true}>
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
          </DataGrid>
        </>
    }

  </>)
}