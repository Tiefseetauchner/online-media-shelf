import {
  IShelfModel
} from "../OMSWebClient.ts";
import * as React_2
  from "react";
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger
} from "@fluentui/react-components";

interface ItemToShelfMenuProps {
  currentUsersShelves: IShelfModel[];
  shelfId?: number;
  shelfAction: (shelfId: number) => Promise<void>;
  children: React_2.ReactElement | null;
}

export function ItemToShelfMenu(props: ItemToShelfMenuProps) {
  return (
    <Menu>
      <MenuTrigger
        disableButtonEnhancement>
        {props.children}
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          {props.currentUsersShelves && props.currentUsersShelves.filter(_ => _.id !== props.shelfId).length > 0 ?
            props.currentUsersShelves.filter(_ => _.id !== props.shelfId).map(_ =>
              <MenuItem
                onClick={() => {
                  props.shelfAction(_.id!);
                }}>{_.name}</MenuItem>) :
            <MenuItem
              disabled>No Shelves found</MenuItem>}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}