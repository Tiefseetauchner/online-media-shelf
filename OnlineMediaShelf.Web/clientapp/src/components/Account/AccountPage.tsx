import {
  useContext,
  useEffect,
  useRef,
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
  ChangeUserDataModel,
  IShelfModel,
  ShelfClient,
  UpdatePasswordModel
} from "../../OMSWebClient.ts";
import {
  ShelfList
} from "../Shelves/ShelfList.tsx";
import {
  Col,
  Container,
  Row
} from "react-bootstrap";
import {
  showErrorToast,
  showSuccessToast
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

interface AccountValidationErrors {
  email?: string;
  userName?: string;
  password?: string;
}

interface AccountState {
  isLoaded: boolean;
  email?: string;
  userName?: string;
  shelves?: IShelfModel[];
  validationErrors?: AccountValidationErrors;
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

  const userNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfirmRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadUserData() {
      const accountClient = new AccountClient();
      try {
        let accountResult = await accountClient.getCurrentUserInformation();

        if (!user?.currentUser?.isLoggedIn)
          navigate(routes.login);

        setState(prevState => {
          return {
            ...prevState,
            isLoaded: true,
            userName: accountResult.userName,
            email: accountResult.email,
          };
        });

        await loadUserShelves();
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

    if (!user?.currentUser)
      return;

    if (!user?.currentUser?.isLoggedIn)
      navigate(routes.login);

    loadUserData();

  }, [user]);

  useEffect(() => {
    if (state.isLoaded) {
      userNameRef.current!.value = state.userName ?? "";
      emailRef.current!.value = state.email ?? "";
    }
  }, [state.isLoaded]);

  const updatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const oldPassword = oldPasswordRef.current?.value;
    const newPassword = newPasswordRef.current?.value;
    const newPasswordConfirm = newPasswordConfirmRef.current?.value;

    if (newPassword != newPasswordConfirm)
      return setState(prevState => ({
        ...prevState,
        validationErrors: {
          ...prevState.validationErrors,
          password: "Passwords do not match"
        }
      }));

    const accountClient = new AccountClient();

    try {
      await accountClient.changePassword(new UpdatePasswordModel({
        oldPassword: oldPassword,
        newPassword: newPassword
      }));

      showSuccessToast("Password updated successfully", dispatchToast);
    } catch {
      showErrorToast("Couldn't update password", dispatchToast);
    }
  }

  const updateAccountData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const userName = userNameRef.current?.value;
    const email = emailRef.current?.value;

    const accountClient = new AccountClient();

    try {
      await accountClient.changeUserData(new ChangeUserDataModel({
        userName: userName,
        email: email
      }));

      showSuccessToast("User Data updated successfully", dispatchToast);
    } catch {
      showErrorToast("Couldn't update user data", dispatchToast);
    }
  }

  return (
    <Container>
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
          <hr/>

          {state.shelves && state.shelves?.length > 0 && <>
              <Title2>Manage Shelves</Title2>

              <ShelfList
                  shelves={state.shelves ?? []}/>
          </>}

          <form
            onSubmit={updateAccountData}>
            <Container>
              <Title2>Edit Account Data</Title2>
              <Row
                className={"row-gap-3"}
                md={2}
                sm={1}
                xs={1}>
                <Col>
                  <Field
                    required
                    label="Username">
                    <Input
                      ref={userNameRef}
                      appearance={"underline"}
                      name={"userName"}/>
                  </Field>
                </Col>
                <Col>
                  <Field
                    required
                    label="E-Mail address">
                    <Input
                      ref={emailRef}
                      appearance={"underline"}
                      name={"email"}/>
                  </Field>
                </Col>
                <Col>
                  <Button
                    appearance={"primary"}
                    type={"submit"}>
                    Update Account Data
                  </Button>
                </Col>
              </Row>
            </Container>
          </form>
          <form
            onSubmit={updatePassword}>
            <Container>
              <Row
                className={"row-gap-3 mt-3"}
                md={3}
                sm={1}
                xs={1}>
                <Col>
                  <Field
                    required
                    label="Old Password">
                    <Input
                      ref={oldPasswordRef}
                      appearance={"underline"}
                      name={"password"}
                      type={"password"}/>
                  </Field>
                </Col>
                <Col>
                  <Field
                    required
                    validationMessage={state.validationErrors?.password}
                    label="New Password">
                    <Input
                      ref={newPasswordRef}
                      appearance={"underline"}
                      name={"password"}
                      type={"password"}/>
                  </Field>
                </Col>
                <Col>
                  <Field
                    required
                    label="Confirm New Password">
                    <Input
                      ref={newPasswordConfirmRef}
                      appearance={"underline"}
                      name={"password"}
                      type={"password"}/>
                  </Field>
                </Col>
                <Col>
                  <Button
                    appearance={"primary"}
                    type={"submit"}>
                    Update Password
                  </Button>
                </Col>
              </Row>
            </Container>
          </form>
        </> :
        <AccountPageSkeleton/>
      }

    </Container>);
}