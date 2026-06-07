import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import { CreateTest, AddQuestions, PreviewPublish } from "../pages/tests";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tests/create" element={<CreateTest />} />
            <Route path="/tests/:id/edit" element={<CreateTest />} />

            <Route path="/tests/:id/questions" element={<AddQuestions />} />
            <Route path="/tests/:id/preview" element={<PreviewPublish />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;