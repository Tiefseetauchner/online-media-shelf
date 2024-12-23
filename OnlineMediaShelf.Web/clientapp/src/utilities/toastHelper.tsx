import {
  Toast,
  ToastBody,
  ToastTitle
} from "@fluentui/react-components";

export function showErrorToast(message: string, dispatchToast: (content: React.ReactNode, options?: (any | undefined)) => void) {
  dispatchToast(
    <Toast>
      <ToastTitle>An Error occured:</ToastTitle>
      <ToastBody>{message}! Try again later or contact the service owner.</ToastBody>
    </Toast>,
    {
      intent: "error",
      position: "bottom",
      timeout: 5000
    });
}

export function showSuccessToast(message: string, dispatchToast: (content: React.ReactNode, options?: (any | undefined)) => void) {
  dispatchToast(
    <Toast>
      <ToastTitle>{message}</ToastTitle>
    </Toast>,
    {
      intent: "success",
      position: "bottom",
      timeout: 5000
    });
}