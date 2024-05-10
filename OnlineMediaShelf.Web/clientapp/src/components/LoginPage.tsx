import {
  Button,
  Field,
  Input,
  Spinner,
  Toast,
  ToastBody,
  ToastTitle,
  useToastController
} from "@fluentui/react-components";
import {
  ChangeEvent,
  useContext,
  useState
} from "react";
import {
  AccountClient,
  LoginModel,
} from "../OMSWebClient.ts";
import {
  routes,
  UserContext
} from "../App.tsx";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

interface LoginPageState {
  loading: boolean;
  email: string;
  password: string;
}

export function LoginPage() {
  const location = useLocation();
  const routeData = location.state;

  const [state, setState] = useState<LoginPageState>({
    loading: false,
    email: routeData?.email ?? "",
    password: routeData?.password ?? "",
  });

  const {
    user,
    setUser
  } = useContext(UserContext);

  const navigate = useNavigate();

  const {dispatchToast} = useToastController();

  function showErrorToast(message: string) {
    dispatchToast(
      <Toast>
        <ToastTitle>An Error occured while trying to log in:</ToastTitle>
        <ToastBody>{message}</ToastBody>
      </Toast>,
      {
        intent: "error",
        position: "bottom",
        timeout: 5000
      }
    );
  }

  async function loginUser() {
    var client = new AccountClient();

    try {
      await client.login(new LoginModel({
        usernameOrEmail: state.email,
        password: state.password
      }));

      let user = await client.getCurrentUser();

      setUser!({
        currentUser: {
          isLoggedIn: user.isLoggedIn,
          userName: user.userName
        }
      })

      navigate(routes.root);
    } catch (e: any) {
      if (e.status === 401)
        showErrorToast("E-Mail and Password don't match");
      else if (e.status === 403)
        showErrorToast("You're currently not allowed to log in!");
      else {
        showErrorToast("An unexpected Server Error has occured");
        throw e;
      }

    }

    setState({
      ...state,
      loading: false,
    });
  }

  const emailInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      email: e.target.value
    });
  };

  const passwordInputChanges = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      password: e.target.value
    });
  };

  return (
    <div
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        padding: "50px",
        boxSizing: "border-box"
      }}>
      <form
        style={{
          width: "450px"
        }}
        onSubmit={(e) => {
          e.preventDefault();

          setState({
            ...state,
            loading: true
          });

          loginUser();
        }}>
        <h1>Log in:</h1>
        <Field
          label="E-Mail address">
          <Input
            onChange={emailInputChanges}
            appearance={"underline"}
            required
            value={state.email}/>
        </Field>
        <Field
          label="Password">
          <Input
            onChange={passwordInputChanges}
            appearance={"underline"}
            type={"password"}
            required
            value={state.password}/>
        </Field>
        <br/>
        {
          state.loading ?
            <Spinner/> : <>
              <Button
                type={"submit"}
                appearance={"primary"}
                style={{marginRight: 10}}>Login</Button>
              <Link
                to={routes.register}
                state={{
                  email: state.email,
                  password: state.password,
                }}>
                <Button
                  appearance={"outline"}>Register</Button>
              </Link>
            </>
        }
      </form>
    </div>);
}