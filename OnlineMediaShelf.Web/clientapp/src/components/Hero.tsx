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
  CSSProperties,
  ReactNode
} from "react";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  actions: ReactNode[];
  backgroundImage: string;
  backgroundColorOverlay: string;
  style?: CSSProperties;
}

export function Hero(props: HeroProps) {
  let textShadowStyle: CSSProperties = {
    textShadow: `1px 1px 1px black`,
  };

  return <div
    style={{
      ...props.style,
      borderRadius: tokens.borderRadiusLarge,
      background: `linear-gradient(color-mix(in srgb, ${props.backgroundColorOverlay} 30%, rgba(0,0,0,0.6)), color-mix(in srgb, ${props.backgroundColorOverlay} 30%, rgba(0,0,0,0.6))), url(${props.backgroundImage}) center / cover`,
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
            <Title1
              style={{
                ...textShadowStyle
              }}>{props.title}</Title1><br/>
            <Subtitle2
              style={{
                ...textShadowStyle
              }}>{props.subtitle}</Subtitle2>
            <Divider
              style={{height: "35px"}}></Divider>
            <Caption1
              style={{
                ...textShadowStyle
              }}>{props.description}</Caption1><br/>
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