import {Toast, ToastBody, ToastTitle} from "@fluentui/react-components";

export function showErrorToast(message: string, dispatchToast: (content: React.ReactNode, options?: (any | undefined)) => void) {
  dispatchToast(
    <Toast>
      <ToastTitle>An Error occured while trying to log in:</ToastTitle>
      <ToastBody>{message}</ToastBody>
    </Toast>,
    {
      intent: "error",
      position: "bottom",
      timeout: 5000
    });
}