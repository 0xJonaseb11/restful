import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          fetchTasks();
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
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
      case "backlog": return "var(--color-backlog)";
      case "todo": return "var(--color-todo)";
      case "in_progress": return "var(--color-progress)";
      case "completed": return "var(--color-completed)";
    }
  };

  const getPriorityColor = (p: Task["priority"]) => {
    switch (p) {
      case "low": return "var(--color-low)";
      case "medium": return "var(--color-medium)";
      case "high": return "var(--color-high)";
    }
  };

  const formatStatus = (s: Task["status"]) => {
    return s.replace("_", " ");
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <CheckCircle2 size={22} color="#ffffff" />
          </div>
          <span className="logo-text">TaskFlow</span>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          Create Task
        </button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(100, 116, 139, 0.15)", color: "var(--color-backlog)" }}>
            <Inbox size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{backlogCount}</span>
            <span className="stat-label">Backlog</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "var(--color-todo)" }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todoCount}</span>
            <span className="stat-label">To Do</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "var(--color-progress)" }}>
            <SlidersHorizontal size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{progressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "var(--color-completed)" }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </section>

      <section className="controls-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters-group">
          <select 
            className="select-filter"
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
            className="select-filter"
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

      <main className="task-grid">
        {loading ? (
          <div className="loader-wrapper">
            <div className="spinner"></div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <Inbox className="empty-icon" size={48} />
            <p className="empty-text">No tasks found. Get started by creating one!</p>
          </div>
        ) : (
          filteredTasks.map((t) => (
            <article key={t.id} className="task-card">
              <div className="task-card-header">
                <h3 className="task-title">{t.title}</h3>
                <span className="badge badge-priority" style={{ border: `1px solid ${getPriorityColor(t.priority)}`, color: getPriorityColor(t.priority) }}>
                  {t.priority}
                </span>
              </div>
              <p className="task-desc">{t.description || "No description provided."}</p>
              
              {t.dueDate && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  <Calendar size={14} />
                  <span>{new Date(t.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              <div className="task-footer">
                <span className="badge badge-status" style={{ border: `1px solid ${getStatusColor(t.status)}`, color: getStatusColor(t.status) }}>
                  {formatStatus(t.status)}
                </span>
                <div className="task-actions">
                  <button className="action-btn" onClick={() => openEditModal(t)}>
                    <Edit3 size={16} />
                  </button>
                  <button className="action-btn action-btn-danger" onClick={() => handleDelete(t.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingTask ? "Edit Task" : "New Task"}</h2>
              <button className="action-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="E.g., Complete UI integration"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  placeholder="Details about the task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Task["status"])}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select 
                    className="form-control"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Task["priority"])}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
