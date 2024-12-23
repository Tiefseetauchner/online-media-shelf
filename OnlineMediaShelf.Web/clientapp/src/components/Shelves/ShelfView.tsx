import {
  useParams
} from "react-router-dom";
import {
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import {
  IShelfModel,
  ItemAddModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
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
  showErrorToast,
  showSuccessToast
} from "../../utilities/toastHelper.tsx";
import {
  faTrash
} from "@fortawesome/free-solid-svg-icons/faTrash";

interface ShelfState {
  shelf?: IShelfModel;
  isDialogOpen: boolean;
  selectedItemIds: number[];
  contextMenuOpen?: {
    open: boolean;
    x: number;
    y: number;
    menuItemIds: number[];
  };
  currentUsersShelves?: IShelfModel[];
  couldNotLoadShelfAlready: boolean;
}

export function ShelfView() {
  const {shelfId} = useParams();

  const contextMenuTargetElementRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<ShelfState>({
    isDialogOpen: false,
    selectedItemIds: [],
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

  useEffect(() => {
    async function populateCurrentUsersShelves() {
      const client = new ShelfClient();

      try {
        let shelves = await client.getAllShelves(user?.currentUser?.userName, 0, 0);

        setState(prevState => ({
          ...prevState,
          currentUsersShelves: shelves
        }));
      } catch (e: any) {
        showErrorToast("Couldn't load current users shelves", dispatchToast);
      }
    }

    if (user?.currentUser?.isLoggedIn && !state.currentUsersShelves)
      populateCurrentUsersShelves();
  }, [state.contextMenuOpen]);

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

          <div
            ref={contextMenuTargetElementRef}
            style={{
              position: "absolute",
              top: state.contextMenuOpen?.y ?? 0,
              left: state.contextMenuOpen?.x ?? 0,
            }}/>

          {user?.currentUser?.isLoggedIn &&
              <Menu
                  positioning={{
                    target: contextMenuTargetElementRef.current!,
                    position: "below",
                    align: "start"
                  }}
                  open={state.contextMenuOpen?.open ?? false}
                  onOpenChange={(_, data) => {
                    setState(prevState => ({
                      ...prevState,
                      contextMenuOpen: {
                        open: data.open,
                        x: prevState.contextMenuOpen!.x,
                        y: prevState.contextMenuOpen!.y,
                        menuItemIds: prevState.contextMenuOpen!.menuItemIds
                      }
                    }));
                  }}>
                  <MenuPopover
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}>
                      <MenuList>
                        {user?.currentUser?.isLoggedIn &&
                            <>
                              {user.currentUser.userId == state.shelf.user?.userId &&
                                  <Menu>
                                      <MenuTrigger
                                          disableButtonEnhancement>
                                          <MenuItem>Move to Shelf</MenuItem>
                                      </MenuTrigger>

                                      <MenuPopover>
                                          <MenuList>
                                            {state.currentUsersShelves && state.currentUsersShelves.length > 0 ?
                                              state.currentUsersShelves.filter(_ => _.id !== state.shelf?.id).map(_ =>
                                                <MenuItem
                                                  onClick={() => {
                                                    async function moveToShelf() {
                                                      const client = new ShelfClient();
                                                      await Promise.all<void>(state.contextMenuOpen!.menuItemIds.map(itemId => client.addItem(_.id!, new ItemAddModel({id: itemId}))));
                                                      await Promise.all<void>(state.contextMenuOpen!.menuItemIds.map(itemId => client.removeItem(state.shelf!.id!, itemId)));

                                                      setUpdateTracker(prev => prev + 1);

                                                      showSuccessToast(`${state.contextMenuOpen && state.contextMenuOpen.menuItemIds.length > 1 ? `${state.contextMenuOpen.menuItemIds.length} Items` : "Item"} moved to shelf`, dispatchToast);
                                                    }

                                                    moveToShelf();
                                                  }}>{_.name}</MenuItem>) :
                                              <MenuItem
                                                disabled>No Shelves found</MenuItem>}
                                          </MenuList>
                                      </MenuPopover>
                                  </Menu>}
                                <Menu>
                                    <MenuTrigger
                                        disableButtonEnhancement>
                                        <MenuItem>Copy to Shelf</MenuItem>
                                    </MenuTrigger>

                                    <MenuPopover>
                                        <MenuList>
                                          {state.currentUsersShelves && state.currentUsersShelves.length > 0 ?
                                            state.currentUsersShelves.filter(_ => _.id !== state.shelf?.id).map(_ =>
                                              <MenuItem
                                                onClick={() => {
                                                  async function copyToShelf() {
                                                    const client = new ShelfClient();
                                                    await Promise.all<void>(state.contextMenuOpen!.menuItemIds.map(itemId => client.addItem(_.id!, new ItemAddModel({id: itemId}))));

                                                    showSuccessToast(`${state.contextMenuOpen && state.contextMenuOpen.menuItemIds.length > 1 ? `${state.contextMenuOpen.menuItemIds.length} Items` : "Item"} copied to shelf`, dispatchToast);
                                                  }

                                                  copyToShelf();
                                                }}>{_.name}</MenuItem>) :
                                            <MenuItem
                                              disabled>No Shelves found</MenuItem>}
                                        </MenuList>
                                    </MenuPopover>
                                </Menu>
                            </>}
                      </MenuList>
                  </MenuPopover>
              </Menu>}

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
                  }}
                  showSelect
                  selectedItems={state.selectedItemIds}
                  onItemSelect={(itemId) => {
                    setState(prevState => ({
                      ...prevState,
                      selectedItemIds: prevState.selectedItemIds.concat(itemId)
                    }));
                  }}
                  onItemDeselect={(itemId) => {
                    setState(prevState => ({
                      ...prevState,
                      selectedItemIds: prevState.selectedItemIds.filter(i => i !== itemId)
                    }));
                  }}
                  onItemsRightClick={(e, itemIds) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (itemIds.length == 0) {
                      return;
                    }

                    setState(prevState => ({
                      ...prevState,
                      contextMenuOpen: {
                        open: true,
                        x: e.clientX,
                        y: e.clientY,
                        menuItemIds: itemIds
                      },
                    }));
                  }}
              />}
        </>
    }
  </>)
}