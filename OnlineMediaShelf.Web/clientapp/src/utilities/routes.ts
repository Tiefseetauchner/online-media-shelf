import {
  createBrowserRouter
} from "react-router-dom";
import {
  Layout
} from "../components/Layout.tsx";
import {
  ErrorPage
} from "../components/ErrorPage.tsx";
import {
  HomePage
} from "../components/HomePage.tsx";
import {
  Shelves
} from "../components/Shelves/Shelves.tsx";
import {
  ShelfView
} from "../components/Shelves/ShelfView.tsx";
import {
  LoginPage
} from "../components/Account/LoginPage.tsx";
import {
  RegisterPage
} from "../components/Account/RegisterPage.tsx";
import {
  AccountPage
} from "../components/Account/AccountPage.tsx";
import {
  Items
} from "../components/Items/Items.tsx";
import {
  ItemView
} from "../components/Items/ItemView.tsx";
import {
  PrivacyPolicy
} from "../components/PrivacyPolicy.tsx";
import {
  UserView
} from "../components/Users/UserView.tsx";

export const routes = {
  root: "/",
  shelves: "/shelves",
  shelf: (shelfId: string) => `/shelves/${shelfId}`,
  items: "/items",
  item: (itemId: string) => `/items/${itemId}`,
  users: "/users",
  user: (userId: string) => `/users/${userId}`,
  login: "/login",
  register: "/register",
  userAccount: "/my-account",
  privacy: "/privacy-policy",
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
      /*{
        path: "users",
        Component: Users,
      },*/
      {
        path: "users/:userId",
        Component: UserView,
      },
      {
        path: "privacy-policy",
        Component: PrivacyPolicy,
      },
    ],
  },
]);
