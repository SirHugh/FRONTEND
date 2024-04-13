import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoutes = ({ allowedGroup }) => {
  let { user } = useAuth();
  return user?.groups?.find((group) => allowedGroup?.includes(group)) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
