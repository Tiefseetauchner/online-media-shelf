import {
  Col,
  Container,
  Row
} from "react-bootstrap";
import {
  Button
} from "@fluentui/react-components";


export function Hero() {
  return <div
    style={{height: "600px"}}>
    <Container
      fluid={"md"}>
      <Row>
        <Col
          md={"6"}>
          <h1
            className="text-uppercase fw-bold">Biben dum<br/>fringi dictum, augue purus
          </h1>
          <p
            className="my-3">Tincidunt laoreet leo, adipiscing taciti tempor. Primis senectus sapien, risus donec ad fusce augue interdum.</p>
          <Button
            className="btn btn-primary btn-lg me-2"
            role="button"
            href="#">Button</Button><a
          className="btn btn-outline-primary btn-lg"
          role="button"
          href="#">Button</a>
        </Col>
        <Col
          md={"6"}>
          <h1
            className="text-uppercase fw-bold">Biben dum<br/>fringi dictum, augue purus
          </h1>
          <p
            className="my-3">Tincidunt laoreet leo, adipiscing taciti tempor. Primis senectus sapien, risus donec ad fusce augue interdum.</p>
          <Button
            className="btn btn-primary btn-lg me-2"
            role="button"
            href="#">Button</Button><a
          className="btn btn-outline-primary btn-lg"
          role="button"
          href="#">Button</a>
        </Col>
      </Row>
    </Container>
  </div>;
}