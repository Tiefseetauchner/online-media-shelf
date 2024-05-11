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
  Card,
  Field,
  Input,
  Skeleton,
  SkeletonItem
} from "@fluentui/react-components";
import {
  AccountClient
} from "../../OMSWebClient.ts";

interface AccountState {
  isLoaded: boolean;
  email?: string;
  userName?: string;

}

function AccountPageSkeleton() {
  return (<>
    <Skeleton>
      <SkeletonItem
        shape={"rectangle"}/>
    </Skeleton>
  </>);
}

export function AccountPage() {
  const {user} = useContext(UserContext);

  const [state, setState] = useState<AccountState>({isLoaded: false});

  useEffect(() => {
    async function loadUserData() {
      const client = new AccountClient();
      try {
        let result = await client.getCurrentUserInformation();

        setState(prevState => {
          return {
            ...prevState,
            isLoaded: true,
            userName: result.userName,
            email: "email@asdf.com",
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
    <h1>Manage my account</h1>

    <h2>Manage Shelves</h2>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "25% 25% 25% 25%",
        gridGap: "10px"
      }}>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
      <Card
        orientation={"horizontal"}/>
    </div>

    <h2>Edit Account Data</h2>
    {state.isLoaded ?
      <form
        onSubmit={(e) => {
          e.preventDefault()

          return false;
        }}>
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
      </form> :
      <AccountPageSkeleton/>
    }

  </>);
}