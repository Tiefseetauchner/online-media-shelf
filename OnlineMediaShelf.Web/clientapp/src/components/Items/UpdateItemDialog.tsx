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
  IItemModel,
  ItemClient,
  UpdateItemModel
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
import {
  ItemInputValidator
} from "../../utilities/itemInputValidator.ts";

interface AddItemDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  open: boolean;
  id: number;
  item: IItemModel;
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

interface MultiValueInputProps {
  onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function MultiValueInput(props: MultiValueInputProps) {
  const [values, setValues] = useState<string[]>([]);

  return <>
    {values.map((v, i) => {
      <p>{v} at {i}</p>
    })}
  </>;
}

export function UpdateItemDialog(props: AddItemDialogProps) {
  const [state, setState] = useState<AddItemDialogState>({
    authors: [],
    barcode: ""
  })
  const [errorState, setErrorState] = useState<ErrorState>({})
  const [barcodeReaderOpen, setBarcodeReaderOpen] = useState(false);

  const barcodeInputFieldId = uniqueId();
  const titleInputFieldId = uniqueId();
  const authorsInputFieldId = uniqueId();
  const formatInputFieldId = uniqueId();
  const descriptionInputFieldId = uniqueId();
  const releaseDayInputFieldId = uniqueId();
  const releaseMonthInputFieldId = uniqueId();
  const releaseYearInputFieldId = uniqueId();

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
      let barcodeError = ItemInputValidator.validateBarcode(state.barcode);
      let titleError = ItemInputValidator.validateTitle(state.title);
      let descriptionError = ItemInputValidator.validateDescription(state.description);
      let authorsError = ItemInputValidator.validateAuthors(state.authors);
      let formatError = ItemInputValidator.validateFormat(state.format);
      let {
        releaseYearError,
        releaseMonthError,
        releaseDayError
      } = ItemInputValidator.validateDate(state.releaseYear ?? "", state.releaseMonth ?? "", state.releaseDay ?? "");

      setErrorState({
        barcodeMessage: barcodeError,
        titleMessage: titleError,
        descriptionMessage: descriptionError,
        authorsMessage: authorsError,
        releaseYearMessage: releaseYearError,
        releaseMonthMessage: releaseMonthError,
        releaseDayMessage: releaseDayError,
        formatMessage: formatError,
      })

      return barcodeError == undefined &&
        titleError == undefined &&
        descriptionError == undefined &&
        authorsError == undefined &&
        releaseYearError == undefined &&
        releaseMonthError == undefined &&
        releaseDayError == undefined &&
        formatError == undefined;
    }

    if (!validateForm())
      return;

    const runUpdate = async () => {
      const itemClient = new ItemClient();

      try {
        const yearInt = parseInt(state.releaseYear ?? "0");
        const monthInt = parseInt(state.releaseMonth ?? "0");
        const dayInt = parseInt(state.releaseDay ?? "1");

        let result = await itemClient.updateItem(new UpdateItemModel({
          id: props.id,
          title: state.title,
          description: state.description,
          barcode: state.barcode,
          releaseDate: new Date(yearInt, monthInt - 1, dayInt),
          authors: state.authors,
          format: state.format,
        }))


        navigate(`${routes.item}/${result.id}`)
      } catch (e: any) {
        showErrorToast("An error occurred when updating the item.", dispatchToast);
      }
    };

    runUpdate()
  };

  useEffect(() => {
    let titleInputElement = document.getElementById(titleInputFieldId) as HTMLInputElement;
    let barcodeInputElement = document.getElementById(barcodeInputFieldId) as HTMLInputElement;
    let authorsInputElement = document.getElementById(authorsInputFieldId) as HTMLInputElement;
    let formatInputElement = document.getElementById(formatInputFieldId) as HTMLInputElement;
    let descriptionInputElement = document.getElementById(descriptionInputFieldId) as HTMLInputElement;
    let releaseDayInputElement = document.getElementById(releaseDayInputFieldId) as HTMLInputElement;
    let releaseMonthInputElement = document.getElementById(releaseMonthInputFieldId) as HTMLInputElement;
    let releaseYearInputElement = document.getElementById(releaseYearInputFieldId) as HTMLInputElement;

    setState({
      title: props.item.title,
      barcode: props.item.barcode,
      authors: props.item.authors,
      format: props.item.format,
      description: props.item.description,
      releaseDay: props.item.releaseDate?.getDay()?.toString(),
      releaseMonth: props.item.releaseDate?.getMonth()?.toString(),
      releaseYear: props.item.releaseDate?.getFullYear()?.toString(),
    });

    titleInputElement.value = props.item.title ?? "";
    barcodeInputElement.value = props.item.barcode ?? "";
    authorsInputElement.value = (props.item.authors ?? [""])[0] ?? "";
    formatInputElement.value = props.item.format ?? "";
    descriptionInputElement.value = props.item.description ?? "";
    releaseDayInputElement.value = props.item.releaseDate?.getDay()?.toString() ?? "";
    releaseMonthInputElement.value = props.item.releaseDate?.getMonth()?.toString() ?? "";
    releaseYearInputElement.value = props.item.releaseDate?.getFullYear()?.toString() ?? "";
  }, [props.item]);

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
                id={titleInputFieldId}
                appearance={"underline"}
                onChange={handleInput}
                name={"title"}/>
            </Field>
            <Field
              label="Description"
              validationMessage={errorState.descriptionMessage}>
              <Textarea
                id={descriptionInputFieldId}
                onChange={handleInput}
                style={{height: "100px"}}
                name={"description"}/>
            </Field>
            <Field
              label="Format"
              validationMessage={errorState.formatMessage}
              hint={"This is the type of media, like DVD, BluRay or Book."}>
              <Input
                id={formatInputFieldId}
                appearance={"underline"}
                onChange={handleInput}
                name={"format"}/>
            </Field>
            <Field
              label="Author"
              validationMessage={errorState.authorsMessage}>
              <MultiValueInput
                id={authorsInputFieldId}
                appearance={"underline"}
                onChange={handleAuthorInput}
                name={"authors"}/>
            </Field>
            <Field
              label="Release Year"
              validationMessage={errorState.releaseYearMessage}>
              <Input
                id={releaseYearInputFieldId}
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
                id={releaseMonthInputFieldId}
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
                id={releaseDayInputFieldId}
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