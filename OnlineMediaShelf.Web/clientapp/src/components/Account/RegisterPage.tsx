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
  useState
} from "react";
import {
  AccountClient,
  RegisterModel,
} from "../../OMSWebClient.ts";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  routes
} from "../../routes.ts";

interface RegisterPageState {
  loading: boolean;
  email: string;
  userName: string;
  password: string;
}

export function RegisterPage() {
  const location = useLocation();
  const routeData = location.state;

  const [state, setState] = useState<RegisterPageState>({
    loading: false,
    email: routeData?.email ?? "",
    userName: "",
    password: routeData?.password ?? "",
  });

  const {dispatchToast} = useToastController();

  const navigate = useNavigate();

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
      await client.register(new RegisterModel({
        email: state.email,
        username: state.userName,
        password: state.password,
      }));

      navigate(routes.login)
    } catch (e: any) {
      showErrorToast("An unexpected Server Error has occured")
    }

    setState({
      ...state,
      loading: false,
    });
  }

  const inputChanges = (e: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
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
        <h1>Register a new account:</h1>
        <Field
          label="E-Mail address">
          <Input
            onChange={inputChanges}
            appearance={"underline"}
            type={"email"}
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
        <Field
          label="Password">
          <Input
            onChange={inputChanges}
            appearance={"underline"}
            type={"password"}
            required
            name={"password"}
            value={state.password}/>
        </Field>
        <br/>
        {
          state.loading ?
            <Spinner/> : <>
              <Button
                type={"submit"}
                appearance={"primary"}
                style={{marginRight: 10}}>Register new Account</Button>
              <Link
                to={routes.login}
                state={{
                  email: state.email,
                  password: state.password,
                }}>
                <Button
                  appearance={"outline"}>Login</Button>
              </Link>
            </>
        }
      </form>
    </div>);
}