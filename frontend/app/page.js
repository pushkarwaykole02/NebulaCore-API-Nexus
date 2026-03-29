'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch {}
  }, []);

  return (
    <div className="space-y-10">
      <section className="rounded-xl p-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow">
        <h1 className="text-4xl font-extrabold">NebulaCore API Nexus</h1>
        <p className="mt-3 text-lg text-blue-100 max-w-2xl">
          Secure, scalable API boilerplate with JWT auth, RBAC, Supabase, and a polished Next.js dashboard.
        </p>
        <div className="mt-6 flex gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="bg-white text-blue-700 px-5 py-2 rounded font-semibold">
                Go to Dashboard
              </Link>
              <a
                className="bg-blue-900/50 px-5 py-2 rounded border border-white/20"
                href="/api-docs"
                target="_blank"
                rel="noreferrer"
              >
                API Docs
              </a>
            </>
          ) : (
            <>
              <Link href="/login" className="bg-white text-blue-700 px-5 py-2 rounded font-semibold">
                Login
              </Link>
              <Link href="/register" className="bg-blue-900/50 px-5 py-2 rounded border border-white/20">
                Create account
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold">Authentication</h3>
          <p className="text-sm text-gray-600 mt-2">
            Bcrypt hashing, access/refresh tokens, and route protection with role-based access control.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold">Tasks Module</h3>
          <p className="text-sm text-gray-600 mt-2">
            CRUD with pagination and search. Users see their tasks; admins see all.
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="font-semibold">Docs & Observability</h3>
          <p className="text-sm text-gray-600 mt-2">
            Swagger UI at <code>/api-docs</code> and structured logging for production readiness.
          </p>
        </div>
      </section>
    </div>
  );
}

