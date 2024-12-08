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
import {
  PaginationControls
} from "../PaginationControls.tsx";

interface ShelvesState {
  shelves?: IShelfModel[];
  shelfCount: number;
  page: number;
  isDialogOpen: boolean;
}

export function Shelves() {
  const shelfClient = new ShelfClient();

  const [state, setState] = useState<ShelvesState>({
    isDialogOpen: false,
    shelfCount: 0,
    page: 0,
  });

  const pageSize = 50;

  const {user} = useContext(UserContext)

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateShelves() {
      try {
        let shelfCount = await shelfClient.getShelfCount();
        let shelves = await shelfClient.getAllShelves(null, state.page, pageSize);

        setState({
          ...state,
          shelves: shelves,
          shelfCount: shelfCount
        })
      } catch (e: any) {
        showErrorToast("An error occured while loading the shelves", dispatchToast)
      }
    }

    populateShelves();
  }, [state.page]);

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


    <PaginationControls
      pageCount={Math.ceil(state.shelfCount / pageSize)}
      page={state.page}
      onPageChange={(newPage) => setState(prevState => ({
        ...prevState,
        page: newPage,
      }))}/>
  </>)
}