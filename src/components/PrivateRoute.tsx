import { Navigate } from "react-router-dom";
import SidebarWithHeader from "./HeaderWithSidebar";

interface PrivateRouteProps {
  hasDefaultLayout: boolean;
  children: React.ReactNode;
}

function PrivateRoute({ hasDefaultLayout, children }: PrivateRouteProps) {
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  if (hasDefaultLayout)
    return (
      <SidebarWithHeader>
        {children}
      </SidebarWithHeader>
    );
  else return <>{children}</>;
}

export default PrivateRoute;
