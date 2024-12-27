import {
  Card,
  CardFooter,
  CardHeader,
  CardPreview,
  Text,
  tokens
} from "@fluentui/react-components";
import {
  IItemModel
} from "../../OMSWebClient.ts";
import Barcode
  from "react-barcode";

interface ItemCardProps {
  item: IItemModel;
  selected: boolean;
  shownFields: string[];
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, itemId: number) => void;
  onMouseUp: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, itemId: number) => void;
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>, itemId: number) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLDivElement>, itemId: number) => void;
  coverImageUrl?: string;
}

export function ItemCard(props: ItemCardProps) {
  return (<>
    <Card
      style={{
        minWidth: "300px",
        maxWidth: "500px",
        flexGrow: 1,
        background: props.selected ? tokens.colorBrandBackground2 : undefined,
        marginLeft: tokens.spacingHorizontalS,
        marginRight: tokens.spacingHorizontalS,
        marginTop: tokens.spacingVerticalS,
        marginBottom: tokens.spacingVerticalS,
      }}
      onMouseDown={(e) => props.onMouseDown(e, props.item.id!)}
      onMouseUp={(e) => props.onMouseUp(e, props.item.id!)}
      onTouchStart={(e) => props.onTouchStart(e, props.item.id!)}
      onTouchEnd={(e) => props.onTouchEnd(e, props.item.id!)}>
      {props.shownFields.includes("cover") && props.coverImageUrl &&
          <CardPreview>
              <img
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    objectPosition: "center",
                    cursor: "pointer",
                  }}
                  alt={`Cover image of ${props.item.title}`}
                  src={props.coverImageUrl}/>
          </CardPreview>}
      <CardHeader
        header={
          props.shownFields.includes("title") ?
            <Text
              weight="semibold">{props.item.title}</Text> :
            <div/>}
        description={props.shownFields.includes("authors") && props.item.authors && props.item.authors.length > 0 && props.item.authors[0].name !== "" ? `By ${props.item.authors?.map(_ => _.name).join(", ")}` : ""}/>

      {props.shownFields.includes("description") && props.item.description && props.item.description !== "" &&
          <>
              <hr/>
              <p>
                {props.item.description}
              </p>
          </>
      }

      {props.shownFields.includes("format") &&
          <Text
              className={"text-body-secondary"}
              style={{fontSize: "0.7rem"}}>Format: {props.item.format}</Text>}

      {props.shownFields.includes("barcode") && (props.item.barcode ?
        <CardFooter>
          <Barcode
            height={15}
            width={1.3}
            fontSize={12}
            renderer={"svg"}
            background={"#0000"}
            format={props.item.barcode.length == 12 ? "UPC" : "EAN13"}
            value={props.item.barcode}/>
        </CardFooter> :
        <>No barcode available</>)}
    </Card>
  </>);
}