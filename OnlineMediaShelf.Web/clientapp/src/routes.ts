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
  Shelves
} from "./components/Shelves/Shelves.tsx";
import {
  ShelfView
} from "./components/Shelves/ShelfView.tsx";
import {
  LoginPage
} from "./components/Account/LoginPage.tsx";
import {
  RegisterPage
} from "./components/Account/RegisterPage.tsx";
import {
  AccountPage
} from "./components/Account/AccountPage.tsx";
import {
  UserShelves
} from "./components/Account/UserShelves.tsx";
import {
  Items
} from "./components/Items/Items.tsx";
import {
  ItemView
} from "./components/Items/ItemView.tsx";

export const routes = {
  root: "/",
  myShelves: "/my-shelves",
  shelf: "/shelves",
  item: "/items",
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
      },
      {
        path: "shelves/:shelfId",
        Component: ShelfView,
      },
      {
        path: "items",
        Component: Items,
      },
      {
        path: "items/:itemId",
        Component: ItemView,
      },
    ],
  },
]);