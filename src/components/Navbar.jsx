import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Өрхийн эмнэлэг
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/services"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/services")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Үйлчилгээ
            </Link>
            <Link
              to="/doctors"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/doctors")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Эмч нар
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {user.role === "patient" && (
                  <Link
                    to="/patient"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive("/patient")
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    Миний самбар
                  </Link>
                )}
                {user.role === "doctor" && (
                  <Link
                    to="/doctor"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive("/doctor")
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    Эмчийн самбар
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive("/admin")
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    Админ
                  </Link>
                )}
                <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
                  <span className="text-sm text-gray-600 hidden sm:inline">{user.name}</span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Гарах
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Нэвтрэх
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                >
                  Бүртгүүлэх
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
