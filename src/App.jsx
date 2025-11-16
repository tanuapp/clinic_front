import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/patient" element={
          <ProtectedRoute roles={["patient"]}><PatientDashboard /></ProtectedRoute>
        }/>
        <Route path="/doctor" element={
          <ProtectedRoute roles={["doctor"]}><DoctorDashboard /></ProtectedRoute>
        }/>
        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
        }/>
      </Routes>
    </AuthProvider>
  );
}