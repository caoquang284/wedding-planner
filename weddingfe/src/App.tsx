import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";

// User Pages
import UserHome from "./pages/User/User_Home";
import UserMenus from "./pages/User/User_Menu";
import UserServices from "./pages/User/User_Service";
import UserBooking from "./pages/User/User_Booking";
import UserInvoices from "./pages/User/User_Invoice";
import UserHall from "./pages/User/User_Hall";
// Admin Pages
import AdminHome from "./pages/Admin/Admin_Home";
import AdminHalls from "./pages/Admin/Admin_Hall";
import AdminMenus from "./pages/Admin/Admin_Menu";
import AdminServices from "./pages/Admin/Admin_Service";
import AdminWedding from "./pages/Admin/Admin_Wedding";
import AdminInvoices from "./pages/Admin/Admin_Invoice";
import AdminReports from "./pages/Admin/Admin_Report";
import AdminPermissions from "./pages/Admin/Admin_Permission";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // User routes
      { index: true, element: <UserHome /> },
      { path: "user/menus", element: <UserMenus /> },
      { path: "user/services", element: <UserServices /> },
      { path: "user/booking", element: <UserBooking /> },
      { path: "user/invoices", element: <UserInvoices /> },
      { path: "user/halls", element: <UserHall /> },

      // Admin routes
      { path: "admin", element: <AdminHome /> },
      { path: "admin/halls", element: <AdminHalls /> },
      { path: "admin/menus", element: <AdminMenus /> },
      { path: "admin/services", element: <AdminServices /> },
      { path: "admin/invoices", element: <AdminInvoices /> },
      { path: "admin/reports", element: <AdminReports /> },
      { path: "admin/permissions", element: <AdminPermissions /> },
      { path: "admin/wedding", element: <AdminWedding /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
