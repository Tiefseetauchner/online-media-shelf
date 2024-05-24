import {
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
  Title1,
  useToastController
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
  ItemList
} from "../Items/ItemList.tsx";
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

  const {dispatchToast} = useToastController();

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
          <Title1>
            <SkeletonItem
              style={{width: "250px"}}/>
          </Title1>
          <SkeletonItem/>
        </Skeleton> :
        <>
          <AddItemToShelfDialog
            shelfId={state.shelf.id!}
            open={state.isDialogOpen}
            onAddItem={() => setUpdateTracker(prev => prev + 1)}
            onOpenChange={(_, data) => setState({
              ...state,
              isDialogOpen: data.open
            })}
            excludedItems={state.shelf.items?.map(i => i.id ?? -1) ?? []}/>

          <Title1>{state.shelf.user?.userName}{state.shelf.user?.userName?.endsWith("s") ? "'" : "'s"} "{state.shelf.name}" Shelf</Title1>
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

          {state.shelf.items !== undefined &&
              <ItemList
                  items={state.shelf.items}
                  showDelete
                  onDelete={(itemId) => {
                    async function removeItemFromShelf() {
                      let client = new ShelfClient();

                      if (state.shelf?.id == undefined) {
                        showErrorToast("Shelf could not be accessed", dispatchToast)
                        return;
                      }

                      try {
                        await client.removeItem(state.shelf.id, itemId)

                        setUpdateTracker(prev => prev + 1);
                      } catch {
                        showErrorToast("Could not remove item from shelf.", dispatchToast)
                      }
                    }

                    removeItemFromShelf();
                  }}/>}
        </>
    }
  </>)
}