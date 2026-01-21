import { createBrowserRouter } from "react-router-dom";

import App from "../src/App";

// public pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import NotFound from "../pages/NotFound";
import Unauthorized from "../pages/Unauthorized";
import NewsDetails from "../pages/public/NewsDetails";

// admin pages
import AdminDashboard from "../pages/admin/Dashboard";

// journalist pages
import CreateNews from "../pages/journalist/CreateNews";
import JournalistDashboard from "../pages/journalist/Dashboard";
import EditNews from "../pages/journalist/EditNews";

// favorites pages
import UserFavorites from "../pages/user/Favorites";
import JournalistFavorites from "../pages/journalist/Favorites";

// route guards
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      // ===== PUBLIC =====
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "news/:id", element: <NewsDetails /> },

      // ===== PROTECTED (any logged-in user) =====
      {
        element: <ProtectedRoute />,
        children: [
          // ✅ user favorites
          { path: "favorites", element: <UserFavorites /> },

          // ===== ADMIN ONLY =====
          {
            element: <RoleRoute allow={["admin"]} />,
            children: [{ path: "admin", element: <AdminDashboard /> }],
          },

          // ===== JOURNALIST / ADMIN =====
          {
            element: <RoleRoute allow={["journalist"]} />,
            children: [
              { path: "journalist", element: <JournalistDashboard /> },
              { path: "journalist/new", element: <CreateNews /> },
              { path: "journalist/edit/:id", element: <EditNews /> },

              // ✅ journalist favorites
              { path: "journalist/favorites", element: <JournalistFavorites /> },
            ],
          },
        ],
      },

      // ===== 404 =====
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
