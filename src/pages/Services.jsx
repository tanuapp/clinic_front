import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services")
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Ачааллаж байна...</p>
          </div>
        </div>
      </div>
    );
  }

  const serviceIcons = {
    "Эмнэлгийн үзлэг": "🏥",
    "Хүүхдийн эмч": "👶",
    "Гинеколог": "👩",
    "Кардиолог": "❤️",
    "Невролог": "🧠",
    "default": "⚕️"
  };

  const getIcon = (name) => {
    for (const key in serviceIcons) {
      if (name?.includes(key) || key.includes(name)) {
        return serviceIcons[key];
      }
    }
    return serviceIcons.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Манай үйлчилгээнүүд</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Бид танд олон төрлийн эрүүл мэндийн үйлчилгээг санал болгож байна
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-gray-400 text-6xl mb-4">⚕️</div>
            <p className="text-gray-600 text-lg">Одоогоор үйлчилгээ бүртгэгдээгүй байна</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(s => (
              <div
                key={s._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{getIcon(s.name)}</div>
                    {s.durationMin && (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        {s.durationMin} мин
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{s.name}</h3>
                  
                  {s.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{s.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      {s.price ? `${s.price}₮` : "Үнэ: Тодорхойлох"}
                    </div>
                    <Link
                      to="/patient"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-green-700 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                    >
                      Захиалах →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
