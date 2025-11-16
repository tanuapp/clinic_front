import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full h-screen flex items-center bg-gradient-to-r from-blue-50 to-green-50 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
            filter: "brightness(0.85)",
          }}
        ></div>

        {/* Overlay Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-10">
          {/* Text */}
          <div className="flex-1 text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
              Эрүүл мэндийн нэгдсэн платформ
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-md drop-shadow">
              Та байгаа газраасаа, хүссэн цагтаа эрүүл мэндийн тусламж,
              үйлчилгээ авах боломжтой.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
            </div>
          </div>

          {/* Foreground Image */}
          <div className="flex-1">
            <img
              src="/images/mom-baby.png"
              alt="Ээж хүүхэд"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            Бидний тухай
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            “Өрхийн эмнэлгийн нэгдсэн систем” нь хэрэглэгчдэд онлайн цаг захиалга,
            эмчийн зөвлөгөө, лабораторийн хариу авах зэрэг үйлчилгээг хялбар аргаар
            үзүүлэх зорилготой.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-green-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              Онлайн цаг захиалга
            </h3>
            <p className="text-gray-600">
              Өөрт тохирсон цагийг сонгон эмчдээ онлайн захиалга өгөөрэй.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              Мэргэжлийн зөвлөгөө
            </h3>
            <p className="text-gray-600">
              Тэргүүлэх эмч нарын зөвлөгөөг видео болон бичгийн хэлбэрээр аваарай.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              Хурдан, найдвартай үйлчилгээ
            </h3>
            <p className="text-gray-600">
              Таны эрүүл мэндийн мэдээлэл найдвартай хадгалагдаж, хурдан хүрдэг.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">
              Эрүүл мэндийн систем
            </h3>
            <p className="text-gray-400">
              Хэрэглэгчдэдээ чанартай эрүүл мэндийн үйлчилгээг хүргэх зорилготой
              цахим платформ.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Холбоо барих</h4>
            <p>Утас: 7711-1122</p>
            <p>И-мэйл: info@eclinic.mn</p>
            <p>Хаяг: Улаанбаатар хот</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Холбоосууд</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="hover:text-white">Үйлчилгээ</Link></li>
              <li><Link to="/doctors" className="hover:text-white">Эмч нар</Link></li>
              <li><Link to="/login" className="hover:text-white">Нэвтрэх</Link></li>
              <li><Link to="/register" className="hover:text-white">Бүртгүүлэх</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} Эрүүл мэндийн систем. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </footer>
    </div>
  );
}