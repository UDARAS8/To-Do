import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "../src/pages/login";
import Register from "../src/pages/Register";
import Dashboard from "../src/pages/Dashboard";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;