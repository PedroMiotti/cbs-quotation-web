import { Navigate, Outlet } from "react-router-dom";
import SidebarWithHeader from "./HeaderWithSidebar";

interface PrivateRouteProps {
  hasDefaultLayout: boolean;
}

function PrivateRoute({ hasDefaultLayout }: PrivateRouteProps) {
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  if (hasDefaultLayout)
    return (
      <SidebarWithHeader>
        <Outlet />
      </SidebarWithHeader>
    );
  else return <Outlet />;
}

export default PrivateRoute;
