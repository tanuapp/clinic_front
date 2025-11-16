import React, { useEffect, useState } from "react";
import api from "../api";
import DoctorScheduleCalendar from "../components/DoctorScheduleCalendar";

export default function DoctorDashboard() {
  const [appts, setAppts] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("schedule"); // "schedule", "patients", "services"

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadAppts = async () => {
    try {
      const { data } = await api.get("/appointments/doctor/mine");
      setAppts(data || []);
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAppts([]);
    }
  };

  const loadServices = async () => {
    try {
      const [allServicesRes, myProfileRes] = await Promise.all([
        api.get("/services"),
        api.get("/doctors/me"),
      ]);
      setAllServices(allServicesRes.data || []);
      setMyServices(myProfileRes.data?.services || []);
    } catch (error) {
      console.error("Error loading services:", error);
      setAllServices([]);
      setMyServices([]);
    }
  };

  useEffect(() => {
    loadAppts();
    loadServices();
  }, []);

  const updateMyServices = async (serviceIds) => {
    try {
      setLoading(true);
      await api.put("/doctors/me/services", { serviceIds });
      showNotification("Үйлчилгээ амжилттай шинэчлэгдлээ", "success");
      await loadServices();
    } catch (error) {
      showNotification("Алдаа гарлаа: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId) => {
    const isSelected = myServices.some((s) => s._id === serviceId || s === serviceId);
    let newServices;
    if (isSelected) {
      newServices = myServices.filter((s) => (s._id || s) !== serviceId);
    } else {
      newServices = [...myServices, serviceId];
    }
    updateMyServices(newServices.map((s) => s._id || s));
  };

  const saveAppt = async (a) => {
    await api.put(`/appointments/doctor/${a._id}`, {
      diagnosis: a.diagnosis,
      notes: a.notes,
      status: a.status,
      nextVisitAt: a.nextVisitAt,
    });
    loadAppts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Эмчийн самбар</h1>
          <p className="text-gray-600">Цагийн хуваарь, өвчтөнүүд, үйлчилгээ удирдах</p>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-sm ${
              notification.type === "success"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "schedule"
                  ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              📅 Цагийн хуваарь
            </button>
            <button
              onClick={() => setActiveTab("patients")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "patients"
                  ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              👥 Миний өвчтөнүүд ({appts.length})
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "services"
                  ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              ⚕️ Миний үйлчилгээнүүд
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "schedule" && (
          <DoctorScheduleCalendar onSlotAdded={loadAppts} onSlotDeleted={loadAppts} />
        )}

        {activeTab === "patients" && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Миний өвчтөнүүд</h2>
            {appts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <p className="text-gray-600 text-lg">Одоогоор өвчтөн байхгүй байна</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appts.map((a) => {
                  const startDate = new Date(a.start);
                  const isPast = startDate < new Date();
                  const isToday = startDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={a._id}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        isPast && a.status === "booked"
                          ? "border-gray-300 bg-gray-50"
                          : "border-blue-200 bg-white hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {a.patient?.name}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                a.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : a.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {a.status === "completed"
                                ? "Дууссан"
                                : a.status === "cancelled"
                                ? "Цуцлагдсан"
                                : "Захиалсан"}
                            </span>
                          </div>
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">⚕️</span>
                              <span className="font-medium">{a.service?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🕐</span>
                              <span className="font-medium">
                                {isToday ? "Өнөөдөр" : startDate.toLocaleDateString("mn-MN", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  weekday: "long",
                                })}{" "}
                                {startDate.toLocaleTimeString("mn-MN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Онош
                          </label>
                          <textarea
                            placeholder="Онош оруулах..."
                            defaultValue={a.diagnosis || ""}
                            onChange={(e) => (a.diagnosis = e.target.value)}
                            className="w-full min-h-[80px]"
                            rows="3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Тэмдэглэл
                          </label>
                          <textarea
                            placeholder="Тэмдэглэл оруулах..."
                            defaultValue={a.notes || ""}
                            onChange={(e) => (a.notes = e.target.value)}
                            className="w-full min-h-[80px]"
                            rows="3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Төлөв
                          </label>
                          <select
                            defaultValue={a.status}
                            onChange={(e) => (a.status = e.target.value)}
                            className="w-full"
                          >
                            <option value="booked">Захиалсан</option>
                            <option value="completed">Дууссан</option>
                            <option value="cancelled">Цуцлагдсан</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📅 Дараагийн эмчилгээний цаг
                          </label>
                          <div className="relative">
                            <input
                              type="datetime-local"
                              defaultValue={a.nextVisitAt ? a.nextVisitAt.substring(0, 16) : ""}
                              onChange={(e) => (a.nextVisitAt = e.target.value)}
                              className="w-full pr-10"
                            />
                            {a.nextVisitAt && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-xs text-green-700">
                                  Дараагийн үзлэг: {new Date(a.nextVisitAt).toLocaleDateString("mn-MN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary mt-4 w-full md:w-auto"
                        onClick={() => saveAppt(a)}
                      >
                        💾 Хадгалах
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "services" && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Миний үйлчилгээнүүд</h2>
            <p className="text-sm text-gray-600 mb-6">
              Та өөрт тохирох үйлчилгээнүүдийг сонгоно уу. Эдгээр үйлчилгээнүүдийг танд захиалга өгөх боломжтой болно.
            </p>
            {allServices.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">⚕️</div>
                <p className="text-gray-600 text-lg">
                  Одоогоор үйлчилгээ байхгүй байна. Админ үйлчилгээ нэмэх хэрэгтэй.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allServices.map((service) => {
                  const isSelected = myServices.some(
                    (s) => (s._id || s) === service._id
                  );
                  return (
                    <div
                      key={service._id}
                      onClick={() => toggleService(service._id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-50 shadow-lg transform scale-105"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-2">{service.name}</h3>
                          {service.description && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>⏱️ {service.durationMin || 30} мин</span>
                            <span>💰 {service.fee || 0}₮</span>
                          </div>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 flex-shrink-0 ${
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {loading && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}