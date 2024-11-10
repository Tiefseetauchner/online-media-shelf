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
  ItemAddModel,
  ItemClient,
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
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faBarcode
} from "@fortawesome/free-solid-svg-icons";
import {
  BarcodeReader
} from "../BarcodeReader.tsx";

interface AddItemToShelfDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  onAddItem: () => void;
  open: boolean;
  shelfId: number;
  excludedItems: number[];
}

interface AddItemToShelfDialogState {
  itemId?: number;
  title: string;
  barcode: string;
  error?: string;
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
  const [state, setState] = useState<AddItemToShelfDialogState>({
    barcode: "",
    title: "",
  });
  const [barcodeReaderOpen, setBarcodeReaderOpen] = useState(false);

  const itemClient = new ItemClient();

  const {dispatchToast} = useToastController();

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const validateForm = () => {
      if (state.itemId == undefined) {
        setState(prevState => ({
          ...prevState,
          error: "No Item was selected. Please select an item from the list."
        }));

        return false;
      } else if (props.excludedItems.some(value => value === state.itemId)) {
        setState(prevState => ({
          ...prevState,
          error: "The Item is already contained in the shelf."
        }));

        console.log(props.excludedItems, state.itemId);

        return false;
      }

      return true;
    }

    const runCreate = async () => {
      const shelfClient = new ShelfClient();

      try {
        await shelfClient.addItem(props.shelfId, new ItemAddModel({
          id: state.itemId
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

    if (validateForm())
      runCreate()
  };

  return <>
    <Dialog
      open={props.open}
      onOpenChange={(event, data) => {
        props.onOpenChange(event, data);
        setBarcodeReaderOpen(false);
      }}>
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
                label="Name"
                validationMessage={state.error}>
                <SearchField<IItemModel>
                  fetchSuggestionsDelegate={(query) =>
                    itemClient.searchItem(query, undefined, 10, props.excludedItems)
                    .then(items => items.map(mapItemToTitleSuggestionResult))}
                  selectionPressed={selection => setState({
                    ...state,
                    itemId: selection.id,
                    barcode: selection.barcode ?? "",
                    title: selection.title ?? ""
                  })}
                  value={state.title}
                  onInputChange={(value) => setState(prevState => ({
                    ...prevState,
                    title: value
                  }))}/>
              </Field>
              <Field
                label="Barcode">
                <SearchField<IItemModel>
                  fetchSuggestionsDelegate={(query) =>
                    itemClient.searchItem(undefined, query, 10, props.excludedItems)
                    .then(items => items.map(mapItemToBarcodeSuggestionResult))}
                  selectionPressed={selection => setState(prevState => ({
                    ...prevState,
                    itemId: selection.id,
                    barcode: selection.barcode ?? "",
                    title: selection.title ?? ""
                  }))}
                  value={state.barcode}
                  onInputChange={(value) => setState(prevState => ({
                    ...prevState,
                    barcode: value
                  }))}/>
              </Field>
              <Button
                onClick={() => setBarcodeReaderOpen(prev => !prev)}
                icon={
                  <FontAwesomeIcon
                    icon={faBarcode}/>}>{barcodeReaderOpen ? "Close" : "Open"} barcode reader</Button>
              <BarcodeReader
                style={{display: barcodeReaderOpen ? "block" : "none"}}
                enabled={barcodeReaderOpen}
                onRead={(barcode) => {
                  async function getItemFromBarcode() {
                    let item = (await itemClient.searchItem(undefined, barcode, undefined, undefined)).map(mapItemToBarcodeSuggestionResult)

                    setState(prevState => ({
                      ...prevState,
                      barcode: barcode,
                      itemId: item[0].value.id,
                      title: item[0].value.title ?? ""
                    }));

                    setTimeout(() => setBarcodeReaderOpen(false), 200);
                  }

                  getItemFromBarcode();
                }}/>
            </DialogContent>
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
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  </>;
}