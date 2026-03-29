"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { useToast } from "../../components/Toast";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      await api.post("/auth/register", { email, password });
      setMsg("Registration successful. Redirecting to login...");
      toast("Registration successful", "success");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
      toast(err?.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 bg-white p-6 rounded-md shadow">
      <h1 className="text-2xl font-bold">Register</h1>
      {error && <div className="text-red-600">{error}</div>}
      {msg && <div className="text-green-700">{msg}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Register"}</button>
      </form>
      <p className="text-sm">
        Already have an account?{" "}
        <Link className="text-blue-600 underline" href="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

