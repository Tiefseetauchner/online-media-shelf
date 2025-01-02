import {
  IShelfModel,
  IUserModel,
  ShelfClient,
  UserClient
} from "../../OMSWebClient.ts";
import {
  useContext,
  useEffect,
  useState
} from "react";
import {
  Input,
  InputOnChangeData,
  Title1,
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
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
import {
  debounce
} from "lodash";
import SearchField, {
  SuggestionType
} from "../SearchField.tsx";

interface ShelvesState {
  userNameSearch: string;
  shelves?: IShelfModel[];
  shelfCount: number;
  page: number;
  isDialogOpen: boolean;
  shelfNameSearch?: string;
}

function mapToSuggestionResult(userModel: IUserModel): SuggestionType<IUserModel> {
  return {
    name: userModel.userName ?? "",
    value: userModel
  };
}

export function Shelves() {
  const shelfClient = new ShelfClient();
  const userClient = new UserClient();

  const [state, setState] = useState<ShelvesState>({
    isDialogOpen: false,
    shelfCount: 0,
    page: 0,
    userNameSearch: "",
  });

  const pageSize = 50;

  const {user} = useContext(UserContext)

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateShelves() {
      try {
        let shelfCount = await shelfClient.getShelfCount();
        let shelves;
        if (state.shelfNameSearch || state.userNameSearch)
          shelves = await shelfClient.searchShelvesPaged(state.userNameSearch, state.shelfNameSearch, state.page, pageSize)
        else
          shelves = await shelfClient.getAllShelves(null, state.page, pageSize);

        setState(prevState => ({
          ...prevState,
          shelves: shelves,
          shelfCount: shelfCount
        }));
      } catch (e: any) {
        showErrorToast("An error occured while loading the shelves", dispatchToast)
      }
    }

    populateShelves();
  }, [state.page, state.shelfNameSearch, state.userNameSearch]);

  return (<>
    <AddShelfDialog
      open={state.isDialogOpen}
      onOpenChange={(_, data) => setState({
        ...state,
        isDialogOpen: data.open
      })}/>

    <Title1>Shelves</Title1>
    value
    <Toolbar>
      {user?.currentUser?.isLoggedIn ?
        <ToolbarButton
          style={{float: "right"}}
          icon={
            <FontAwesomeIcon
              icon={faPlus}/>}
          onClick={() => setState({
            ...state,
            isDialogOpen: true
          })}>Create Shelf</ToolbarButton> :
        <></>}
      <ToolbarDivider/>
      <Input
        className={"mx-1"}
        placeholder={"Shelf name"}
        onChange={debounce((_, data: InputOnChangeData) => setState(prevState => ({
          ...prevState,
          shelfNameSearch: data.value
        })), 100)}/>
      <SearchField<IUserModel>
        placeholder={"User name"}
        fetchSuggestionsDelegate={(query) =>
          userClient.findUsers(query).then(result => result.map(mapToSuggestionResult))
        }
        selectionPressed={selection => setState(prevState => ({
          ...prevState,
          userNameSearch: selection.userName ?? "",
        }))}
        value={state.userNameSearch}
        onInputChange={(value) => setState(prevState => ({
          ...prevState,
          userNameSearch: value
        }))}/>
    </Toolbar>

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