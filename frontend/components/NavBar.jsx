"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);
  return (
    <nav className="w-full mb-6 border-b bg-white/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">NebulaCore</Link>
        <div className="flex items-center gap-4">
          {user && (
            <Link href="/dashboard" className="text-sm text-gray-700 hover:text-black">Dashboard</Link>
          )}
          {!user ? (
            <>
              <Link className="text-sm text-blue-600" href="/login">Login</Link>
              <Link className="text-sm text-blue-600" href="/register">Register</Link>
            </>
          ) : (
            <>
              {/* Intentionally hide email on dashboard per request */}
              <button
                className="bg-gray-800 text-white px-3 py-1 rounded"
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("user");
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

