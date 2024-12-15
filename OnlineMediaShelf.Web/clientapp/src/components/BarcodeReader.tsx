import {
  CSSProperties,
  useState
} from "react";
import {
  Field
} from "@fluentui/react-components";
import {
  Scanner
} from "@caprado/react-barcode-scanner";
import {
  BarcodeFormat
} from "@zxing/library";

interface BarcodeReaderParams {
  onRead: (barcode: string) => void;
  enabled: boolean;
  style?: CSSProperties;
}

export function BarcodeReader(props: BarcodeReaderParams) {
  const [error, setError] = useState("");

  return <>
    <Field
      style={props.style}
      validationMessage={error}>
      <Scanner
        enabled={props.enabled}
        options={{
          delayBetweenScanSuccess: 500,
        }}
        onResult={(text, result) => [BarcodeFormat.EAN_13, BarcodeFormat.UPC_A].indexOf(result.getBarcodeFormat()) >= 0 ? props.onRead(text) : setError("This code could not be recognized.")}
        onError={(error) => setError(error?.message)}/>
    </Field>
  </>;
}