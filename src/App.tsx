import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./Pages/Home";
import Bookmark from "./Pages/Bookmark";
import AppLayout from "./Pages/AppLayout";
import { QueryClient, QueryClientProvider } from "react-query";
import { LoaderProvider } from "./Context/LoaderContext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { AuthProvider } from "./Context/AuthContext";
import { BookmarkProvider } from "./Context/BookmarkContext";
import { DefinitionFinderProvider } from "./Context/DefinitionFinderContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/app/home"} />,
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "bookmark",
        element: <Bookmark />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoaderProvider>
          <BookmarkProvider>
            <DefinitionFinderProvider>
              <RouterProvider router={router} />
            </DefinitionFinderProvider>
          </BookmarkProvider>
        </LoaderProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
