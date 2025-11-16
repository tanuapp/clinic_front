import React, { useEffect, useState } from "react";
import api from "../api";

export default function PatientDashboard() {
  const [services, setServices] = useState([]);
  const [docs, setDocs] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState({ 
    serviceId: "", 
    doctorId: "", 
    slotStart: "",
    date: ""
  });
  const [slots, setSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("book"); // "book" or "my-appointments"

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [servicesRes, docsRes] = await Promise.all([
        api.get("/services"),
        api.get("/doctors")
      ]);
      setServices(servicesRes.data);
      setDocs(docsRes.data);
      refreshMine();
    } catch (err) {
      setMessage("Алдаа гарлаа: " + (err.response?.data?.message || err.message));
    }
  };

  const refreshMine = () => {
    api.get("/appointments/mine")
      .then(r => setAppointments(r.data.sort((a, b) => new Date(a.start) - new Date(b.start))))
      .catch(err => setMessage("Цагуудыг ачаалахад алдаа гарлаа"));
  };

  const loadSlots = async (doctorId, date) => {
    if (!doctorId) {
      setSlots([]);
      setAvailableDates([]);
      return;
    }
    try {
      const { data } = await api.get(`/schedules/doctor/${doctorId}`);
      const allAvailableSlots = (data.slots || [])
        .filter(s => !s.booked)
        .filter(s => {
          const slotDate = new Date(s.start);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return slotDate >= today;
        })
        .sort((a, b) => new Date(a.start) - new Date(b.start));

      // Extract unique dates that have available slots
      const datesWithSlots = new Set();
      allAvailableSlots.forEach(slot => {
        const slotDate = new Date(slot.start).toISOString().split('T')[0];
        datesWithSlots.add(slotDate);
      });
      setAvailableDates(Array.from(datesWithSlots).sort());

      // Filter slots for selected date
      if (date) {
        const filteredSlots = allAvailableSlots.filter(s => {
          const slotDate = new Date(s.start).toISOString().split('T')[0];
          return slotDate === date;
        });
        setSlots(filteredSlots);
      } else {
        setSlots([]);
      }
    } catch (err) {
      setSlots([]);
      setAvailableDates([]);
      setMessage("Цагийн хуваарийг ачаалахад алдаа гарлаа");
    }
  };

  const handleDoctorChange = (doctorId) => {
    setSelected({ ...selected, doctorId, slotStart: "", date: "" });
    if (doctorId) {
      loadSlots(doctorId, null);
    } else {
      setSlots([]);
      setAvailableDates([]);
    }
  };

  const handleDateChange = (date) => {
    setSelected({ ...selected, date, slotStart: "" });
    if (selected.doctorId && date) {
      loadSlots(selected.doctorId, date);
    }
  };

  const book = async () => {
    if (!selected.serviceId || !selected.doctorId || !selected.slotStart) {
      setMessage("Бүх талбарыг бөглөнө үү");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await api.post("/appointments", {
        serviceId: selected.serviceId,
        doctorId: selected.doctorId,
        slotStart: selected.slotStart
      });
      setMessage("✅ Цаг амжилттай захиалагдлаа!");
      setSelected({ serviceId: "", doctorId: "", slotStart: "", date: "" });
      setSlots([]);
      refreshMine();
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setMessage("❌ " + (e.response?.data?.message || "Алдаа гарлаа"));
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id) => {
    if (!confirm("Та энэ цагийг цуцлахдаа итгэлтэй байна уу?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      setMessage("✅ Цаг цуцлагдлаа");
      refreshMine();
      if (selected.doctorId) loadSlots(selected.doctorId, selected.date);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Алдаа гарлаа"));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "booked": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "booked": return "Захиалагдсан";
      case "completed": return "Дууссан";
      case "cancelled": return "Цуцлагдсан";
      default: return status;
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = d.toDateString() === today.toDateString();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isTomorrow = d.toDateString() === tomorrow.toDateString();
    
    if (isToday) return "Өнөөдөр";
    if (isTomorrow) return "Маргааш";
    
    return d.toLocaleDateString('mn-MN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Миний самбар</h1>
          <p className="text-gray-600">Цаг захиалах, миний цагуудыг харах</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("book")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "book"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Цаг захиалах
            </button>
            <button
              onClick={() => setActiveTab("my-appointments")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "my-appointments"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Миний цагууд ({appointments.length})
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes("✅") 
              ? "bg-green-50 text-green-800 border border-green-200" 
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        {/* Booking Form */}
        {activeTab === "book" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Цаг захиалах</h2>
            
            <div className="space-y-6">
              {/* Step 1: Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  1. Үйлчилгээ сонгох <span className="text-red-500">*</span>
                </label>
                <select
                  value={selected.serviceId}
                  onChange={(e) => {
                    setSelected({ 
                      serviceId: e.target.value, 
                      doctorId: "", 
                      slotStart: "", 
                      date: "" 
                    });
                    setSlots([]);
                    setAvailableDates([]);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                >
                  <option value="">Үйлчилгээ сонгох...</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} {s.durationMin ? `(${s.durationMin} мин)` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Doctor Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  2. Эмч сонгох <span className="text-red-500">*</span>
                </label>
                {!selected.serviceId ? (
                  <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-600">
                    Эхлээд үйлчилгээ сонгоно уу
                  </div>
                ) : (
                  <>
                    <select
                      value={selected.doctorId}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    >
                      <option value="">Эмч сонгох...</option>
                      {docs
                        .filter(d => {
                          // Filter doctors who have the selected service
                          if (!selected.serviceId) return true;
                          return d.services && d.services.some(s => 
                            (s._id || s) === selected.serviceId
                          );
                        })
                        .map(d => (
                          <option key={d._id} value={d._id}>
                            {d.name} {d.specialization ? `- ${d.specialization}` : ""}
                          </option>
                        ))}
                    </select>
                    {docs.filter(d => {
                      if (!selected.serviceId) return false;
                      return d.services && d.services.some(s => 
                        (s._id || s) === selected.serviceId
                      );
                    }).length === 0 && (
                      <p className="mt-2 text-sm text-yellow-600">
                        ⚠️ Энэ үйлчилгээг үзүүлдэг эмч байхгүй байна
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Step 3: Date Selection */}
              {selected.doctorId && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    3. Огноо сонгох <span className="text-red-500">*</span>
                  </label>
                  {availableDates.length === 0 ? (
                    <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-yellow-800">
                      <p className="font-semibold mb-1">⚠️ Энэ эмчид чөлөөт цаг байхгүй байна</p>
                      <p className="text-sm">Өөр эмч эсвэл дараа дахин шалгана уу.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {availableDates.map(date => {
                        const isSelected = selected.date === date;
                        return (
                          <button
                            key={date}
                            type="button"
                            onClick={() => handleDateChange(date)}
                            className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all text-sm ${
                              isSelected
                                ? "border-blue-500 bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg transform scale-105"
                                : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
                            }`}
                          >
                            {formatDate(date)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Time Slot Selection */}
              {selected.date && slots.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    4. Цаг сонгох <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {slots.map((slot, idx) => {
                      const slotDate = new Date(slot.start);
                      const slotEnd = new Date(slot.end);
                      const timeStr = slotDate.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' });
                      const endTimeStr = slotEnd.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' });
                      const isSelected = selected.slotStart === slot.start;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelected({ ...selected, slotStart: slot.start })}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition-all text-sm ${
                            isSelected
                              ? "border-green-500 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105"
                              : "border-gray-300 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50 hover:shadow-md"
                          }`}
                        >
                          <div className="font-bold">{timeStr}</div>
                          <div className="text-xs opacity-75">{endTimeStr}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {selected.date && slots.length === 0 && selected.doctorId && availableDates.length > 0 && (
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-yellow-800">
                  <p className="font-semibold">⚠️ Энэ өдөр чөлөөт цаг байхгүй байна</p>
                  <p className="text-sm mt-1">Дээрх огноонуудаас өөр өдөр сонгоно уу.</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={book}
                  disabled={!selected.serviceId || !selected.doctorId || !selected.slotStart || loading}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-all ${
                    !selected.serviceId || !selected.doctorId || !selected.slotStart || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? "Захиалж байна..." : "✅ Цаг захиалах"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* My Appointments */}
        {activeTab === "my-appointments" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Миний цагууд</h2>
            
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <p className="text-gray-600 text-lg">Одоогоор захиалсан цаг байхгүй байна</p>
                <button
                  onClick={() => setActiveTab("book")}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Цаг захиалах
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map(appt => {
                  const startDate = new Date(appt.start);
                  const isPast = startDate < new Date();
                  const isToday = startDate.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={appt._id}
                      className={`border-2 rounded-xl p-6 transition-all ${
                        isPast && appt.status === "booked"
                          ? "border-gray-300 bg-gray-50"
                          : "border-blue-200 bg-blue-50 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {appt.service?.name || "Үйлчилгээ"}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appt.status)}`}>
                              {getStatusText(appt.status)}
                            </span>
                          </div>
                          
                          <div className="space-y-2 text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">👨‍⚕️</span>
                              <span className="font-medium">Эмч: {appt.doctor?.name || "Тодорхойгүй"}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🕐</span>
                              <span className="font-medium">
                                {isToday ? "Өнөөдөр" : startDate.toLocaleDateString('mn-MN', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric',
                                  weekday: 'long'
                                })}
                                {" "}
                                {startDate.toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            
                            {appt.nextVisitAt && (
                              <div className="flex items-center gap-2 text-green-700">
                                <span className="text-lg">📅</span>
                                <span className="font-medium">
                                  Дараагийн үзлэг: {new Date(appt.nextVisitAt).toLocaleDateString('mn-MN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                            )}
                            
                            {appt.diagnosis && (
                              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Оношлогоо:</p>
                                <p className="text-gray-600">{appt.diagnosis}</p>
                              </div>
                            )}
                            
                            {appt.notes && (
                              <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Тэмдэглэл:</p>
                                <p className="text-gray-600">{appt.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {appt.status === "booked" && !isPast && (
                            <button
                              onClick={() => cancel(appt._id)}
                              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition whitespace-nowrap"
                            >
                              Цуцлах
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
