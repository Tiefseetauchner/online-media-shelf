import {
  ChangeEvent,
  useContext,
  useEffect,
  useState
} from "react";
import {
  UserContext
} from "../../App.tsx";
import {
  Button,
  Field,
  Input,
  Skeleton,
  SkeletonItem
} from "@fluentui/react-components";
import {
  AccountClient,
  IShelfModel
} from "../../OMSWebClient.ts";
import {
  ShelfCardDisplay
} from "../Shelves/ShelfCardDisplay.tsx";

interface AccountState {
  isLoaded: boolean;
  email?: string;
  userName?: string;
  shelves?: IShelfModel[];
}

function AccountPageSkeleton() {
  return (<>
    <Skeleton>
      <h1>
        <SkeletonItem
          style={{
            width: "150px",
            height: "2rem",
          }}/>
      </h1>
      <h2>
        <SkeletonItem
          style={{
            width: "50px",
            height: "1.5rem",
          }}/>

      </h2>
      <div>
        <SkeletonItem
          style={{
            width: "250px",
            height: "150px",
          }}/>
      </div>
      <h2>
        <SkeletonItem
          style={{
            width: "50px",
            height: "1.5rem",
          }}/>
      </h2>
    </Skeleton>
  </>);
}

export function AccountPage() {
  const {user} = useContext(UserContext);

  const [state, setState] = useState<AccountState>({isLoaded: false});

  useEffect(() => {
    async function loadUserData() {
      const accountClient = new AccountClient();
      try {
        let accountResult = await accountClient.getCurrentUserInformation();

        setState(prevState => {
          return {
            ...prevState,
            isLoaded: true,
            userName: accountResult.userName,
            email: "email@asdf.com",
            shelves: accountResult.shelves,
          };
        });
      } catch (e: any) {

      }
    }

    loadUserData();
  }, []);

  const inputChanges = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  return (<>
    {state.isLoaded ? <>
        <h1>Manage my account</h1>

        <h2>Manage Shelves</h2>

        <ShelfCardDisplay
          shelves={state.shelves ?? []}/>

        <form
          onSubmit={(e) => {
            e.preventDefault()

            return false;
          }}>
          <h2>Edit Account Data</h2>
          <Field
            label="E-Mail address">
            <Input
              onChange={inputChanges}
              appearance={"underline"}
              required
              name={"email"}
              value={state.email}/>
          </Field>
          <Field
            label="Username">
            <Input
              onChange={inputChanges}
              appearance={"underline"}
              required
              name={"userName"}
              value={state.userName}/>
          </Field>
          <Button
            appearance={"primary"}
            type={"submit"}>
            Update Account Data
          </Button>
        </form>
      </> :
      <AccountPageSkeleton/>
    }

  </>);
}