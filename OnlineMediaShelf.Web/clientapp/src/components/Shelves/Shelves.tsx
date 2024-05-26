import {
  IShelfModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  Button,
  Title1,
  useToastController
} from "@fluentui/react-components";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import {
  UserContext
} from "../../App.tsx";
import {
  AddShelfDialog
} from "./AddShelfDialog.tsx";
import {
  ShelfList
} from "./ShelfList.tsx";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faPlus
} from "@fortawesome/free-solid-svg-icons";

interface ShelvesState {
  shelves?: IShelfModel[];
  isDialogOpen: boolean;
}

export function Shelves() {
  const shelfClient = new ShelfClient();

  const [state, setState] = useState<ShelvesState>({isDialogOpen: false});

  const {user} = useContext(UserContext)

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateShelves() {
      try {
        let shelves = await shelfClient.getAllShelves(null);

        setState({
          ...state,
          shelves: shelves
        })
      } catch (e: any) {
        showErrorToast("An error occured while loading the shelves! Try again later or contact the service owner.", dispatchToast)
      }
    }

    populateShelves();
  }, []);

  return (<>
    <AddShelfDialog
      open={state.isDialogOpen}
      onOpenChange={(_, data) => setState({
        ...state,
        isDialogOpen: data.open
      })}/>

    <Title1>Shelves
      {user?.currentUser?.isLoggedIn ?
        <Button
          style={{float: "right"}}
          icon={
            <FontAwesomeIcon
              icon={faPlus}/>}
          onClick={() => setState({
            ...state,
            isDialogOpen: true
          })}>Create Shelf</Button> :
        <></>}</Title1>

    <ShelfList
      shelves={state.shelves!}/>
  </>)
}