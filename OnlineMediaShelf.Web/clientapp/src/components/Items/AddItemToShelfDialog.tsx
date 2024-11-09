import {
  DialogOpenChangeEventHandler
} from "@fluentui/react-dialog";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field
} from "@fluentui/react-components";
import SearchField, {
  SuggestionType
} from "../SearchField.tsx";
import {
  IShelfModel,
  ItemAddModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  useContext,
  useState
} from "react";
import {
  UserContext
} from "../../App.tsx";
import {
  useNavigate
} from "react-router-dom";
import {
  routes
} from "../../utilities/routes.ts";

interface AddItemToShelfDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  open: boolean,
  itemId: number | undefined
}

const mapShelvesToSuggestionType = (shelf: IShelfModel): SuggestionType<IShelfModel> => {
  return {
    name: shelf.name ?? "",
    value: shelf,
  };
};

interface IAddItemToShelfDialogState {
  selectedShelfId?: number;
  selectedShelfTitle: string;
  shelfSelectionError?: string;
}

export function AddItemToShelfDialog(props: AddItemToShelfDialogProps) {
  const [state, setState] = useState<IAddItemToShelfDialogState>({
    selectedShelfTitle: ""
  });

  const shelfClient = new ShelfClient();

  const {user} = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    async function addItemToShelf() {
      if (!props.itemId)
        return;

      if (state.selectedShelfId == undefined) {
        setState(prevState => ({
          ...prevState,
          shelfSelectionError: "No Shelf was selected. Please select an Shelf from the list."
        }));

        return;
      }

      await shelfClient.addItem(state.selectedShelfId, new ItemAddModel({
        id: props.itemId,
      }));

      navigate(`${routes.shelf}/${state.selectedShelfId}`);
    }

    addItemToShelf();
  };

  return <Dialog
    open={props.open}
    onOpenChange={props.onOpenChange}>
    <DialogSurface
      aria-describedby={undefined}>
      <form
        onSubmit={handleSubmit}>
        <DialogBody>
          <DialogTitle>
            Add Item to Shelf
          </DialogTitle>

          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
            }}>
            <Field
              label="Name"
              validationMessage={state.shelfSelectionError}>
              <SearchField<IShelfModel>
                fetchSuggestionsDelegate={(query) =>
                  shelfClient.getAllShelves(user?.currentUser?.userName)
                  .then(shelves =>
                    shelves
                    .filter(_ => _.name?.toLowerCase().includes(query))
                    .map(mapShelvesToSuggestionType))}
                selectionPressed={selection => setState(prevState => ({
                  ...prevState,
                  selectedShelfId: selection.id,
                  selectedShelfTitle: selection.name ?? "",
                }))}
                value={state.selectedShelfTitle}
                onInputChange={(value) => setState(prevState => ({
                  ...prevState,
                  selectedShelfTitle: value
                }))}/>
            </Field>
          </DialogContent>
        </DialogBody>

        <DialogActions>
          <DialogTrigger
            disableButtonEnhancement
            action={"close"}>
            <Button
              appearance="secondary">Cancel</Button>
          </DialogTrigger>
          <Button
            id="SubmitAddItemToShelfButton"
            type="submit"
            appearance="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </DialogSurface>
  </Dialog>;
}