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
  ItemInputValidator
} from "../../utilities/itemInputValidator.ts";

interface AddItemDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  open: boolean;
  item?: IItemModel;
  update?: boolean;
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
    barcode: "",
    title: "",
    releaseYear: "",
    releaseMonth: "",
    releaseDay: "",
    format: "",
    description: "",
  })
  const [errorState, setErrorState] = useState<ErrorState>({})
  const [barcodeReaderOpen, setBarcodeReaderOpen] = useState(false);

  const navigate = useNavigate();

  const {dispatchToast} = useToastController();

  useEffect(() => {
    if (!(props.open && props.update && props.item))
      return;

    setState(prevState => ({
      ...prevState,
      title: props.item!.title,
      description: props.item!.description,
      barcode: props.item!.barcode,
      authors: props.item!.authors,
      releaseYear: props.item!.releaseDate?.getFullYear().toString(),
      releaseMonth: ((props.item!.releaseDate?.getMonth() ?? 0) + 1).toString(),
      releaseDay: ((props.item!.releaseDate?.getDay() ?? 0) + 1).toString(),
      format: props.item!.format,
    }));
  }, [props.open]);

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setState({
      ...state,
      [ev.target.name]: ev.target.value
    });

  const handleAuthorInput = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState({
      ...state,
      [ev.target.name]: ev.target.value.split(",").map(e => e.trim())
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

        navigate(`${routes.item}/${result.id}`);

        props.onOpenChange(undefined!, {
          open: false,
          type: undefined!,
          event: undefined!
        });
      } catch (e: any) {
        showErrorToast("An error occurred when creating item.", dispatchToast);
      }
    };

    const runUpdate = async () => {
      const itemClient = new ItemClient();

      try {
        const yearInt = parseInt(state.releaseYear ?? "0");
        const monthInt = parseInt(state.releaseMonth ?? "0");
        const dayInt = parseInt(state.releaseDay ?? "1");

        await itemClient.updateItem(new UpdateItemModel({
          id: props.item?.id,
          title: state.title,
          description: state.description,
          barcode: state.barcode,
          releaseDate: new Date(yearInt, monthInt - 1, dayInt),
          authors: state.authors,
          format: state.format,
        }));

        location.reload();
      } catch (e: any) {
        showErrorToast("An error occurred when updating item.", dispatchToast);
      }
    };

    if (props.update)
      runUpdate();
    else
      runCreate();
  };

  return <Dialog
    open={props.open}
    onOpenChange={props.onOpenChange}>
    <DialogSurface
      aria-describedby={undefined}>
      <form
        onSubmit={handleSubmit}>
        <DialogBody>
          <DialogTitle>{props.update ? "Update" : "Create"} Item</DialogTitle>
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
                value={state.title}
                name={"title"}/>
            </Field>
            <Field
              label="Description"
              validationMessage={errorState.descriptionMessage}>
              <Textarea
                onChange={handleInput}
                style={{height: "100px"}}
                value={state.description}
                name={"description"}/>
            </Field>
            <Field
              label="Format"
              validationMessage={errorState.formatMessage}
              hint={"This is the type of media, like DVD, BluRay or Book."}>
              <Input
                appearance={"underline"}
                onChange={handleInput}
                value={state.format}
                name={"format"}/>
            </Field>
            <Field
              label="Author"
              validationMessage={errorState.authorsMessage}>
              <Input
                appearance={"underline"}
                onChange={handleAuthorInput}
                value={state.authors?.join(", ")}
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
                value={state.releaseYear}
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
                value={state.releaseMonth}
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
                value={state.releaseDay}
                name={"releaseDay"}/>
            </Field>
            <Field
              label="Item Barcode"
              validationMessage={errorState.barcodeMessage}>
              <Input
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