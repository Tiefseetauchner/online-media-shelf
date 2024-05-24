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


interface ItemsState {
  items?: IItemModel[];
  isDialogOpen: boolean;
}

export function Items() {
  const [state, setState] = useState<ItemsState>({isDialogOpen: false})

  const {user} = useContext(UserContext);

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateItems() {
      var client = new ItemClient();

      try {
        // TODO (Tiefseetauchner): Paging
        let items = await client.getAllItems();

        setState({
          ...state,
          items: items
        })
      } catch (e: any) {
        showErrorToast("An error occured while loading the items. Please try again later.", dispatchToast)
      }
    }

    populateItems();
  }, []);

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
  </>;
}