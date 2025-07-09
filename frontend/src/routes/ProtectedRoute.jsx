import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ user, allowedRoles, onLogout, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  allowedRoles: PropTypes.array.isRequired,
  onLogout: PropTypes.func,
  children: PropTypes.node,
};

export default ProtectedRoute;