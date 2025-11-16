import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format, isSameDay, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import "react-calendar/dist/Calendar.css";
import api from "../api";

export default function DoctorScheduleCalendar({ onSlotAdded, onSlotDeleted }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month"); // "month" or "week"
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Load existing slots
  const loadSlots = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/schedules/mine");
      setSlots(data?.slots || []);
    } catch (error) {
      console.error("Error loading slots:", error);
      // Don't show error notification on initial load if it's a 401/403 (not authenticated)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        showNotification("Алдаа гарлаа: " + (error.response?.data?.message || error.message), "error");
      }
      setSlots([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  // Get slots for a specific date
  const getSlotsForDate = (date) => {
    if (!slots || !Array.isArray(slots)) return [];
    return slots.filter((slot) => {
      if (!slot || !slot.start) return false;
      try {
        return isSameDay(new Date(slot.start), date);
      } catch (e) {
        return false;
      }
    });
  };

  // Check if a date has slots
  const hasSlots = (date) => {
    return getSlotsForDate(date).length > 0;
  };

  // Get booked slots count for a date
  const getBookedCount = (date) => {
    return getSlotsForDate(date).filter((slot) => slot.booked).length;
  };

  // Add new slot
  const handleAddSlot = async () => {
    if (!startTime || !endTime) {
      showNotification("Цаг сонгоно уу", "error");
      return;
    }

    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    if (endDateTime <= startDateTime) {
      showNotification("Дуусах цаг эхлэх цагаас хойш байх ёстой", "error");
      return;
    }

    try {
      setLoading(true);
      await api.post("/schedules", {
        slots: [{ start: startDateTime.toISOString(), end: endDateTime.toISOString() }],
      });
      showNotification("Цагийн хуваарь амжилттай нэмэгдлээ", "success");
      setShowTimePicker(false);
      setStartTime("09:00");
      setEndTime("10:00");
      await loadSlots();
      if (onSlotAdded) onSlotAdded();
    } catch (error) {
      showNotification("Алдаа гарлаа: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete slot
  const handleDeleteSlot = async (slot, slotIndex) => {
    if (slot.booked) {
      showNotification("Захиалсан цагийг устгах боломжгүй", "error");
      return;
    }

    try {
      setLoading(true);
      // Find the schedule ID first
      const { data: schedule } = await api.get("/schedules/mine");
      if (!schedule || !schedule._id) {
        showNotification("Хуваарь олдсонгүй", "error");
        return;
      }

      await api.delete(`/schedules/${schedule._id}/slot/${slotIndex}`);
      showNotification("Цагийн хуваарь устгагдлаа", "success");
      await loadSlots();
      if (onSlotDeleted) onSlotDeleted();
    } catch (error) {
      showNotification("Алдаа гарлаа: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setLoading(false);
    }
  };

  // Custom tile content for calendar
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateSlots = getSlotsForDate(date);
      const bookedCount = getBookedCount(date);
      const availableCount = dateSlots.length - bookedCount;

      if (dateSlots.length === 0) return null;

      return (
        <div className="mt-1 flex flex-col items-center gap-0.5">
          <div className="text-xs font-semibold text-gray-700">{dateSlots.length}</div>
          {bookedCount > 0 && (
            <div className="w-1 h-1 rounded-full bg-red-500"></div>
          )}
          {availableCount > 0 && (
            <div className="w-1 h-1 rounded-full bg-green-500"></div>
          )}
        </div>
      );
    }
    return null;
  };

  // Custom tile className
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateSlots = getSlotsForDate(date);
      if (dateSlots.length > 0) {
        return "has-slots";
      }
    }
    return null;
  };

  // Get week dates
  const getWeekDates = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  };

  // Generate time slots (30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-4 sm:right-6 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 max-w-sm ${
            notification.type === "success"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
              : "bg-gradient-to-r from-red-500 to-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span className="text-sm sm:text-base font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Цагийн хуваарь</h2>
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("month")}
            className={`px-4 py-2 rounded-md font-semibold transition-all text-sm sm:text-base ${
              view === "month"
                ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Сар
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-4 py-2 rounded-md font-semibold transition-all text-sm sm:text-base ${
              view === "week"
                ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Долоо хоног
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="card">
        {view === "month" ? (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full border-0 bg-transparent"
              />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base"
              >
                ← Өмнөх
              </button>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
                {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), "yyyy-MM-dd")} -{" "}
                {format(endOfWeek(selectedDate, { weekStartsOn: 1 }), "yyyy-MM-dd")}
              </h3>
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base"
              >
                Дараах →
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-2">
                {getWeekDates().map((day, idx) => {
                  const daySlots = getSlotsForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      className={`p-3 rounded-lg border-2 transition-all cursor-pointer min-h-[120px] ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : isToday
                          ? "border-yellow-400 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="text-sm font-semibold text-gray-700 mb-2">
                        {format(day, "EEE")}
                      </div>
                      <div className="text-lg font-bold text-gray-800 mb-2">
                        {format(day, "d")}
                      </div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {daySlots.length === 0 ? (
                          <div className="text-xs text-gray-400">Цаг байхгүй</div>
                        ) : (
                          daySlots.map((slot, slotIdx) => {
                            try {
                              if (!slot || !slot.start || !slot.end) return null;
                              const slotStart = new Date(slot.start);
                              const slotEnd = new Date(slot.end);
                              if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
                                return null;
                              }
                              return (
                                <div
                                  key={slotIdx}
                                  className={`text-xs p-1 rounded mb-1 ${
                                    slot.booked
                                      ? "bg-red-100 text-red-700 border border-red-300"
                                      : "bg-green-100 text-green-700 border border-green-300"
                                  }`}
                                >
                                  {format(slotStart, "HH:mm")} - {format(slotEnd, "HH:mm")}
                                </div>
                              );
                            } catch (e) {
                              console.error("Error rendering week slot:", e);
                              return null;
                            }
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Selected Date Info */}
        <div className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              Сонгосон өдөр: {format(selectedDate, "yyyy-MM-dd, EEEE")}
            </h3>
            <button
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              {showTimePicker ? "Хаах" : "Цаг нэмэх"}
            </button>
          </div>

          {/* Time Picker */}
          {showTimePicker && (
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Эхлэх цаг
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Дуусах цаг
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddSlot}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          )}

          {/* Existing Slots for Selected Date */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Энэ өдрийн цагийн хуваарь:
            </h4>
            {getSlotsForDate(selectedDate).length === 0 ? (
              <p className="text-sm text-gray-500">Цагийн хуваарь байхгүй</p>
            ) : (
              <div className="space-y-2">
                {getSlotsForDate(selectedDate).map((slot, idx) => {
                  try {
                    const slotStart = new Date(slot.start);
                    const slotEnd = new Date(slot.end);
                    // Find the actual index in the full slots array
                    const fullIndex = slots.findIndex(
                      (s) => s && s.start === slot.start && s.end === slot.end
                    );

                    if (isNaN(slotStart.getTime()) || isNaN(slotEnd.getTime())) {
                      return null;
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                          slot.booked
                            ? "bg-red-50 border-red-300"
                            : "bg-green-50 border-green-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              slot.booked ? "bg-red-500" : "bg-green-500"
                            }`}
                          ></div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {format(slotStart, "HH:mm")} - {format(slotEnd, "HH:mm")}
                            </div>
                            <div className="text-xs text-gray-600">
                              {slot.booked ? "Захиалсан" : "Чөлөөтэй"}
                            </div>
                          </div>
                        </div>
                        {!slot.booked && (
                          <button
                            onClick={() => handleDeleteSlot(slot, fullIndex)}
                            disabled={loading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-50"
                          >
                            Устгах
                          </button>
                        )}
                      </div>
                    );
                  } catch (e) {
                    console.error("Error rendering slot:", e);
                    return null;
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

