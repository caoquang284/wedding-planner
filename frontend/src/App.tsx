import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Halls from "./pages/Halls";
import Search from "./pages/Search";
import Menus from "./pages/Menus";
import Booking from "./pages/Booking";
import Invoices from "./pages/Invoices";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/halls", element: <Halls /> },
      { path: "/menus", element: <Menus /> },
      { path: "/booking", element: <Booking /> },
      { path: "/invoices", element: <Invoices /> },
      { path: "/admin", element: <Admin /> },
      { path: "/login", element: <Login /> },
      { path: "/SignUp", element: <SignUp /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;