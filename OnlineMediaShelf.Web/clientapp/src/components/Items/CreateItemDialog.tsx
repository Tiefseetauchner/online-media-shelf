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
  Input,
  Textarea,
  useToastController
} from "@fluentui/react-components";
import {
  useEffect,
  useState
} from "react";
import {
  CreateItemModel,
  ItemClient
} from "../../OMSWebClient.ts";
import {
  DialogOpenChangeEventHandler
} from "@fluentui/react-dialog";
import {
  useNavigate
} from "react-router-dom";
import {
  routes
} from "../../utilities/routes.ts";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faBarcode
} from "@fortawesome/free-solid-svg-icons";
import {
  BarcodeReader
} from "../BarcodeReader.tsx";
import {
  uniqueId
} from "lodash";

interface AddItemDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  open: boolean;
}

interface AddItemDialogState {
  title?: string;
  description?: string;
  barcode?: string;
}

interface ErrorState {
  titleMessage?: string;
  descriptionMessage?: string;
  barcodeMessage?: string;
}

export function CreateItemDialog(props: AddItemDialogProps) {
  const [state, setState] = useState<AddItemDialogState>({barcode: ""})
  const [errorState, setErrorState] = useState<ErrorState>({})
  const [barcodeReaderOpen, setBarcodeReaderOpen] = useState(false);

  const barcodeInputFieldId = uniqueId();

  const navigate = useNavigate();

  const {dispatchToast} = useToastController();

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({
      ...state,
      [ev.target.name]: ev.target.value
    });
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const validateForm = (): boolean => {
      let barcodeError: string | undefined = undefined;
      let descriptionError: string | undefined = undefined;
      let titleError: string | undefined = undefined;

      function isValidBarcode(barcode: string) {
        return barcode.split('').reduce(function (p, v, i) {
          return i % 2 == 0 ? p + parseInt(v) : p + 3 * parseInt(v);
        }, 0) % 10 == 0;
      }

      if (state.barcode?.length && state.barcode?.length !== 13)
        barcodeError = "The barcode must be 13 digits long.";
      else if (!isValidBarcode(state.barcode!))
        barcodeError = "The barcode must have a valid check digit.";

      if (state.title === undefined)
        titleError = "The field 'Title' is required.";
      else if (state.title.length > 128)
        titleError = "The title mustn't be longer than 128 characters.";

      if (state.description === undefined)
        descriptionError = "The field 'Description' is required.";
      else if (state.description.length > 512)
        descriptionError = "The description mustn't be longer than 512 characters.";

      setErrorState({
        barcodeMessage: barcodeError,
        descriptionMessage: descriptionError,
        titleMessage: titleError,
      })

      return barcodeError == undefined &&
        descriptionError == undefined &&
        titleError == undefined;
    }

    if (!validateForm())
      return;

    const runCreate = async () => {
      const itemClient = new ItemClient();

      try {
        let result = await itemClient.createItem(new CreateItemModel({
          title: state.title,
          description: state.description,
          barcode: state.barcode
        }))


        navigate(`${routes.item}/${result.id}`)
      } catch (e: any) {
        showErrorToast("An error occurred when creating shelf.", dispatchToast);
      }
    };

    runCreate()
  };

  useEffect(() => {
    if (document.getElementById(barcodeInputFieldId) == null || !state.barcode)
      return;

    (document.getElementById(barcodeInputFieldId) as HTMLInputElement).value = state.barcode;
  }, [state.barcode]);

  return <Dialog
    open={props.open}
    onOpenChange={props.onOpenChange}>
    <DialogSurface
      aria-describedby={undefined}>
      <form
        onSubmit={handleSubmit}>
        <DialogBody>
          <DialogTitle>Create Item</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
            }}>
            <Field
              label="Item Title"
              validationMessage={errorState.titleMessage}>
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"title"}/>
            </Field>
            <Field
              label="Item Description"
              validationMessage={errorState.descriptionMessage}>
              <Textarea
                onChange={handleInput}
                style={{height: "100px"}}
                name={"description"}/>
            </Field>
            <Field
              label="Item Barcode"
              validationMessage={errorState.barcodeMessage}>
              <Input
                id={barcodeInputFieldId}
                value={state.barcode}
                appearance={"underline"}
                onChange={handleInput}
                name={"barcode"}/>
            </Field>
            <Button
              onClick={() => setBarcodeReaderOpen(prev => !prev)}
              icon={
                <FontAwesomeIcon
                  icon={faBarcode}/>}>{barcodeReaderOpen ? "Close" : "Open"} barcode reader</Button>
            <BarcodeReader
              enabled={barcodeReaderOpen}
              style={{display: barcodeReaderOpen ? "block" : "none"}}
              onRead={(barcode) => {
                console.log(barcode);
                setState(prevState => ({
                  ...prevState,
                  barcode: barcode,
                }));

                setTimeout(() => setBarcodeReaderOpen(false), 2000);
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