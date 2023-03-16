import React from 'react';
import { Navigate, useNavigate } from "react-router-dom";

export default function YourComponent() {
    return (
      <Navigate to="/home" />
    );
}