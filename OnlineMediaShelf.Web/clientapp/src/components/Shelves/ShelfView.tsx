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
  ItemClient,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Skeleton,
  SkeletonItem,
  Text,
  Title1,
  Title3,
  ToolbarButton,
  ToolbarDivider,
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
  showErrorToast,
  showSuccessToast
} from "../../utilities/toastHelper.tsx";
import {
  faTrash
} from "@fortawesome/free-solid-svg-icons/faTrash";
import {
  Col,
  Row
} from "react-bootstrap";
import {
  ItemToShelfMenu
} from "../ItemToShelfMenu.tsx";
import {
  ItemsDisplay
} from "../Items/ItemsDisplay.tsx";
import {
  ItemsDisplayToolbar
} from "../ItemsDisplayToolbar.tsx";

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
  displaySettings: Record<string, string[]>;
}

export function ShelfView() {
  const {shelfId} = useParams();

  const contextMenuTargetElementRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<ShelfState>({
    isDialogOpen: false,
    selectedItemIds: [],
    couldNotLoadShelfAlready: false,
    displaySettings: {
      displayMode: [localStorage.getItem('displayMode') as "list" | "grid" ?? "list"],
    },
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
      const shelfClient = new ShelfClient();
      const itemClient = new ItemClient();

      try {
        let result = await shelfClient.getShelf(parseInt(shelfId!));

        result.items = await Promise.all(result.items?.map(_ => itemClient.getItem(_.id!)) ?? []);

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
  }, [state.contextMenuOpen, state.selectedItemIds]);

  useEffect(() => {
    localStorage.setItem('displayMode', state.displaySettings.displayMode[0]);

    setState(prevState => ({
      ...prevState,
      displaySettings: {
        ...prevState.displaySettings,
        shownFields: prevState.displaySettings.displayMode[0] === "list" ?
          ["title", "description", "barcode"] :
          ["title", "description", "authors"]
      }
    }));
  }, [state.displaySettings.displayMode]);

  const toolbarChangeValues = (_: any, {
    name,
    checkedItems
  }: {
    name: string,
    checkedItems: string[]
  }) => {
    setState(prevState => ({
      ...prevState,
      displaySettings: {
        ...prevState.displaySettings,
        [name]: checkedItems
      }
    }));
  };

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
              position: "fixed",
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
                        {user.currentUser.userId == state.shelf.user?.userId &&
                            <ItemToShelfMenu
                                currentUsersShelves={state.currentUsersShelves ?? []}
                                shelfId={state.shelf!.id!}
                                shelfAction={async function (shelfId: number) {
                                  const client = new ShelfClient();
                                  await Promise.all<void>(state.contextMenuOpen!.menuItemIds.map(itemId => client.addItem(shelfId, new ItemAddModel({id: itemId}))));
                                  await Promise.all<void>(state.contextMenuOpen!.menuItemIds.map(itemId => client.removeItem(state.shelf!.id!, itemId)));

                                  setUpdateTracker(prev => prev + 1);

                                  showSuccessToast(`${state.contextMenuOpen!.menuItemIds.length > 1 ? `${state.contextMenuOpen!.menuItemIds.length} Items` : "Item"} moved to shelf`, dispatchToast);

                                  setState(prevState => ({
                                    ...prevState,
                                    selectedItemIds: []
                                  }));
                                }}>
                                <MenuItem>Move to Shelf</MenuItem>
                            </ItemToShelfMenu>}
                          <ItemToShelfMenu
                              currentUsersShelves={state.currentUsersShelves ?? []}
                              shelfId={state.shelf!.id!}
                              shelfAction={async function (shelfId: number) {
                                const client = new ShelfClient();
                                await Promise.all<void>(state.contextMenuOpen!.menuItemIds.map(itemId => client.addItem(shelfId, new ItemAddModel({id: itemId}))));

                                showSuccessToast(`${state.contextMenuOpen && state.contextMenuOpen.menuItemIds.length > 1 ? `${state.contextMenuOpen.menuItemIds.length} Items` : "Item"} copied to shelf`, dispatchToast);

                                setState(prevState => ({
                                  ...prevState,
                                  selectedItemIds: []
                                }));
                              }}>
                              <MenuItem>Copy to Shelf</MenuItem>
                          </ItemToShelfMenu>
                      </MenuList>
                  </MenuPopover>
              </Menu>}

          {user?.currentUser && user.currentUser.isLoggedIn && state.selectedItemIds.length > 0 &&
              <Row
                  className="position-fixed bottom-0 end-0 m-0 p-3 w-100 bg-body z-3 shadow"
                  md={"2"}
                  xs={"1"}>
                  <Col
                      className={"m-0 d-flex justify-content-center align-items-center"}>
                      <Title3>{state.selectedItemIds.length} items selected</Title3>
                  </Col>
                  <Col
                      className={"my-2"}>
                    {user.currentUser.userId == state.shelf.user?.userId &&
                        <ItemToShelfMenu
                            currentUsersShelves={state.currentUsersShelves ?? []}
                            shelfId={state.shelf!.id!}
                            shelfAction={async function (shelfId: number) {
                              const client = new ShelfClient();
                              await Promise.all<void>(state.selectedItemIds.map(itemId => client.addItem(shelfId, new ItemAddModel({id: itemId}))));
                              await Promise.all<void>(state.selectedItemIds.map(itemId => client.removeItem(state.shelf!.id!, itemId)));

                              setUpdateTracker(prev => prev + 1);

                              showSuccessToast(`${state.selectedItemIds.length > 1 ? `${state.selectedItemIds.length} Items` : "Item"} moved to shelf`, dispatchToast);

                              setState(prevState => ({
                                ...prevState,
                                selectedItemIds: []
                              }));
                            }}>
                            <Button>Move to Shelf</Button>
                        </ItemToShelfMenu>}
                      <ItemToShelfMenu
                          currentUsersShelves={state.currentUsersShelves ?? []}
                          shelfId={state.shelf!.id!}
                          shelfAction={async function (shelfId: number) {
                            const client = new ShelfClient();
                            await Promise.all<void>(state.selectedItemIds.map(itemId => client.addItem(shelfId, new ItemAddModel({id: itemId}))));

                            showSuccessToast(`${state.selectedItemIds.length > 1 ? `${state.selectedItemIds.length} Items` : "Item"} copied to shelf`, dispatchToast);

                            setState(prevState => ({
                              ...prevState,
                              selectedItemIds: []
                            }));
                          }}>
                          <Button>Copy to Shelf</Button>
                      </ItemToShelfMenu>
                  </Col>
              </Row>}

          <Title1>{state.shelf.user?.userName}{state.shelf.user?.userName?.endsWith("s") ? "'" : "'s"} "{state.shelf.name}" Shelf</Title1>
          <p>{state.shelf.description}</p>


          {state.shelf.items !== undefined && <>
              <ItemsDisplayToolbar
                  checkedValues={state.displaySettings}
                  onCheckedValueChange={toolbarChangeValues}>
                {user?.currentUser?.isLoggedIn && user.currentUser.userId == state.shelf.user?.userId ? <>
                    <ToolbarButton
                      style={{borderRadius: "var(--borderRadiusMedium) 0 0 var(--borderRadiusMedium)"}}
                      icon={
                        <FontAwesomeIcon
                          icon={faPlus}/>}
                      onClick={() => setState({
                        ...state,
                        isDialogOpen: true
                      })}>Add Item to Shelf</ToolbarButton>
                    <Popover>
                      <PopoverTrigger>
                        <ToolbarButton
                          style={{borderRadius: "0 var(--borderRadiusMedium) var(--borderRadiusMedium) 0"}}
                          icon={
                            <FontAwesomeIcon
                              color={"red"}
                              icon={faTrash}/>}/>
                      </PopoverTrigger>

                      <PopoverSurface>
                        <Row>
                          <Text>You are about to delete this shelf permanently! Are you sure?</Text>
                        </Row>
                        <Row>
                          <Button
                            className={"bg-danger text-white"}
                            onClick={deleteShelf}>Confirm</Button>
                        </Row>
                      </PopoverSurface>
                    </Popover>
                    <ToolbarDivider/>
                  </> :
                  <></>}
              </ItemsDisplayToolbar>
              <ItemsDisplay
                  displayMode={state.displaySettings.displayMode[0]}
                  shownFields={state.displaySettings.shownFields ?? ["title", "description", "barcode"]}
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
                  selectedItemIds={state.selectedItemIds}
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
                  }}/>
          </>
          }
        </>
    }

  </>)
}
