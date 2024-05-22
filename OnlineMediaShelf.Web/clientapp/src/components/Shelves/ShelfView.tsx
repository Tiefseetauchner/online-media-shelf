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
  IShelfModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  Button,
  Skeleton,
  SkeletonItem,
  Table,
  TableBody,
  TableCell,
  TableCellLayout,
  TableHeader,
  TableHeaderCell,
  TableRow,
  useToastController
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
import {
  navigateToItem
} from "../../utilities/routes.ts";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";

interface ShelfState {
  shelf?: IShelfModel;
  isDialogOpen: boolean;
}

export function ShelfView() {
  const {shelfId} = useParams();

  const [state, setState] = useState<ShelfState>({isDialogOpen: false});
  const [updateTracker, setUpdateTracker] = useState(0);

  const {user} = useContext(UserContext);

  const navigate = useNavigate()

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
    {
      columnKey: "barcode",
      label: "Barcode",
      width: "165px"
    },
    {
      columnKey: "deleteButton",
      label: "",
      width: "32px"
    },
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
  }, [state.isDialogOpen, updateTracker]);

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

          <Table
            aria-label={"Items Table"}>
            <TableHeader>
              <TableRow>
                {columns.map((column) =>
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
              {state.shelf.items?.map(item =>
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
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <TableCellLayout>
                      <Button
                        onClick={() => {
                          async function removeItemFromShelf() {
                            let client = new ShelfClient();

                            if (state.shelf?.id === undefined)
                              return;

                            try {
                              await client.removeItem(state.shelf.id, item.id)

                              setUpdateTracker(i => i + 1)
                            } catch (e: any) {
                              showErrorToast("Failed to remove item from shelf. Try again later", dispatchToast)
                            }
                          }

                          removeItemFromShelf();
                        }}
                        icon={
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            color={"red"}/>}/>
                    </TableCellLayout>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
    }
  </>)
}