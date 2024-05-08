import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import {
  Shelves
} from "./components/Shelves.tsx";
import {
  HomePage
} from "./components/HomePage.tsx";
import {
  UserShelves
} from "./components/UserShelves.tsx";
import {
  ShelfView
} from "./components/ShelfView.tsx";
import {
  Layout
} from "./components/Layout.tsx";
import {
  ErrorPage
} from "./components/ErrorPage.tsx";

export const routes = {
  root: "/",
  myShelves: "/my-shelves",
  shelf: "/shelf/:shelfId"
};

function App() {

  const router = createBrowserRouter([
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
          path: "my-shelves",
          Component: UserShelves,
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

  return (
    <RouterProvider
      router={router}>
    </RouterProvider>);
}

export default App
