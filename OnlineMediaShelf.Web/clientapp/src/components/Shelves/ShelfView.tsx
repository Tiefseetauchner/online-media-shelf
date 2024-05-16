import {
  useParams
} from "react-router-dom";
import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  IItem,
  IShelfModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  Button,
  createTableColumn,
  DataGrid,
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
  CreateItemDialog
} from "../Items/CreateItemDialog.tsx";

interface ShelfState {
  shelf?: IShelfModel;
  isDialogOpen: boolean;
}

export function ShelfView() {
  const {shelfId} = useParams();

  const [state, setState] = useState<ShelfState>({isDialogOpen: false});

  const {user} = useContext(UserContext);

  useEffect(() => {
    async function populateShelf() {
      const client = new ShelfClient();

      let result = await client.getShelf(parseInt(shelfId!));

      setState({
        ...state,
        shelf: result
      })
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
          <p>
            <SkeletonItem/>
          </p>
        </Skeleton> :
        <>
          <CreateItemDialog
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
              createTableColumn<IItem>({
                columnId: "title",
                compare: (a, b) => a.title.localeCompare(b.title),
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
          </DataGrid>
        </>
    }

  </>)
}