import { useState, useEffect } from "react";

import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Inbox, 
  X, 
  SlidersHorizontal 
} from "lucide-react";


interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "completed" | "backlog";
  priority: "low" | "medium" | "high";
  dueDate?: string | null;
  createdAt: string;
}


export default function App() {

  const [tasks, setTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [priorityFilter, setPriorityFilter] = useState("all");

  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<Task["status"]>("todo");

  const [priority, setPriority] = useState<Task["priority"]>("medium");

  const [dueDate, setDueDate] = useState("");


  const fetchTasks = async () => {

    try {

      setLoading(true);


      const res = await fetch("/api/tasks");

      const data = await res.json();


      if (data.status === "success") {
        setTasks(data.data);
      }

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchTasks();

  }, []);


  const openCreateModal = () => {

    setEditingTask(null);

    setTitle("");

    setDescription("");

    setStatus("todo");

    setPriority("medium");

    setDueDate("");


    setIsModalOpen(true);

  };


  const openEditModal = (task: Task) => {

    setEditingTask(task);

    setTitle(task.title);

    setDescription(task.description || "");

    setStatus(task.status);

    setPriority(task.priority);

    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");


    setIsModalOpen(true);

  };


  const handleSave = async (e: React.FormEvent) => {

    e.preventDefault();


    if (!title.trim()) return;


    const payload = {
      title,
      description: description || null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };


    try {

      if (editingTask) {

        const res = await fetch(`/api/tasks/${editingTask.id}`, {

          method: "PATCH",

          headers: { 
            "Content-Type": "application/json" 
          },

          body: JSON.stringify(payload),

        });


        if (res.ok) {
          fetchTasks();
          setIsModalOpen(false);
        }

      } else {

        const res = await fetch("/api/tasks", {

          method: "POST",

          headers: { 
            "Content-Type": "application/json" 
          },

          body: JSON.stringify(payload),

        });


        if (res.ok) {
          fetchTasks();
          setIsModalOpen(false);
        }

      }

    } catch (err) {

      console.error(err);

    }

  };


  const handleDelete = async (id: string) => {

    try {

      const res = await fetch(`/api/tasks/${id}`, { 
        method: "DELETE" 
      });


      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== id));
      }

    } catch (err) {

      console.error(err);

    }

  };


  const filteredTasks = tasks.filter((t) => {

    const matchesSearch = 
      t.title.toLowerCase().includes(search.toLowerCase()) || 
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;


    return matchesSearch && matchesStatus && matchesPriority;

  });


  const backlogCount = tasks.filter((t) => t.status === "backlog").length;

  const todoCount = tasks.filter((t) => t.status === "todo").length;

  const progressCount = tasks.filter((t) => t.status === "in_progress").length;

  const completedCount = tasks.filter((t) => t.status === "completed").length;


  const getStatusColor = (s: Task["status"]) => {

    switch (s) {
      case "backlog": 
        return "#64748b";
      case "todo": 
        return "#3b82f6";
      case "in_progress": 
        return "#f59e0b";
      case "completed": 
        return "#10b981";
    }

  };


  const getPriorityColor = (p: Task["priority"]) => {

    switch (p) {
      case "low": 
        return "#10b981";
      case "medium": 
        return "#f59e0b";
      case "high": 
        return "#ef4444";
    }

  };


  const formatStatus = (s: Task["status"]) => {
    return s.replace("_", " ");
  };


  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-violet-500 to-pink-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-glow">
            <CheckCircle2 size={22} color="#ffffff" />
          </div>
          <span className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">TaskFlow</span>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/15 hover:shadow-glow hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer transition-all duration-150" onClick={openCreateModal}>
          <Plus size={18} />
          Create Task
        </button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-brand-surface backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-premium hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-500/15 text-slate-400">
            <Inbox size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold leading-none">{backlogCount}</span>
            <span className="text-slate-400 text-sm font-medium mt-1.5">Backlog</span>
          </div>
        </div>
        
        <div className="bg-brand-surface backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-premium hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/15 text-blue-400">
            <Clock size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold leading-none">{todoCount}</span>
            <span className="text-slate-400 text-sm font-medium mt-1.5">To Do</span>
          </div>
        </div>

        <div className="bg-brand-surface backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-premium hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/15 text-amber-400">
            <SlidersHorizontal size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold leading-none">{progressCount}</span>
            <span className="text-slate-400 text-sm font-medium mt-1.5">In Progress</span>
          </div>
        </div>

        <div className="bg-brand-surface backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex items-center gap-5 shadow-premium hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-bold leading-none">{completedCount}</span>
            <span className="text-slate-400 text-sm font-medium mt-1.5">Completed</span>
          </div>
        </div>
      </section>

      <section className="bg-brand-surface backdrop-blur-xl border border-white/5 rounded-2xl p-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 shadow-premium">
        <div className="relative w-full sm:w-64 md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 outline-none text-[15px] focus:border-violet-500/50 focus:bg-white/10 focus:ring-4 focus:ring-violet-500/15 transition-all duration-150"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            className="flex-1 sm:flex-initial bg-brand-dark border border-white/5 rounded-xl px-4 py-2.5 outline-none text-[15px] cursor-pointer focus:border-violet-500/50 transition-all duration-150"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            className="flex-1 sm:flex-initial bg-brand-dark border border-white/5 rounded-xl px-4 py-2.5 outline-none text-[15px] cursor-pointer focus:border-violet-500/50 transition-all duration-150"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </section>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-20 px-6 bg-brand-surface border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4">
            <Inbox className="text-slate-500" size={48} />
            <p className="text-slate-400 font-medium">No tasks found. Get started by creating one!</p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <article key={t.id} className="bg-brand-surface backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-premium flex flex-col h-[220px] relative transition-all duration-300 hover:-translate-y-1 hover:bg-brand-surface-hover hover:border-white/15 hover:shadow-2xl">
              <div className="flex justify-between items-start gap-2 mb-3">
                <h3 className="font-display text-lg font-semibold leading-snug line-clamp-2">{t.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border shrink-0" style={{ borderColor: getPriorityColor(t.priority), color: getPriorityColor(t.priority) }}>
                  {t.priority}
                </span>
              </div>
              <p className="text-slate-300 text-sm line-clamp-3 mb-auto leading-relaxed">{t.description || "No description provided."}</p>
              
              {t.dueDate && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
                  <Calendar size={14} />
                  <span>{new Date(t.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border" style={{ borderColor: getStatusColor(t.status), color: getStatusColor(t.status) }}>
                  {formatStatus(t.status)}
                </span>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-150" onClick={() => openEditModal(t)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-500/15 hover:text-red-400 transition-all duration-150" onClick={() => handleDelete(t.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-[#0f111a] border border-white/5 rounded-2xl w-full max-w-lg p-8 shadow-premium shadow-violet-500/5 relative mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl font-bold">{editingTask ? "Edit Task" : "New Task"}</h2>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-150" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Task Title</label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none text-[15px] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/15 transition-all duration-150" 
                  required
                  placeholder="E.g., Complete UI integration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none text-[15px] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/15 transition-all duration-150 resize-none h-28" 
                  placeholder="Details about the task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none text-[15px] focus:border-violet-500/50 transition-all duration-150"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Task["status"])}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority</label>
                  <select 
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none text-[15px] focus:border-violet-500/50 transition-all duration-150"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task["priority"])}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Due Date</label>
                <input 
                  type="date" 
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 outline-none text-[15px] focus:border-violet-500/50 transition-all duration-150"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button type="button" className="px-5 py-2.5 rounded-xl font-semibold bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-150" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-br from-violet-500 to-violet-600 shadow-md shadow-violet-500/15 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150">
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
