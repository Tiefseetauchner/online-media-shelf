import {
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Toolbar,
  ToolbarButton,
  ToolbarRadioButton,
  ToolbarToggleButton
} from "@fluentui/react-components";
import {
  FontAwesomeIcon
} from "@fortawesome/react-fontawesome";
import {
  faListUl
} from "@fortawesome/free-solid-svg-icons/faListUl";
import {
  faBorderAll
} from "@fortawesome/free-solid-svg-icons/faBorderAll";
import {
  faEye
} from "@fortawesome/free-solid-svg-icons/faEye";
import {
  Col,
  Row
} from "react-bootstrap";
import {
  PropsWithChildren
} from "react";

interface ItemsDisplayToolbarProps extends PropsWithChildren {
  checkedValues: Record<string, string[]>;
  onCheckedValueChange: (_: any, data: {
    name: string,
    checkedItems: string[]
  }) => void;
}

export function ItemsDisplayToolbar(props: ItemsDisplayToolbarProps) {
  return (
    <Toolbar
      checkedValues={props.checkedValues}
      onCheckedValueChange={props.onCheckedValueChange}>
      {props.children}
      <ToolbarRadioButton
        style={{borderRadius: "var(--borderRadiusMedium) 0 0 var(--borderRadiusMedium)"}}
        name={"displayMode"}
        value={"list"}
        appearance={"subtle"}
        icon={
          <FontAwesomeIcon
            icon={faListUl}/>}/>
      <ToolbarRadioButton
        style={{borderRadius: "0"}}
        appearance={"subtle"}
        name={"displayMode"}
        value={"grid"}
        icon={
          <FontAwesomeIcon
            icon={faBorderAll}/>}/>

      <Popover
        positioning={{
          position: "below"
        }}>
        <PopoverTrigger>
          <ToolbarButton
            style={{borderRadius: "0 var(--borderRadiusMedium) var(--borderRadiusMedium) 0"}}
            icon={
              <FontAwesomeIcon
                icon={faEye}/>}>
          </ToolbarButton>
        </PopoverTrigger>
        <PopoverSurface>
          <Col>
            <Row>
              <ToolbarToggleButton
                name={"shownFields"}
                value={"title"}>
                Title
              </ToolbarToggleButton>
            </Row>
            <Row>
              <ToolbarToggleButton
                name={"shownFields"}
                value={"authors"}>
                Authors
              </ToolbarToggleButton>
            </Row>
            <Row>
              <ToolbarToggleButton
                name={"shownFields"}
                value={"description"}>
                Description
              </ToolbarToggleButton>
            </Row>
            <Row>
              <ToolbarToggleButton
                name={"shownFields"}
                value={"barcode"}>
                Barcode
              </ToolbarToggleButton>
            </Row>
            <Row>
              <ToolbarToggleButton
                name={"shownFields"}
                value={"format"}>
                Format
              </ToolbarToggleButton>
            </Row>
            {props.checkedValues.displayMode && props.checkedValues.displayMode[0] == "grid" &&
                <Row>
                    <ToolbarToggleButton
                        name={"shownFields"}
                        value={"cover"}>
                        Cover
                    </ToolbarToggleButton>
                </Row>}
          </Col>
        </PopoverSurface>
      </Popover>
    </Toolbar>)
}