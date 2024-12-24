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
import {
  faTrash
} from "@fortawesome/free-solid-svg-icons/faTrash";

interface ShelfState {
  shelf?: IShelfModel;
  isDialogOpen: boolean;
  couldNotLoadShelfAlready: boolean;
}

export function ShelfView() {
  const {shelfId} = useParams();

  const [state, setState] = useState<ShelfState>({
    isDialogOpen: false,
    couldNotLoadShelfAlready: false
  });
  const [updateTracker, setUpdateTracker] = useState(0);

  const {user} = useContext(UserContext);

  const {dispatchToast} = useToastController();

  const deleteShelf = async () => {
    const client = new ShelfClient();

    try {
      await client.deleteShelf(parseInt(shelfId!))

      history.back();
    } catch (e: any) {
      showErrorToast("Unable to delete shelf: " + JSON.parse(e.response).title, dispatchToast);
    }
  }

  useEffect(() => {
    async function populateShelf() {
      const client = new ShelfClient();

      try {
        let result = await client.getShelf(parseInt(shelfId!));

        setState(prevState => ({
          ...prevState,
          shelf: result
        }));
      } catch (e: any) {
        if (state.couldNotLoadShelfAlready)
          return;

        showErrorToast("Unable to load shelf: " + JSON.parse(e.response).title, dispatchToast);

        setState(prevState => ({
          ...prevState,
          couldNotLoadShelfAlready: true
        }));
      }
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

          <Title1>{state.shelf.user?.userName}{state.shelf.user?.userName?.endsWith("s") ? "'" : "'s"} "{state.shelf.name}" Shelf
            {user?.currentUser?.isLoggedIn && user.currentUser.userId == state.shelf.user?.userId ?
              <div
                style={{float: "right"}}>
                <Button
                  icon={
                    <FontAwesomeIcon
                      icon={faPlus}/>}
                  onClick={() => setState({
                    ...state,
                    isDialogOpen: true
                  })}>Add Item to Shelf</Button>
                <Button
                  icon={
                    <FontAwesomeIcon
                      color={"red"}
                      icon={faTrash}/>}
                  onClick={deleteShelf}/>
              </div> :
              <></>}</Title1>
          <p>{state.shelf.description}</p>

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
                        showErrorToast("Could not remove item from shelf", dispatchToast)
                      }
                    }

                    removeItemFromShelf();
                  }}/>}
        </>
    }
  </>)
}