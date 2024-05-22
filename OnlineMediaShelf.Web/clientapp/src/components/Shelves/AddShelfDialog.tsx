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
  useContext,
  useState
} from "react";
import {
  CreateShelfModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  UserContext
} from "../../App.tsx";
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
}

interface AddShelfDialogState {
  name?: string;
  description?: string;

}

export function AddShelfDialog(props: AddShelfDialogProps) {
  const [state, setState] = useState<AddShelfDialogState>({})
  const {user} = useContext(UserContext)

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
          userId: user?.currentUser?.userId,
          name: state.name,
          description: state.description
        }))

        navigate(`${routes.shelf}/${result.id}`)
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
          <DialogTitle>Add Shelf</DialogTitle>
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
                required/>
            </Field>
            <Field
              label="Shelf Description">
              <Input
                appearance={"underline"}
                onChange={handleInput}
                name={"description"}
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