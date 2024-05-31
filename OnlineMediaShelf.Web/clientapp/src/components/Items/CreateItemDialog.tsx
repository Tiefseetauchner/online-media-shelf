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
  authors?: string[];
  releaseYear?: string;
  releaseMonth?: string;
  releaseDay?: string;
  format?: string
}

interface ErrorState {
  titleMessage?: string;
  descriptionMessage?: string;
  barcodeMessage?: string;
  authorsMessage?: string;
  releaseYearMessage?: string;
  releaseMonthMessage?: string;
  releaseDayMessage?: string;
  formatMessage?: string;
}

export function CreateItemDialog(props: AddItemDialogProps) {
  const [state, setState] = useState<AddItemDialogState>({
    authors: [],
    barcode: ""
  })
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

  const handleAuthorInput = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({
      ...state,
      [ev.target.name]: [ev.target.value]
    });
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    const validateForm = (): boolean => {
      let barcodeError: string | undefined = undefined;
      let descriptionError: string | undefined = undefined;
      let titleError: string | undefined = undefined;
      let authorsError: string | undefined = undefined;
      let releaseYearError: string | undefined = undefined;
      let releaseMonthError: string | undefined = undefined;
      let releaseDayError: string | undefined = undefined;
      let formatError: string | undefined = undefined;

      function isValidBarcode(barcode: string) {
        return barcode.split('').reduce(function (p, v, i) {
          return i % 2 == 0 ? p + parseInt(v) : p + 3 * parseInt(v);
        }, 0) % 10 == 0;
      }

      if (state.barcode?.length !== 13)
        barcodeError = "The barcode must be 13 digits long.";
      else if (!isValidBarcode(state.barcode!))
        barcodeError = "The barcode must have a valid check digit.";

      if (state.title === undefined)
        titleError = "The field 'Title' is required.";
      else if (state.title.length > 128)
        titleError = "The title mustn't be longer than 128 characters.";

      if (state.description === undefined)
        descriptionError = "The field 'Description' is required.";
      else if (state.description.length > 2048)
        descriptionError = "The description mustn't be longer than 2048 characters.";

      if (state.authors?.some(author => author.length > 64))
        authorsError = "No author may be longer than 64 characters.";

      if (state.format?.length === undefined)
        formatError = "The field 'Format' is required.";
      else if (state.format?.length > 20)
        formatError = "The format mustn't be longer than 20 characters.";

      const yearInt = parseInt(state.releaseYear ?? "0");
      const monthInt = parseInt(state.releaseMonth ?? "0");
      const dayInt = parseInt(state.releaseDay ?? "0");

      if (!state.releaseMonth && (state.releaseDay)) releaseMonthError = "Month is required.";
      if (!state.releaseYear && (state.releaseMonth || state.releaseYear)) releaseYearError = "Year is required.";

      if (state.releaseYear && (isNaN(yearInt) || yearInt < 1)) releaseYearError = "Invalid year.";
      if (state.releaseMonth && (isNaN(monthInt) || monthInt < 1 || monthInt > 12)) releaseMonthError = "Invalid month.";
      if (state.releaseDay && (isNaN(dayInt) || dayInt < 1 || dayInt > 31)) releaseDayError = "Invalid day.";

      if (yearInt && monthInt && dayInt) {
        const date = new Date(yearInt, monthInt - 1, dayInt);
        if (date.getFullYear() !== yearInt || date.getMonth() !== monthInt - 1 || date.getDate() !== dayInt) {
          releaseYearError = releaseMonthError = releaseDayError = "Invalid date.";
        }
      }

      setErrorState({
        barcodeMessage: barcodeError,
        descriptionMessage: descriptionError,
        titleMessage: titleError,
        authorsMessage: authorsError,
        releaseYearMessage: releaseYearError,
        releaseMonthMessage: releaseMonthError,
        releaseDayMessage: releaseDayError,
        formatMessage: formatError,
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
        const yearInt = parseInt(state.releaseYear ?? "0");
        const monthInt = parseInt(state.releaseMonth ?? "0");
        const dayInt = parseInt(state.releaseDay ?? "1");

        let result = await itemClient.createItem(new CreateItemModel({
          title: state.title,
          description: state.description,
          barcode: state.barcode,
          releaseDate: new Date(yearInt, monthInt - 1, dayInt),
          authors: state.authors,
          format: state.format,
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
              label="Title"
              validationMessage={errorState.titleMessage}>
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"title"}/>
            </Field>
            <Field
              label="Description"
              validationMessage={errorState.descriptionMessage}>
              <Textarea
                onChange={handleInput}
                style={{height: "100px"}}
                name={"description"}/>
            </Field>
            <Field
              label="Format"
              validationMessage={errorState.formatMessage}
              hint={"This is the type of media, like DVD, BluRay or Book."}>
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"format"}/>
            </Field>
            <Field
              label="Author"
              validationMessage={errorState.authorsMessage}>
              <Input
                appearance={"underline"}
                onChange={handleAuthorInput}
                name={"authors"}/>
            </Field>
            <Field
              label="Release Year"
              validationMessage={errorState.releaseYearMessage}>
              <Input
                appearance={"underline"}
                type={"number"}
                max={new Date().getFullYear()}
                placeholder={new Date().getFullYear().toString()}
                onChange={handleInput}
                name={"releaseYear"}/>
            </Field>
            <Field
              label="Release Month"
              validationMessage={errorState.releaseMonthMessage}>
              <Input
                appearance={"underline"}
                type={"number"}
                max={12}
                min={1}
                placeholder={new Date().getMonth().toString()}
                onChange={handleInput}
                name={"releaseMonth"}/>
            </Field>
            <Field
              label="Release Day"
              validationMessage={errorState.releaseDayMessage}>
              <Input
                appearance={"underline"}
                type={"number"}
                max={31}
                min={1}
                placeholder={new Date().getDate().toString()}
                onChange={handleInput}
                name={"releaseDay"}/>
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