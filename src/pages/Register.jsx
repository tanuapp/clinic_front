import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
    registerNumber: "", 
    email: "", 
    password: "", 
    role: "patient" 
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { register } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Бүртгүүлэхэд алдаа гарлаа");
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
              <span className="text-4xl">👤</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Бүртгүүлэх</h1>
            <p className="text-gray-600">Шинэ бүртгэл үүсгэх</p>
          </div>

          {err && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              ❌ {err}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Нэр <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Таны нэр"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Регистрийн дугаар
              </label>
              <input
                value={form.registerNumber}
                onChange={(e) => setForm({...form, registerNumber: e.target.value})}
                placeholder="РД12345678"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Имэйл хаяг <span className="text-red-500">*</span>
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="name@example.com"
                type="email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Нууц үг <span className="text-red-500">*</span>
              </label>
              <input
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="Хамгийн багадаа 6 тэмдэгт"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Бүртгэлийн төрөл <span className="text-red-500">*</span>
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({...form, role: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              >
                <option value="patient">Өвчтөн</option>
                <option value="doctor">Эмч</option>
              </select>
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
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Аль хэдийн бүртгэлтэй юу?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">
                Нэвтрэх
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
