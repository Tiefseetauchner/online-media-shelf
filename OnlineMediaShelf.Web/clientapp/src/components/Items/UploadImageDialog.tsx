import {
  DialogOpenChangeEventHandler
} from "@fluentui/react-dialog";
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
  useRef
} from "react";
import {
  ItemClient
} from "../../OMSWebClient.ts";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";

interface UploadImageDialogProps {
  onOpenChange: DialogOpenChangeEventHandler;
  open: boolean;
  itemId: number | undefined;
}

export function UploadImageDialog(props: UploadImageDialogProps) {
  const inputField = useRef<HTMLInputElement>(null);

  const {dispatchToast} = useToastController();

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    async function uploadImage() {
      if (!props.itemId || !inputField.current?.files)
        return;

      let fileData = inputField.current?.files[0];

      console.log(fileData);

      if (!fileData) {
        showErrorToast("The file upload failed. Please try again.", dispatchToast);
        return;
      }

      const client = new ItemClient();
      await client.updateItemCoverImage(props.itemId, fileData);

      location.reload();
    }

    uploadImage();
  };

  return (
    <Dialog
      open={props.open}
      onOpenChange={props.onOpenChange}>
      <DialogSurface
        aria-describedby={undefined}>
        <form
          onSubmit={onSubmit}>
          <DialogBody>
            <DialogTitle>Upload new cover image</DialogTitle>
            <DialogContent
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "10px",
              }}>
              <Field>
                <input
                  ref={inputField}
                  id="coverImage"
                  name="coverImage"
                  type={"file"}
                  className={"form-control"}
                  accept="image/png, image/jpeg"/>
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
    </Dialog>
  );
}