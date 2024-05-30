import {
  useParams
} from "react-router-dom";
import {
  useEffect,
  useState
} from "react";
import {
  IItemModel,
  ItemClient
} from "../../OMSWebClient.ts";

import {
  Button,
  useToastController
} from "@fluentui/react-components";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import {
  Col,
  Container,
  Row
} from "react-bootstrap";

import styles
  from "./ItemView.module.css";

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export function ItemView() {
  const [item, setItem] = useState<IItemModel>({})

  const {itemId} = useParams();

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateItem() {
      if (itemId === undefined || !isNumeric(itemId)) {
        showErrorToast(`Item with id '${itemId}' could not be parsed.`, dispatchToast)
        return;
      }

      try {
        let client = new ItemClient();

        let result = await client.getItem(parseInt(itemId));

        setItem(result);
      } catch {
        showErrorToast(`Item with id '${itemId}' could not be loaded.`, dispatchToast)
      }
    }

    populateItem();
  }, []);

  return (<>
    <Container>
      <Row>
        <Col
          md={"4"}
          className="align-self-start">
          <img
            alt={"Cover of Media"}
            className={`object-fit-contain overflow-hidden ${styles.mediaImage}`}
            src={"http://via.placeholder.com/300x400"}/>
        </Col>
        <Col
          md={"8"}>
          <h1>{item.title}</h1>
          {item.authors && item.authors.length > 0 &&
              <p className="lead fs-6">By {item.authors.join(", ")}</p>}
          <p
            style={{whiteSpace: "pre-wrap"}}>{item.description}</p>
        </Col>
      </Row>
    </Container>
    <section
      className="py-4 py-xl-5">
      <Container>
        <div
          className="text-white bg-primary border rounded border-0 border-primary d-flex flex-column justify-content-between flex-lg-row p-4 p-md-5">
          <div
            className="pb-2 pb-lg-1">
            <h2
              className="fw-bold mb-2">I have this!</h2>
            <p
              className="mb-0">Add this {item.format} to one of your shelves now</p>
          </div>
          <div
            className="my-2">
            <Button>Add to Shelf</Button>
          </div>
        </div>
      </Container>
    </section>
  </>);
}

