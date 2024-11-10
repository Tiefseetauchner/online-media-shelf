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
  Title1,
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
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import {
  ItemList
} from "./ItemList.tsx";
import {
  PaginationControls
} from "../PaginationControls.tsx";


interface ItemsState {
  items?: IItemModel[];
  itemCount: number;
  page: number;
  isDialogOpen: boolean;
}

export function Items() {
  const [state, setState] = useState<ItemsState>({
    isDialogOpen: false,
    itemCount: 0,
    page: 0,
  });

  const pageSize = 30;

  const {user} = useContext(UserContext);

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateItems() {
      const client = new ItemClient();

      try {
        let itemCount = await client.getItemCount();
        let items = await client.getItems(pageSize, state.page);

        setState({
          ...state,
          items: items,
          itemCount: itemCount
        })
      } catch (e: any) {
        showErrorToast("An error occured while loading the items. Please try again later.", dispatchToast)
      }
    }

    populateItems();
  }, [state.page]);

  return <>
    <CreateItemDialog
      open={state.isDialogOpen}
      onOpenChange={(_, data) => setState({
        ...state,
        isDialogOpen: data.open
      })}/>

    <Title1>Items
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
    </Title1>

    {state.items !== undefined &&
        <ItemList
            items={state.items}/>}

    <PaginationControls
      pageCount={Math.ceil(state.itemCount / pageSize)}
      page={state.page}
      onPageChange={(newPage) => setState(prevState => ({
        ...prevState,
        page: newPage,
      }))}/>
  </>;
}