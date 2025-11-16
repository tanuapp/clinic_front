import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Doctors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/doctors")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Манай эмч нар</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мэргэжлийн, туршлагатай эмч нарын баг танд чанартай эрүүл мэндийн үйлчилгээ үзүүлж байна
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
            <p className="text-gray-600 text-lg">Одоогоор эмч бүртгэгдээгүй байна</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(d => (
              <div
                key={d._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {d.name?.charAt(0) || "👨‍⚕️"}
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {d.specialization || "Ерөнхий эмч"}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{d.name}</h3>
                  
                  {d.about && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{d.about}</p>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>📧</span>
                    <span>{d.email || "Имэйл байхгүй"}</span>
                  </div>
                  
                  <Link
                    to="/patient"
                    className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                  >
                    Цаг захиалах →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
