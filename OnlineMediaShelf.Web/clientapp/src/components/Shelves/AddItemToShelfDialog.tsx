import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Field,
  Title1,
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
  BarcodeScanner
} from "@thewirv/react-barcode-scanner";

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
  onRead: (barcode: string) => void
}) {
  return <>
    <Card
      style={{
        display: "block",
        background: "#ffffff",
        zIndex: 1000,
      }}>
      <Title1>Scan Barcode</Title1>
      <BarcodeScanner
        onSuccess={(text: string) => console.log(text)}
        onError={(error: Error) => {
          if (error) {
            console.error(error.message);
          }
        }}
        onLoad={() => console.log('Video feed has loaded!')}
        containerStyle={{width: '100%'}}
      />
    </Card>
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
                    itemId: selection.id
                  })}/>
              </Field>
              <Field
                label="Shelf Barcode">
                <SearchField<IItemModel>
                  fetchSuggestionsDelegate={(query) =>
                    itemClient.searchItem(undefined, query)
                    .then(items => items.map(mapItemToBarcodeSuggestionResult))}
                  selectionPressed={selection => setState({
                    ...state,
                    itemId: selection.id
                  })}/>
              </Field>
              <Button
                onClick={() => setBarcodeReaderOpen(prev => !prev)}
                icon={
                  <FontAwesomeIcon
                    icon={faBarcode}/>}>{barcodeReaderOpen ? "Open" : "Close"} barcode reader</Button>
              {barcodeReaderOpen &&
                  <BarcodeReader
                      onRead={(barcode) => setState(prevState => ({
                        ...prevState,
                        barcode: barcode
                      }))}/>}
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
  </>
    ;
}