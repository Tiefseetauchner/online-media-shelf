import {
  useParams
} from "react-router-dom";
import {
  useContext,
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
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import Barcode
  from "react-barcode";
import {
  CreateItemDialog
} from "./CreateItemDialog.tsx";
import {
  UploadImageDialog
} from "./UploadImageDialog.tsx";
import {
  UserContext
} from "../../App.tsx";
import {
  AddItemToShelfDialog
} from "./AddItemToShelfDialog.tsx";

function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export function ItemView() {
  const [item, setItem] = useState<IItemModel>({});
  const [coverImageUrl, setCoverImageUrl] = useState("/no_cover.jpg");
  const [hover, setHover] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [uploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);
  const [addItemToShelfDialogOpen, setAddItemToShelfDialogOpen] = useState(false);

  const {itemId} = useParams();

  const {user} = useContext(UserContext);

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateItem() {
      if (itemId === undefined || !isNumeric(itemId)) {
        showErrorToast(`Item with id '${itemId}' could not be parsed`, dispatchToast)
        return;
      }

      let client = new ItemClient();

      try {
        let result = await client.getItem(parseInt(itemId));

        setItem(result);
      } catch {
        showErrorToast(`Item with id '${itemId}' could not be loaded`, dispatchToast)
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
    <CreateItemDialog
      onOpenChange={(_, data) => setUpdateDialogOpen(data.open)}
      open={updateDialogOpen}
      update={true}
      item={item}/>

    <UploadImageDialog
      onOpenChange={(_, data) => setUploadImageDialogOpen(data.open)}
      open={uploadImageDialogOpen}
      itemId={item.id}/>

    <AddItemToShelfDialog
      onOpenChange={(_, data) => setAddItemToShelfDialogOpen(data.open)}
      open={addItemToShelfDialogOpen}
      itemId={item.id}/>

    <Container>
      <Row>
        <Col
          md={"4"}
          className="align-self-start">
          <Row>
            <div
              className={`${styles.imageContainer} ${styles.mediaImage}`}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}>
              <img
                alt={"Cover of Media"}
                className={`object-fit-contain overflow-hidden ${styles.mediaImage} ${styles.image}`}
                src={coverImageUrl}/>

              {hover && user?.currentUser?.isLoggedIn &&
                  <Button
                      className={styles.editButton}
                      onClick={() => setUploadImageDialogOpen(true)}
                      icon={
                        <FontAwesomeIcon
                          icon={faEdit}/>}/>}
            </div>

            {item.barcode ?
              <Barcode
                height={40}
                width={2}
                fontSize={24}
                renderer={"svg"}
                background={"#0000"}
                format={item.barcode.length == 12 ? "UPC" : "EAN13"}
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
            {
              user?.currentUser?.isLoggedIn &&
                <Col
                    className={"d-flex justify-content-end"}>
                    <Button
                        onClick={() => setUpdateDialogOpen(true)}
                        className={"h-auto"}
                        icon={
                          <FontAwesomeIcon
                            icon={faEdit}/>}>Edit Item</Button>
                </Col>
            }
          </Row>

          {item.authors && item.authors.length > 0 &&
              <p className="lead fs-6">By {item.authors.map(_ => _.name).join(", ")}</p>}
          <p
            class>Created by '{item.creatorName}'. Last edited by '{item.lastEditorName}'</p>
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
            <Button
              onClick={() => setAddItemToShelfDialogOpen(true)}>Add to Shelf</Button>
          </div>
        </div>
      </Container>
    </section>
  </>);
}

