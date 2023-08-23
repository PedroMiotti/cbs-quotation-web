import { Navigate, Outlet } from "react-router-dom";
import SidebarWithHeader from "./HeaderWithSidebar";

interface PrivateRouteProps {
  hasDefaultLayout: boolean;
}

function PrivateRoute({ hasDefaultLayout }: PrivateRouteProps) {
  const isAuthenticated = true; // Todo add real check for authenticated
  //localStorage.getItem('accessToken');

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (hasDefaultLayout)
    return (
      <SidebarWithHeader>
        <Outlet />
      </SidebarWithHeader>
    );
  else return <Outlet />;
}

export default PrivateRoute;
