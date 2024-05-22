import {
  Button,
  Field,
  Input,
  Spinner,
  useToastController
} from "@fluentui/react-components";
import {
  ChangeEvent,
  useContext,
  useEffect,
  useState
} from "react";
import {
  AccountClient,
  LoginModel,
} from "../../OMSWebClient.ts";
import {
  UserContext
} from "../../App.tsx";
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

interface LoginPageState {
  loading: boolean;
  email: string;
  password: string;
}

export function LoginPage() {
  const client = new AccountClient();
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

  async function loginUser() {
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
        showErrorToast("E-Mail and Password don't match", dispatchToast);
      else if (e.status === 403)
        showErrorToast("You're currently not allowed to log in!", dispatchToast);
      else {
        showErrorToast("An unexpected Server Error has occured", dispatchToast);
      }
    }

    setState(prevState => ({
      ...prevState,
      loading: false,
    }));
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

  useEffect(() => {
    if (user?.currentUser?.isLoggedIn === true)
      navigate(routes.root);
  }, [user?.currentUser?.isLoggedIn])

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