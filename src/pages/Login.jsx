import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-4">
              <span className="text-4xl">🏥</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Нэвтрэх</h1>
            <p className="text-gray-600">Таны бүртгэлд нэвтрэнэ үү</p>
          </div>

          {err && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              ❌ {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Имэйл хаяг
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                type="email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Нууц үг
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Бүртгэлгүй юу?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700">
                Бүртгүүлэх
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
