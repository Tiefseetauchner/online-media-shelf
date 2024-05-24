import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  useToastController
} from "@fluentui/react-components";
import {
  useState
} from "react";
import {
  IItemModel,
  ItemClient,
  ItemModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  DialogOpenChangeEventHandler
} from "@fluentui/react-dialog";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import SearchField, {
  SuggestionType
} from "../SearchField.tsx";

interface AddItemToShelfDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  onAddItem: () => void;
  open: boolean;
  shelfId: number;
  excludedItems: number[];
}

interface AddItemToShelfDialogState {
  title?: string;
  barcode?: string;
  itemId?: number;
}

function mapItemToTitleSuggestionResult(item: IItemModel): SuggestionType<IItemModel> {
  return {
    name: item.title ?? "",
    value: item
  };
}

function mapItemToBarcodeSuggestionResult(item: IItemModel): SuggestionType<IItemModel> {
  return {
    name: item.barcode ?? "",
    value: item
  };
}

export function AddItemToShelfDialog(props: AddItemToShelfDialogProps) {
  const [state, setState] = useState<AddItemToShelfDialogState>({})

  const itemClient = new ItemClient();

  const {dispatchToast} = useToastController();

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const runCreate = async () => {
      const client = new ShelfClient();

      try {
        await client.addItem(props.shelfId, new ItemModel({
          id: state.itemId,
          barcode: state.barcode
        }))

        props.onOpenChange(null!, {
          open: false,
          type: "triggerClick",
          event: null!
        });

        props.onAddItem();
      } catch (e: any) {
        showErrorToast("An error occurred when adding item to shelf.", dispatchToast);
      }
    };

    runCreate()
  };

  return <Dialog
    open={props.open}
    onOpenChange={props.onOpenChange}>
    <DialogSurface
      aria-describedby={undefined}>
      <form
        onSubmit={handleSubmit}>
        <DialogBody>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
            }}>
            <Field
              label="Name">
              <SearchField<IItemModel>
                fetchSuggestionsDelegate={(query) =>
                  itemClient.searchItem(query, undefined, 10, props.excludedItems)
                  .then(items => items.map(mapItemToTitleSuggestionResult))}
                selectionPressed={selection => setState({
                  ...state,
                  itemId: selection.id
                })}/>
            </Field>
            <Field
              label="Barcode">
              <SearchField<IItemModel>
                fetchSuggestionsDelegate={(query) =>
                  itemClient.searchItem(undefined, query, 10, props.excludedItems)
                  .then(items => items.map(mapItemToBarcodeSuggestionResult))}
                selectionPressed={selection => setState({
                  ...state,
                  itemId: selection.id
                })}/>
            </Field>
          </DialogContent>
          <DialogActions>
            <DialogTrigger
              disableButtonEnhancement
              action={"close"}>
              <Button
                appearance="secondary">Cancel</Button>
            </DialogTrigger>
            <Button
              type="submit"
              appearance="primary">
              Submit
            </Button>
          </DialogActions>
        </DialogBody>
      </form>
    </DialogSurface>
  </Dialog>;
}