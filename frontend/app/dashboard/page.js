"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Protected from "../../components/Protected";
import { useToast } from "../../components/Toast";

function useAuthGuard() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
}

export default function DashboardPage() {
  useAuthGuard();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [form, setForm] = useState({ title: "", description: "", status: "todo" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const toast = useToast();
  const [stats, setStats] = useState({ total: 0, todo: 0, in_progress: 0, done: 0 });

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/tasks", {
        params: { page, limit, search: search || undefined, status: status || undefined }
      });
      setTasks(data.data || []);
      setPagination(data.pagination || { page, limit, total: 0 });
      const counts = (data.data || []).reduce(
        (acc, t) => {
          acc.total += 1;
          acc[t.status] += 1;
          return acc;
        },
        { total: 0, todo: 0, in_progress: 0, done: 0 }
      );
      setStats(counts);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tasks");
      toast("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const onCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/tasks", form);
      setForm({ title: "", description: "", status: "todo" });
      setSuccess("Task created");
      toast("Task created", "success");
      fetchTasks();
      setTimeout(() => setSuccess(""), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create task");
      toast("Failed to create task", "error");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      toast("Task deleted", "success");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete task");
      toast("Failed to delete task", "error");
    }
  };

  const onUpdate = async (id, updates) => {
    try {
      await api.patch(`/tasks/${id}`, updates);
      fetchTasks();
      toast("Task updated", "success");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update task");
      toast("Failed to update task", "error");
    }
  };

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / (pagination.limit || 10)));

  return (
    <Protected>
    <div className="space-y-8">
      {/* Banner */}
      <section className="rounded-2xl p-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">Your Tasks Dashboard</h1>
            <p className="text-blue-100 mt-1">
              Track, create, and manage tasks with speed. Tokens refresh automatically.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/15 rounded-lg px-4 py-2">
              <div className="text-sm opacity-80">Total</div>
              <div className="text-xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-2">
              <div className="text-sm opacity-80">In Progress</div>
              <div className="text-xl font-bold">{stats.in_progress}</div>
            </div>
            <div className="bg-white/15 rounded-lg px-4 py-2">
              <div className="text-sm opacity-80">Done</div>
              <div className="text-xl font-bold">{stats.done}</div>
            </div>
          </div>
        </div>
      </section>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-700">{success}</div>}

      {/* Create + Filters */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3 bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold">Create Task</h2>
          <form onSubmit={onCreate} className="grid gap-3">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-3 items-center">
              <select className="border px-2 py-2 rounded" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button type="submit" disabled={loading}>Create</button>
            </div>
          </form>
        </section>

        <section className="space-y-3 bg-white rounded-xl p-5 shadow">
          <h2 className="font-semibold">Filter Tasks</h2>
          <div className="flex gap-3">
            <input className="flex-1" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <select className="border px-2 py-2 rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button onClick={() => { setPage(1); fetchTasks(); }}>Filter</button>
          </div>
          <p className="text-xs text-gray-500">Tip: Use the dropdown on cards to update status inline.</p>
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Tasks</h2>
        <div className="grid gap-3">
          {loading ? (
            <div>Loading...</div>
          ) : tasks.length === 0 ? (
            <div className="text-gray-600 bg-white rounded-xl p-6 shadow text-center">
              <div className="text-lg font-semibold mb-1">No tasks yet</div>
              <div className="text-sm">Create your first task using the form above.</div>
            </div>
          ) : (
            tasks.map((t) => (
              <div key={t.id} className="bg-white rounded-xl p-4 flex items-center justify-between shadow hover:shadow-md transition">
                <div>
                  <div className="font-semibold text-lg">{t.title}</div>
                  <div className="text-sm text-gray-600">{t.description}</div>
                  <div className="text-xs mt-1">
                    Status:{" "}
                    <span className={`px-2 py-0.5 rounded text-white ${
                      t.status === "done" ? "bg-green-600" : t.status === "in_progress" ? "bg-yellow-600" : "bg-gray-600"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select className="border px-2 py-1 rounded" value={t.status} onChange={(e) => onUpdate(t.id, { status: e.target.value })}>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button className="bg-red-600 hover:bg-red-700" onClick={() => onDelete(t.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center gap-3">
          <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <div>Page {page} / {totalPages}</div>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          <select className="border px-2 py-1 rounded" value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
            {[5,10,20,50].map(n => <option key={n} value={n}>{n} / page</option>)}
          </select>
        </div>
      </section>
    </div>
    </Protected>
  );
}

