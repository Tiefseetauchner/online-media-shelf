import {
  ChangeEvent,
  useContext,
  useEffect,
  useState
} from "react";
import {
  Button,
  Field,
  Input,
  Skeleton,
  SkeletonItem,
  Title1,
  Title2,
  useToastController
} from "@fluentui/react-components";
import {
  AccountClient,
  IShelfModel,
  ShelfClient
} from "../../OMSWebClient.ts";
import {
  ShelfList
} from "../Shelves/ShelfList.tsx";
import {
  Col,
  Row
} from "react-bootstrap";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import {
  UserContext
} from "../../App.tsx";
import {
  useNavigate
} from "react-router-dom";
import {
  routes
} from "../../utilities/routes.ts";

interface AccountState {
  isLoaded: boolean;
  email?: string;
  userName?: string;
  shelves?: IShelfModel[];
}

function AccountPageSkeleton() {
  return (<>
    <Skeleton>
      <Title1>
        <SkeletonItem
          style={{
            width: "150px",
            height: "2rem",
          }}/>
      </Title1>
      <Title2>
        <SkeletonItem
          style={{
            width: "50px",
            height: "1.5rem",
          }}/>

      </Title2>
      <div>
        <SkeletonItem
          style={{
            width: "250px",
            height: "150px",
          }}/>
      </div>
      <Title2>
        <SkeletonItem
          style={{
            width: "50px",
            height: "1.5rem",
          }}/>
      </Title2>
    </Skeleton>
  </>);
}

export function AccountPage() {
  const [state, setState] = useState<AccountState>({isLoaded: false});

  const {user} = useContext(UserContext);

  const {dispatchToast} = useToastController();

  const navigate = useNavigate();

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
            email: accountResult.email,
          };
        });
      } catch (e: any) {
        showErrorToast("Couldn't load user information", dispatchToast)
      }
    }

    async function loadUserShelves() {
      const shelfClient = new ShelfClient();
      try {
        let shelfResult = await shelfClient.getAllShelves(user?.currentUser?.userName, null, null);

        setState(prevState => {
          return {
            ...prevState,
            shelves: shelfResult
          };
        });
      } catch (e: any) {
        showErrorToast("Couldn't load user shelves", dispatchToast)
      }
    }

    if (!user?.currentUser?.isLoggedIn)
      navigate(routes.login);

    loadUserShelves();

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

        <Row
          className={"mt-2 row-gap-2"}>
          <Col>
            <Title1>Manage my account</Title1>
          </Col>
          <Col>
            <Button
              style={{float: "right"}}
              onClick={() => {
                const accountClient = new AccountClient();
                accountClient.logout().then(() => location.reload());
              }}>Logout</Button>
          </Col>
        </Row>

        <Title2>Manage Shelves</Title2>

        <ShelfList
          shelves={state.shelves ?? []}/>

        <form
          onSubmit={(e) => {
            e.preventDefault()

            return false;
          }}>
          <Title2>Edit Account Data</Title2>
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