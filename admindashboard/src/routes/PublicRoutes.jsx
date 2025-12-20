import { isAuthenticated } from "@/utils/auth";
import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoutes = ({ children }) => {
  if (isAuthenticated()) {
   return <Navigate to="/" replace />;
  }
  return children;
};
export default PublicRoutes;
