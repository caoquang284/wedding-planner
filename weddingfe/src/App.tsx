import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

// Admin Pages
import AdminHome from "./pages/Admin_Home";
import AdminHalls from "./pages/Admin_Hall";
import AdminMenus from "./pages/Admin_Menu";
import AdminServices from "./pages/Admin_Service";
import AdminWedding from "./pages/Admin_Wedding";
import AdminInvoices from "./pages/Admin_Invoice";
import AdminReports from "./pages/Admin_Report";
import AdminPermissions from "./pages/Admin_Permission";
import AdminLogin from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "admin", element: <AdminHome /> },
      { path: "admin/login", element: <AdminLogin /> },
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
  return (
    <AuthProvider> {/* Bao bọc với AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;