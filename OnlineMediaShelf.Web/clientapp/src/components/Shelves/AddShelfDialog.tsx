import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
  Label
} from "@fluentui/react-components";

interface AddShelfDialogProps {
  open: boolean;
}

export function AddShelfDialog(props: AddShelfDialogProps) {
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    alert("form submitted!");
  };

  return <Dialog open={props.open}>
    <DialogSurface aria-describedby={undefined}>
      <form onSubmit={handleSubmit}>
        <DialogBody>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogContent style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "10px",
          }}>
            <Label required htmlFor={"email-input"}>
              Email input
            </Label>
            <Input required type="email" id={"email-input"}/>
            <Label required htmlFor={"password-input"}>
              Password input
            </Label>
            <Input required type="password" id={"password-input"}/>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">Close</Button>
            </DialogTrigger>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </DialogActions>
        </DialogBody>
      </form>
    </DialogSurface>
  </Dialog>;
}