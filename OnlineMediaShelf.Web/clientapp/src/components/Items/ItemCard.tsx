import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Text,
  tokens
} from "@fluentui/react-components";
import {
  IItemModel
} from "../../OMSWebClient.ts";
import {
  routes
} from "../../utilities/routes.ts";
import {
  Link
} from "react-router-dom";

interface ItemCardProps {
  item: IItemModel;
  onMouseDown: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, itemId: number) => void;
  onMouseUp: (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>, itemId: number) => void;
  onTouchStart: (e: React.TouchEvent<HTMLTableCellElement>, itemId: number) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLTableCellElement>, itemId: number) => void;
}

export function ItemCard(props: ItemCardProps) {
  return (<>
    <Card
      style={{
        minWidth: "300px",
        maxWidth: "500px",
        flexGrow: 1,
        marginLeft: tokens.spacingHorizontalS,
        marginRight: tokens.spacingHorizontalS,
        marginTop: tokens.spacingVerticalS,
        marginBottom: tokens.spacingVerticalS,
      }}>
      <CardHeader
        header={
          <Text
            weight="semibold">{props.item.title}</Text>}
        description={props.item.authors && props.item.authors.length > 0 && props.item.authors[0].name !== "" ? `By ${props.item.authors?.map(_ => _.name).join(", ")}` : ""}/>

      {props.item.description && props.item.description !== "" &&
          <>
              <hr/>
              <p>
                {props.item.description}
              </p>
          </>
      }


      <CardFooter>
        <Link
          to={`${routes.item}/${props.item.id}`}>
          <Button>View Item</Button>
        </Link>
      </CardFooter>
    </Card>
  </>);
}