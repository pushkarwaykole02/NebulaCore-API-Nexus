"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import { useAuthStore } from "../../lib/authStore";
import { useToast } from "../../components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuth({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });
      toast("Logged in", "success");
      router.push("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
      toast(err?.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 bg-white p-6 rounded-md shadow">
      <h1 className="text-2xl font-bold">Login</h1>
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
      </form>
      <p className="text-sm">
        No account?{" "}
        <Link className="text-blue-600 underline" href="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

