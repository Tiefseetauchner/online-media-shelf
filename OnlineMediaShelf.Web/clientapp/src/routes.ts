import {
  createBrowserRouter
} from "react-router-dom";
import {
  Layout
} from "./components/Layout.tsx";
import {
  ErrorPage
} from "./components/ErrorPage.tsx";
import {
  HomePage
} from "./components/HomePage.tsx";
import {
  UserShelves
} from "./components/UserShelves.tsx";
import {
  Shelves
} from "./components/Shelves.tsx";
import {
  ShelfView
} from "./components/ShelfView.tsx";
import {
  LoginPage
} from "./components/Account/LoginPage.tsx";
import {
  RegisterPage
} from "./components/Account/RegisterPage.tsx";
import {
  AccountPage
} from "./components/Account/AccountPage.tsx";

export const routes = {
  root: "/",
  myShelves: "/my-shelves",
  shelf: "/shelf/{0}",
  login: "/login",
  register: "/register",
  userAccount: "/my-account",
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: ErrorPage,
    children: [
      {
        path: "/",
        Component: HomePage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      {
        path: "my-shelves",
        Component: UserShelves,
      },
      {
        path: "my-account",
        Component: AccountPage,
      },
      {
        path: "shelves",
        Component: Shelves,
        children: [
          {
            path: ":id",
            Component: ShelfView,
          },
        ],
      },
    ],
  },
]);