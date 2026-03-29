"use client";
import { useEffect, useState } from "react";

let pushToast;

export function useToast() {
  return (msg, type = "info") => {
    if (pushToast) pushToast({ msg, type });
  };
}

export default function ToastHost() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    pushToast = (t) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...t }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, 2500);
    };
    return () => {
      pushToast = undefined;
    };
  }, []);
  return (
    <div className="fixed right-4 bottom-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded shadow text-white ${
            t.type === "error" ? "bg-red-600" : t.type === "success" ? "bg-green-600" : "bg-gray-800"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

