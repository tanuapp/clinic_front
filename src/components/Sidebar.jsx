import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar(){
  const { user, logout } = useAuth();
  return (
    <aside className="sidebar w-64 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Эмнэлэг</h2>
      <nav className="space-y-2">
        <Link to="/" className="block">Нүүр</Link>
        <Link to="/patient" className="block">Өвчтөн</Link>
        <Link to="/doctor" className="block">Эмч</Link>
        <Link to="/admin" className="block">Админ</Link>
        <Link to="/admin/reports" className="block">Тайлан</Link>
        {user ? (
          <>
            {user.role === "patient" && <Link to="/patient" className="link">Цаг захиалах</Link>}
            {user.role === "doctor" && <Link to="/doctor" className="link">Цагийн хуваарь</Link>}
            {user.role === "admin" && <Link to="/admin" className="link">Админ</Link>}
            {user.role === "admin" && <Link to="/admin/reports" className="link">Тайлан</Link>}
            <button className="btn" onClick={logout}>Гарах</button>
          </>
        ) : (
          <>
              <Link className="btn" to="/login">Нэвтрэх</Link>
              <Link className="btn" to="/register">Бүртгүүлэх</Link>
            </>
          )}
      </nav>
    </aside>
  );
}