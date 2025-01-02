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
  CreateShelfModel,
  EditShelfModel,
  IShelfModel,
  ShelfClient
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

interface AddShelfDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  open: boolean;
  edit?: boolean;
  shelf?: IShelfModel;
}

interface AddShelfDialogState {
  name?: string;
  description?: string;
}

export function AddShelfDialog(props: AddShelfDialogProps) {
  const [state, setState] = useState<AddShelfDialogState>({
    name: props.edit ? props.shelf?.name : "",
    description: props.edit ? props.shelf?.description : ""
  });

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
      const client = new ShelfClient();

      try {
        let result = await client.createShelf(new CreateShelfModel({
          name: state.name,
          description: state.description
        }))

        navigate(routes.shelf(result.id?.toString()!))
      } catch (e: any) {
        showErrorToast("An error occured while creating the shelf", dispatchToast)
      }
    };

    const runEdit = async () => {
      const client = new ShelfClient();

      try {
        await client.editShelf(props.shelf?.id!, new EditShelfModel({
          name: state.name,
          description: state.description
        }))

        window.location.reload();
      } catch (e: any) {
        showErrorToast("An error occured while creating the shelf", dispatchToast)
      }
    };

    if (props.edit) {
      runEdit()
      return;
    }

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
          <DialogTitle>{props.edit ? "Edit Shelf" : "Add Shelf"}</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: "10px",
            }}>
            <Field
              label="Shelf Name">
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"name"}
                value={state.name}
                required/>
            </Field>
            <Field
              label="Shelf Description">
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"description"}
                value={state.description}
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