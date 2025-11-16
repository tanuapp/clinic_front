import React, { useEffect, useState } from "react";
import api from "../api";

// Doctor Service Assignment Component
function DoctorServiceAssignment({
  doctor,
  allServices,
  onUpdate,
  showNotification,
}) {
  const [doctorServices, setDoctorServices] = useState(doctor.services || []);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleService = (serviceId) => {
    const isSelected = doctorServices.some((s) => (s._id || s) === serviceId);
    let newServices;
    if (isSelected) {
      newServices = doctorServices.filter((s) => (s._id || s) !== serviceId);
    } else {
      newServices = [...doctorServices, serviceId];
    }
    setDoctorServices(newServices);
  };

  const saveServices = async () => {
    try {
      setLoading(true);
      await api.put(`/admin/users/${doctor._id}/services`, {
        serviceIds: doctorServices.map((s) => s._id || s),
      });
      showNotification(
        `${doctor.name} эмчийн үйлчилгээ амжилттай шинэчлэгдлээ`,
        "success"
      );
      onUpdate();
    } catch (error) {
      showNotification(
        "Алдаа гарлаа: " + (error.response?.data?.message || error.message),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{doctor.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">{doctor.email}</span>
            {doctor.specialization && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                {doctor.specialization}
              </span>
            )}
            <span className="text-sm text-gray-500">
              ({doctorServices.length} үйлчилгээ)
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 btn btn-primary  text-whiterounded-lg font-semibold hover:bg-gray-300 transition text-sm"
        >
          {isExpanded ? "Хаах" : "Үйлчилгээ хуваарилах"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {allServices.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Одоогоор үйлчилгээ байхгүй байна
            </p>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {allServices.map((service) => {
                  const isSelected = doctorServices.some(
                    (s) => (s._id || s) === service._id
                  );
                  return (
                    <div
                      key={service._id}
                      onClick={() => toggleService(service._id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {service.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>⏱️ {service.durationMin || 30} мин</span>
                            <span>💰 {service.fee || 0}₮</span>
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-2 ${
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
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
              <button
                onClick={saveServices}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Edit Service Form Component
function EditServiceForm({ service, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: service.name || "",
    description: service.description || "",
    durationMin: service.durationMin || 30,
    fee: service.fee || 0,
  });

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="space-y-3">
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full text-sm"
        placeholder="Нэр"
      />
      <input
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full text-sm"
        placeholder="Тайлбар"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={form.durationMin}
          onChange={(e) =>
            setForm({ ...form, durationMin: Number(e.target.value) || 30 })
          }
          className="w-full text-sm"
          placeholder="Минут"
        />
        <input
          type="number"
          value={form.fee}
          onChange={(e) =>
            setForm({ ...form, fee: Number(e.target.value) || 0 })
          }
          className="w-full text-sm"
          placeholder="Төлбөр"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
        >
          Хадгалах
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition"
        >
          Цуцлах
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [svcForm, setSvcForm] = useState({
    name: "",
    description: "",
    durationMin: 30,
    fee: 0,
  });
  const [appts, setAppts] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const load = async () => {
    try {
      const u = await api.get("/admin/users");
      setUsers(u.data);
      const s = await api.get("/services");
      setServices(s.data);
      const a = await api.get("/admin/appointments");
      setAppts(a.data);
    } catch (error) {
      console.error("Error loading data:", error);
      showNotification("Мэдээлэл ачаалахад алдаа гарлаа", "error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addService = async () => {
    if (!svcForm.name.trim()) {
      showNotification("Үйлчилгээний нэрийг оруулна уу", "error");
      return;
    }
    try {
      await api.post("/services", svcForm);
      setSvcForm({ name: "", description: "", durationMin: 30, fee: 0 });
      showNotification("Үйлчилгээ амжилттай нэмэгдлээ", "success");
      load();
    } catch (error) {
      showNotification(
        "Алдаа гарлаа: " + (error.response?.data?.message || error.message),
        "error"
      );
    }
  };

  const updateService = async (id, data) => {
    try {
      await api.put(`/services/${id}`, data);
      showNotification("Үйлчилгээ амжилттай шинэчлэгдлээ", "success");
      setEditingService(null);
      load();
    } catch (error) {
      showNotification(
        "Алдаа гарлаа: " + (error.response?.data?.message || error.message),
        "error"
      );
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Энэ үйлчилгээг устгахдаа итгэлтэй байна уу?")) return;
    try {
      await api.delete(`/services/${id}`);
      showNotification("Үйлчилгээ устгагдлаа", "success");
      load();
    } catch (error) {
      showNotification(
        "Алдаа гарлаа: " + (error.response?.data?.message || error.message),
        "error"
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
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

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Үйлчилгээ удирдах
          </h2>
        </div>

        {/* Add Service Form */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Шинэ үйлчилгээ нэмэх
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Үйлчилгээний нэр *
              </label>
              <input
                placeholder="Жишээ: Эмнэлгийн үзлэг"
                value={svcForm.name}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, name: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Тайлбар
              </label>
              <input
                placeholder="Үйлчилгээний тайлбар"
                value={svcForm.description}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, description: e.target.value })
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Үргэлжлэх хугацаа (минут)
              </label>
              <input
                type="number"
                placeholder="30"
                value={svcForm.durationMin}
                onChange={(e) =>
                  setSvcForm({
                    ...svcForm,
                    durationMin: Number(e.target.value) || 30,
                  })
                }
                className="w-full"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Төлбөр (₮)
              </label>
              <input
                type="number"
                placeholder=""
                value={svcForm.fee === 0 ? "" : svcForm.fee}
                onChange={(e) =>
                  setSvcForm({
                    ...svcForm,
                    fee: e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
                className="w-full"
                min="0"
              />
            </div>
          </div>
          <button className="btn btn-primary mt-4" onClick={addService}>
            Үйлчилгээ нэмэх
          </button>
        </div>

        {/* Services List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Бүх үйлчилгээнүүд
          </h3>
          {services.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Одоогоор үйлчилгээ байхгүй байна
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div
                  key={s._id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                >
                  {editingService === s._id ? (
                    <EditServiceForm
                      service={s}
                      onSave={(data) => updateService(s._id, data)}
                      onCancel={() => setEditingService(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-gray-800">
                          {s.name}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingService(s._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                          >
                            Засах
                          </button>
                          <button
                            onClick={() => deleteService(s._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                          >
                            Устгах
                          </button>
                        </div>
                      </div>
                      {s.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {s.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <span className="text-sm text-gray-600">
                          ⏱️ {s.durationMin || 30} минут
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          {s.fee || 0}₮
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Doctors and Service Assignment */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Эмч нар ба үйлчилгээ хуваарилалт
        </h2>
        {users.filter((u) => u.role === "doctor").length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Одоогоор эмч бүртгэгдээгүй байна
          </p>
        ) : (
          <div className="space-y-4">
            {users
              .filter((u) => u.role === "doctor")
              .map((doctor) => (
                <DoctorServiceAssignment
                  key={doctor._id}
                  doctor={doctor}
                  allServices={services}
                  onUpdate={load}
                  showNotification={showNotification}
                />
              ))}
          </div>
        )}
      </div>

      {/* Other Users */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Бусад хэрэглэгчид
        </h2>
        {users.filter((u) => u.role !== "doctor").length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Бусад хэрэглэгч байхгүй байна
          </p>
        ) : (
          <div className="space-y-2">
            {users
              .filter((u) => u.role !== "doctor")
              .map((u) => (
                <div
                  key={u._id}
                  className="border-2 border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-800">
                        {u.name}
                      </span>
                      <span className="text-gray-600 ml-2">— {u.email}</span>
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                        {u.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Бүх цаг захиалга</h2>
        <div className="space-y-1">
          {appts.map((a) => (
            <div key={a._id} className="border rounded p-2">
              {new Date(a.start).toLocaleString()} — {a.patient?.name} /{" "}
              {a.doctor?.name} / {a.service?.name} ({a.status})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
