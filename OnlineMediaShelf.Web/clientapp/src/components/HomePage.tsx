import {
  Hero
} from "./Hero.tsx";
import {
  Button,
  Caption2,
  Card,
  CardHeader,
  CardPreview,
  Divider,
  Subtitle1,
  Text,
  Title1,
  Title3,
  tokens,
  useToastController
} from "@fluentui/react-components";
import {
  FontAwesomeIcon,
} from "@fortawesome/react-fontawesome";
import {
  faGithub
} from "@fortawesome/free-brands-svg-icons";
import {
  navigateToItem,
  routes
} from "../utilities/routes.ts";
import {
  faCode,
  faDatabase,
  faUser,
  faUsers
} from "@fortawesome/free-solid-svg-icons";
import {
  CardBody,
  Col,
  Container,
  Row
} from "react-bootstrap";
import {
  Link,
  useNavigate
} from "react-router-dom";
import {
  useEffect,
  useState
} from "react";
import {
  IItemModel,
  ItemClient
} from "../OMSWebClient.ts";
import {
  showErrorToast
} from "../utilities/toastHelper.tsx";

interface IItemModelWithCoverImage {
  item: IItemModel;
  coverImageUrl: string;
}

export function HomePage() {
  const [mostRecentItems, setMostRecentItems] = useState<IItemModelWithCoverImage[]>([]);

  const {dispatchToast} = useToastController();

  const navigate = useNavigate();

  useEffect(() => {
    async function populateItems() {
      try {
        const itemClient = new ItemClient();

        const items = await itemClient.getItems(3, 0);

        const itemsWithCoverImages = items.map<Promise<IItemModelWithCoverImage>>((item) =>
          itemClient.getItemCoverImage(item.id!).then(response => ({
              item: item,
              coverImageUrl: URL.createObjectURL(response.data)
            })
          ).catch(() => ({
              item: item,
              coverImageUrl: "/no_cover.jpg"
            })
          ));

        setMostRecentItems(await Promise.all<IItemModelWithCoverImage>(itemsWithCoverImages));
      } catch {
        showErrorToast("Could not load most recent items", dispatchToast)
      }
    }

    populateItems();
  }, []);

  return <>
    <Hero
      title={"Online Media Shelf"}
      subtitle={"Effortless Organization of your physical media"}
      description={"Revolutionize your media management—effortlessly curate, organize, and celebrate your media with the Online Media Shelf."}
      backgroundImage={"/images/books_1.jpg"}
      backgroundColorOverlay={tokens.colorBrandBackground}
      style={{
        height: "600px",
      }}
      actions={[
        <Button
          as={"a"}
          href={"https://github.com/Tiefseetauchner/online-media-shelf"}
          icon={
            <FontAwesomeIcon
              icon={faGithub}/>}>GitHub</Button>,
        <Link
          to={routes.login}>
          <Button
            icon={
              <FontAwesomeIcon
                icon={faUser}/>}>Log in</Button>
        </Link>
      ]}/>

    <Container
      className={"mt-4 mb-4"}>
      <Row>
        <Col
          className={"text-center mx-auto"}
          md={"8"}
          xl={"6"}>
          <Title1>Catalogue Your Media Easily</Title1>
          <Divider
            style={{height: "32px"}}/>
          <Text>Easily catalogue, rate, review and share your media with others.</Text>
        </Col>
      </Row>

      <Row
        className={"mt-2 row-gap-2"}>
        <Col
          md={"4"}>
          <Card>
            <CardHeader
              image={
                <FontAwesomeIcon
                  size={"2x"}
                  width={"48px"}
                  icon={faDatabase}/>}
              header={
                <Subtitle1>Advanced Cataloging</Subtitle1>}
              description={
                <Caption2>Comprehensive Media Management</Caption2>}/>
            <div
              className="p-2">
              <Text>Effortlessly catalog your entire media collection, including books, DVDs, Blu-rays, and CDs. With detailed
                metadata capabilities, you can add information such as title, author/director, release date, and format,
                ensuring your collection is organized and easily accessible.</Text>
            </div>
          </Card>
        </Col>
        <Col
          md={"4"}>
          <Card>
            <CardHeader
              image={
                <FontAwesomeIcon
                  size={"2x"}
                  width={"48px"}
                  icon={faUsers}/>}
              header={
                <Subtitle1>Collaborative Features</Subtitle1>}
              description={
                <Caption2>Share and Expand Your Collection</Caption2>}/>
            <CardBody>
              <div
                className="p-2">Invite others to view and contribute to your media library. Whether you’re seeking recommendations,
                additional content, or simply want to share your collection with friends, the Online Media Shelf’s
                collaboration tools make it easy to expand and enhance your digital library through community input.
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col
          md={"4"}>
          <Card>
            <CardHeader
              image={
                <FontAwesomeIcon
                  size={"2x"}
                  width={"48px"}
                  icon={faCode}/>}
              header={
                <Subtitle1>Open Source Flexibility</Subtitle1>}
              description={
                <Caption2>Transparent and Customizable</Caption2>}/>
            <div
              className="p-2">
              <Text>Embrace the power of open-source software. The Online Media Shelf is licensed under the MIT License,
                allowing you to modify and improve the platform according to your needs. Contribute to the project, report
                issues, and join a growing community of developers dedicated to enhancing this innovative media management tool.</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>

    <Hero
      title={"Organize your media"}
      subtitle={"Use shelves to rate and organize Books, DVDs, and more"}
      description={"With our modular shelf system, you are able to not only catalogue your media, but also organize it any way you like - " +
        "if that is corresponding to physical shelves for you to find your media more quickly or using ratings for shelves is up to you!"}
      backgroundImage={"/images/dvds_1.jpg"}
      backgroundColorOverlay={tokens.colorBrandBackground}
      style={{
        height: "300px",
      }}
      actions={[]}/>

    <Container
      className="py-4 py-xl-5">
      <Row
        className="mb-5">
        <Col
          md={"8"}
          xl={"6"}
          className="text-center mx-auto">
          <h2>Most Recent Media</h2>
          <p
            className="w-lg-50">Find the most recent media added to Online Media Shelf - Maybe it's for you too!</p>
        </Col>
      </Row>
      <Row
        sm={"1"}
        md={"3"}
        className="gy-4">
        {mostRecentItems.map(itemWithCoverImage => {
          const item = itemWithCoverImage.item;

          return <Col>
            <Card>
              <CardPreview>
                <img
                  onClick={() => navigateToItem(item.id, navigate)}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    objectPosition: "center",
                    cursor: "pointer",
                  }}
                  alt={`Cover image of ${item.title}`}
                  src={itemWithCoverImage.coverImageUrl}/>
              </CardPreview>
              <div
                className="p-2">
                <Text
                  style={{
                    color: tokens.colorBrandForeground1
                  }}>{item.format}</Text>
                <CardHeader
                  style={{
                    overflow: "hidden",
                  }}
                  header={
                    <Link
                      to={`${routes.item}/${item.id}`}>
                      <Title3
                        style={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                        }}>{item.title}</Title3>
                    </Link>}/>
                <Text
                  style={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 4,
                  }}>{item.description}</Text>
              </div>
            </Card>
          </Col>
        })}
      </Row>
    </Container>
  </>
}