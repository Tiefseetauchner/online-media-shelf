import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {IItemModel, ItemClient} from "../../OMSWebClient.ts";

import {Button, useToastController} from "@fluentui/react-components";
import {showErrorToast} from "../../utilities/toastHelper.tsx";
import {Col, Container, Row} from "react-bootstrap";

import styles from "./ItemView.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import Barcode from "react-barcode";

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export function ItemView() {
  const [item, setItem] = useState<IItemModel>({})
  const [coverImageUrl, setCoverImageUrl] = useState("/no_cover.jpg");

  const {itemId} = useParams();

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateItem() {
      if (itemId === undefined || !isNumeric(itemId)) {
        showErrorToast(`Item with id '${itemId}' could not be parsed.`, dispatchToast)
        return;
      }

      let client = new ItemClient();

      try {
        let result = await client.getItem(parseInt(itemId));

        setItem(result);
      } catch {
        showErrorToast(`Item with id '${itemId}' could not be loaded.`, dispatchToast)
      }

      try {
        let coverImage = await client.getItemCoverImage(parseInt(itemId));
        setCoverImageUrl(URL.createObjectURL(coverImage.data));
      } catch {
        setCoverImageUrl("/no_cover.jpg");
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
          <Row>
            <img
              alt={"Cover of Media"}
              className={`object-fit-contain overflow-hidden ${styles.mediaImage}`}
              src={coverImageUrl}/>

            <Button>Upload Cover Image (WIP)</Button>

            {item.barcode ?
              <Barcode
                height={40}
                width={2}
                fontSize={24}
                renderer={"svg"}
                background={"#0000"}
                format={"EAN13"}
                value={item.barcode}/> :
              <>No barcode available</>}
          </Row>
        </Col>
        <Col
          md={"8"}>
          <Row>
            <Col>
              <h1>{item.title}</h1>
            </Col>
            <Col
              className={"d-flex justify-content-end"}>
              <Button
                className={"h-auto"}
                icon={
                  <FontAwesomeIcon
                    icon={faEdit}/>}>Edit Item (WIP)</Button>
            </Col>
          </Row>

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
            <Button>Add to Shelf (WIP)</Button>
          </div>
        </div>
      </Container>
    </section>
  </>);
}

