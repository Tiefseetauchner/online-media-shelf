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
  useToastController
} from "@fluentui/react-components";
import {
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

interface AddItemDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  open: boolean;
}

interface AddItemDialogState {
  title?: string;
  description?: string;
  barcode?: string;
}

export function CreateItemDialog(props: AddItemDialogProps) {
  const [state, setState] = useState<AddItemDialogState>({})

  const navigate = useNavigate();

  const {dispatchToast} = useToastController();

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [ev.target.name]: ev.target.value
    });
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

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
              label="Item Title">
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"title"}
                required/>
            </Field>
            <Field
              label="Item Description">
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"description"}
                required/>
            </Field>
            <Field
              label="Item Barcode">
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"barcode"}
                required/>
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