import {
  Button,
  Field,
  Input,
  Spinner,
  Title1,
  useToastController
} from "@fluentui/react-components";
import {
  ChangeEvent,
  useState
} from "react";
import {
  AccountClient,
  ApiException,
  RegisterModel,
} from "../../OMSWebClient.ts";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  routes
} from "../../utilities/routes.ts";
import {
  showErrorToast
} from "../../utilities/toastHelper.tsx";
import {
  UserInputValidator
} from "../../utilities/userInputValidator.ts";

interface RegisterPageState {
  loading: boolean;
  email: string;
  userName: string;
  password: string;
  errors: RegisterPageStateErrors;
}

interface RegisterPageStateErrors {
  email?: string;
  userName?: string;
  password?: string;
}

export function RegisterPage() {
  const location = useLocation();
  const routeData = location.state;

  const [state, setState] = useState<RegisterPageState>({
    loading: false,
    email: routeData?.email ?? "",
    userName: "",
    password: routeData?.password ?? "",
    errors: {},
  });

  const {dispatchToast} = useToastController();

  const navigate = useNavigate();

  async function loginUser() {
    const validateForm = (): boolean => {
      let emailError = UserInputValidator.validateEmail(state.email);
      let userNameError = UserInputValidator.validateUserName(state.userName);
      let passwordError = UserInputValidator.validatePassword(state.password);

      setState(prevState => ({
        ...prevState,
        errors: {
          email: emailError,
          userName: userNameError,
          password: passwordError,
        }
      }))

      return emailError == undefined &&
        userNameError == undefined &&
        passwordError == undefined;
    }

    if (!validateForm()) {
      setState(prevState => ({
        ...prevState,
        loading: false,
      }));
      return;
    }

    var client = new AccountClient();

    try {
      await client.register(new RegisterModel({
        email: state.email,
        username: state.userName,
        password: state.password,
      }));

      navigate(routes.login)
    } catch (e: any) {
      if (e instanceof ApiException) {
        showErrorToast(`An error occurred creating the User.`, dispatchToast);
      } else {
        showErrorToast(`An unexpected error occurred`, dispatchToast);
      }
    }

    setState(prevState => ({
      ...prevState,
      loading: false,
    }));
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
        <Title1>Register a new account:</Title1>
        <Field
          label="E-Mail address"
          validationMessage={state.errors.email}
          validationState={state.errors.email ? "error" : "none"}>
          <Input
            onChange={inputChanges}
            appearance={"underline"}
            type={"email"}
            required
            name={"email"}
            value={state.email}/>
        </Field>
        <Field
          label="Username"
          validationMessage={state.errors.userName}
          validationState={state.errors.userName ? "error" : "none"}>
          <Input
            onChange={inputChanges}
            appearance={"underline"}
            required
            name={"userName"}
            value={state.userName}/>
        </Field>
        <Field
          label="Password"
          validationMessage={state.errors.password}
          validationState={state.errors.password ? "error" : "none"}>
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