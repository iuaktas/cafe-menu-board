// src/MenuBoard.jsx

import React, { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { useReactToPrint } from "react-to-print";
import PrintableMenu from "./PrintableMenu";
import { QRCodeSVG as QRCode } from "qrcode.react";

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyBAYWImp54EbUPKpq1iFMbbu1zNNqI1KNw",
  authDomain: "cafe-menu-1a952.firebaseapp.com",
  databaseURL: "https://cafe-menu-1a952-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cafe-menu-1a952",
  storageBucket: "cafe-menu-1a952.appspot.com",
  messagingSenderId: "837510278384",
  appId: "1:837510278384:web:efd4063c8e319855c62635"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function MenuBoard() {
  // ─────── COMPONENT BODY ───────
  // State’ler:
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");

  // PDF için ref ve fonksiyon:
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "cafe-menu"
  });

  // Firebase’ten veri çekme:
  useEffect(() => {
    const menuRef = dbRef(db, "menu");
    onValue(menuRef, snapshot => {
      const data = snapshot.val() || {};
      setMenuItems(Object.values(data));
    });
  }, []);

  // Aramaya göre filtre:
  const filtered = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  // ───────────────────────────────

  // ─────────── RENDER (JSX) ───────────
  return (
    <div className="min-h-screen bg-yellow-50 p-6 text-center font-sans">
      {/* Başlık */}
      <h1 className="text-4xl font-bold mb-6">CAFE Menü Board</h1>

      {/* PDF + QR Kod */}
      <div className="mb-6 flex justify-center items-center space-x-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Menü PDF İndir
        </button>
        <QRCode value={window.location.href} size={64} />
      </div>

      {/* Gizli PDF içeriği */}
      <div style={{ display: "none" }}>
        <PrintableMenu ref={componentRef} items={filtered} />
      </div>

      {/* Arama Kutusu */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ara..."
          className="px-4 py-2 border rounded w-full max-w-sm"
        />
      </div>

      {/* Menü Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p className="text-gray-600">Henüz menü öğesi bulunmuyor.</p>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-lg p-4 bg-white border border-yellow-300"
            >
              <h2 className="text-xl font-bold text-yellow-800">
                {item.name}
              </h2>
              <p className="text-gray-700 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-green-700">
                  {item.price}₺
                </span>
                <span className="text-sm text-gray-500">
                  {item.calories} kcal
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
