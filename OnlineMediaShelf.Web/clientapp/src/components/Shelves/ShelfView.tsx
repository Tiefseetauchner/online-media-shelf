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
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
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
  selectedItemIds: number[];
  contextMenuOpen?: {
    open: boolean;
    x: number;
    y: number;
    menuItemIds: number[];
  };
}

export function ShelfView() {
  const {shelfId} = useParams();

  const contextMenuTargetElementRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<ShelfState>({
    isDialogOpen: false,
    selectedItemIds: []
  });
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

          <div
            ref={contextMenuTargetElementRef}
            style={{
              position: "absolute",
              top: state.contextMenuOpen?.y ?? 0,
              left: state.contextMenuOpen?.x ?? 0,
            }}/>

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
              console.log(state.contextMenuOpen);
            }}>
            <MenuPopover
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              <MenuList>
                <MenuItem>Move To Shelf</MenuItem>
                <MenuItem>Copy to Shelf</MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>

          <Title1>{state.shelf.user?.userName}{state.shelf.user?.userName?.endsWith("s") ? "'" : "'s"} "{state.shelf.name}" Shelf
            {user?.currentUser?.isLoggedIn && user.currentUser.userId == state.shelf.user?.userId ?
              <Button
                style={{float: "right"}}
                icon={
                  <FontAwesomeIcon
                    icon={faPlus}/>}
                onClick={() => setState({
                  ...state,
                  isDialogOpen: true
                })}>Add Item to Shelf</Button> :
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