import {
  Col,
  Container,
  Row
} from "react-bootstrap";
import {
  Caption1,
  Divider,
  Subtitle2,
  Title1,
  tokens
} from "@fluentui/react-components";
import {
  ReactNode
} from "react";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  actions: ReactNode[];
}

export function Hero(props: HeroProps) {
  return <div
    style={{
      borderRadius: tokens.borderRadiusLarge,
      height: "600px",
      background: `linear-gradient(color-mix(in srgb, ${tokens.colorBrandBackground} 30%, rgba(0,0,0,0.6)), color-mix(in srgb, ${tokens.colorBrandBackground} 30%, rgba(0,0,0,0.6))), url(images/books_1.jpg) center / cover`,
    }}>
    <Container
      className={"h-100"}>
      <Row
        className={"d-flex align-items-center h-100"}>
        <Col
          md={"6"}
          sm={"12"}>
          <div
            style={{
              color: tokens.colorNeutralForegroundInverted
            }}>
            <Title1>{props.title}</Title1><br/>
            <Subtitle2>{props.subtitle}</Subtitle2>
            <Divider
              style={{height: "35px"}}></Divider>
            <Caption1>{props.description}</Caption1><br/>
            <Container
              style={{marginTop: "15px"}}>
              <Row>
                {props.actions.map(action =>
                  <Col>
                    {action}
                  </Col>
                )}
              </Row>
            </Container>
          </div>
        </Col>
      </Row>
    </Container>
  </div>;
}