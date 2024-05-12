import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Text,
  tokens
} from "@fluentui/react-components";
import {
  IShelfModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  useEffect,
  useState
} from "react";

interface ShelfCardProps {
  shelfId: number;
}

interface ShelfCardState {
  shelf?: IShelfModel;
}

export function ShelfCard(props: ShelfCardProps) {
  const client = new ShelfClient();

  const [state, setState] = useState<ShelfCardState>({});

  useEffect(() => {
    async function getShelf() {
      try {
        let shelf = await client.getShelf(props.shelfId);

        setState({
          ...state,
          shelf: shelf
        });
      } catch (e: any) {
        alert(e);
      }
    }

    getShelf();
  }, []);

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
            weight="semibold">{state.shelf?.name}</Text>}
        description={
          <Text>By {state.shelf?.user?.userName}</Text>}/>

      <p>
        {state.shelf?.description}
      </p>

      <CardFooter>
        <Button>View Shelf</Button>
      </CardFooter>
    </Card>
  </>);
}