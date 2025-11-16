import { Link, useNavigate } from "react-router-dom";

export default function AppLayout({ user, children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = {
    admin: [
      { to: "/admin", label: "Хянах самбар" },
      { to: "/manage/doctors", label: "Эмч нар" },
      { to: "/manage/patients", label: "Өвчтөнүүд" },
      { to: "/manage/services", label: "Үйлчилгээ" },
      { to: "/reports", label: "Тайлан" },
    ],
    doctor: [
      { to: "/doctor/schedule", label: "Цагийн хуваарь" },
      { to: "/doctor/patients", label: "Өвчтөнүүд" },
      { to: "/doctor/records", label: "Онош бичих" },
    ],
    patient: [
      { to: "/patient/book", label: "Цаг захиалах" },
      { to: "/patient/history", label: "Миний үзлэг" },
      { to: "/patient/notifications", label: "Мэдэгдэл" },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-gray-800">
      {/* NAVIGATION */}
      <nav className="flex items-center justify-between bg-primary text-white px-6 py-3 shadow-lg">
        <h1 className="text-xl font-bold">🏥 Clinic Booking System</h1>

        <ul className="flex gap-4">
          {navItems[user?.role || "patient"].map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="hover:text-secondary transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="bg-secondary px-3 py-1 rounded hover:bg-accent"
        >
          Гарах
        </button>
      </nav>

      {/* CONTENT */}
      <main className="p-6">{children}</main>
    </div>
  );
}