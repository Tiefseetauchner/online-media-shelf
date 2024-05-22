import {
  RouterProvider
} from "react-router-dom";
import {
  ICurrentUserModel
} from "./OMSWebClient.ts";
import {
  createContext,
  useState
} from "react";
import {
  router
} from "./utilities/routes.ts";

interface UserContextState {
  currentUser?: ICurrentUserModel;
}

export const UserContext = createContext<{
  user?: UserContextState,
  setUser?: React.Dispatch<React.SetStateAction<UserContextState>>
}>({});

function App() {
  const [user, setUser] = useState<UserContextState>({})

  return (
    <UserContext.Provider
      value={{
        user: user,
        setUser: setUser
      }}>
      <RouterProvider
        router={router}>
      </RouterProvider>
    </UserContext.Provider>);
}

export default App
