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
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faBarcode
} from "@fortawesome/free-solid-svg-icons";
import {
  Scanner
} from "@caprado/react-barcode-scanner";
import {
  BarcodeFormat
} from "@zxing/library";

interface AddItemToShelfDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  onAddItem: () => void;
  open: boolean;
  shelfId: number;
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

function BarcodeReader(props: {
  onRead: (barcode: string) => void,
  enabled: boolean
}) {
  const [error, setError] = useState("");

  return <>
    <Field
      validationMessage={error}>
      <Scanner
        enabled={props.enabled}
        options={{
          delayBetweenScanSuccess: 100,
        }}
        onResult={(text, result) => result.getBarcodeFormat() === BarcodeFormat.EAN_13 ? props.onRead(text) : setError("This code could not be recognized.")}
        onError={(error) => setError(error?.message)}/>
    </Field>
  </>;
}

export function AddItemToShelfDialog(props: AddItemToShelfDialogProps) {
  const [state, setState] = useState<AddItemToShelfDialogState>({});
  const [barcodeReaderOpen, setBarcodeReaderOpen] = useState(false);

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
                label="Shelf Name">
                <SearchField<IItemModel>
                  fetchSuggestionsDelegate={(query) =>
                    itemClient.searchItem(query, undefined)
                    .then(items => items.map(mapItemToTitleSuggestionResult))}
                  selectionPressed={selection => setState({
                    ...state,
                    itemId: selection.id,
                    barcode: selection.barcode,
                    title: selection.title
                  })}
                  value={state.title ?? ""}/>
              </Field>
              <Field
                label="Shelf Barcode">
                <SearchField<IItemModel>
                  fetchSuggestionsDelegate={(query) =>
                    itemClient.searchItem(undefined, query)
                    .then(items => items.map(mapItemToBarcodeSuggestionResult))}
                  selectionPressed={selection => setState({
                    ...state,
                    itemId: selection.id,
                    barcode: selection.barcode,
                    title: selection.title
                  })}
                  value={state.barcode ?? ""}/>
              </Field>
              <Button
                onClick={() => setBarcodeReaderOpen(prev => !prev)}
                icon={
                  <FontAwesomeIcon
                    icon={faBarcode}/>}>{barcodeReaderOpen ? "Close" : "Open"} barcode reader</Button>
              {barcodeReaderOpen &&
                  <BarcodeReader
                      enabled={barcodeReaderOpen}
                      onRead={(barcode) => {

                        setState(prevState => ({
                          ...prevState,
                          barcode: barcode
                        }));
                        setBarcodeReaderOpen(false);
                      }}/>}
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
    </Dialog>
  </>;
}