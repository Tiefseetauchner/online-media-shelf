import {Shelf, ShelfClient} from "../../OMSWebClient.ts";
import {useContext, useEffect, useState} from "react";
import {Button, SkeletonItem, useToastController} from "@fluentui/react-components";
import {showErrorToast} from "../../utilities/toastHelper.tsx";
import {UserContext} from "../../App.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {AddShelfDialog} from "./AddShelfDialog.tsx";

interface ShelvesState {
  shelves?: Shelf[];
}

export function Shelves() {
  const shelfClient = new ShelfClient();

  const [state, setState] = useState<ShelvesState>({});

  const {user} = useContext(UserContext)

  const {dispatchToast} = useToastController();

  useEffect(() => {
    async function populateShelves() {
      try {
        let shelves = await shelfClient.getAllShelves(null);

        setState({
          ...state,
          shelves: shelves
        })
      } catch (e: any) {
        showErrorToast("An error occured while loading the shelves! Try again later or contact the service owner.", dispatchToast)
      }
    }

    populateShelves();
  }, []);

  return (<>
    <h1>Shelves</h1>

    <AddShelfDialog
      open={true}/>
    {user?.currentUser?.isLoggedIn ?
      <Button icon={<FontAwesomeIcon icon={faPlus}/>}/> :
      <></>}
    {state.shelves == undefined ?
      <SkeletonItem/> :
      state.shelves.map(shelf => <p>{shelf.id}</p>)}
    <p></p>
  </>)
}