import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getUserType } from "../../utils/authService";

/**
 * A protected route component that checks if user is authenticated
 * and has the correct role before rendering children
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const userType = getUserType();

  // Check if user is authenticated and has the correct role (if roles are specified)
  const hasAccess =
    isAuth && (allowedRoles.length === 0 || allowedRoles.includes(userType));

  useEffect(() => {
    if (!isAuth) {
      console.log("User not authenticated, redirecting to login");
    } else if (!hasAccess) {
      console.log(`User role ${userType} not authorized for this route`);
    }
  }, [isAuth, hasAccess, userType]);

  if (!isAuth) {
    // Redirect to login, save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAccess) {
    // If authenticated but wrong role, redirect to homepage
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
