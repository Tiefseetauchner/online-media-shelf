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

export const routes = {
  root: "/",
  shelf: "/shelves",
  item: "/items",
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
      {
        path: "privacy-policy",
        Component: PrivacyPolicy,
      },
    ],
  },
]);

export function navigateToItem(itemId: number | undefined, navigate: (to: string) => void) {
  navigate(`${routes.item}/${itemId}`);
}