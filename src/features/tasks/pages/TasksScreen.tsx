import { useDayflowStore, type TaskFilter } from '@/store/useDayflowStore';
import { useState } from 'react';

function priorityBadge(priority: 'High' | 'Medium' | 'Low') {
  if (priority === 'High') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-[#FCE7EE] text-[#E11D48] text-[10px] font-bold">
        High
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] text-[10px] font-bold">
        Medium
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold">
      Low
    </span>
  );
}

export default function TasksScreen() {
  const {
    tasks,
    taskFilter,
    setTaskFilter,
    toggleTask,
    deleteTask,
    updateTask,
  } = useDayflowStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState<{
    id: number;
    title: string;
    due: string;
    priority: 'High' | 'Medium' | 'Low';
  } | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'Pending') return !t.completed;
    if (taskFilter === 'Completed') return t.completed;
    return true;
  }).filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: TaskFilter[] = ['All', 'Pending', 'Completed'];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-[calc(96px+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[200px] px-3 py-2 rounded-xl bg-[#F4F1FE] text-sm text-ink-900 outline-none focus:ring-2 focus:ring-brand-600"
          />
          <h1 className="text-[20px] font-extrabold text-ink-900 ml-4">Tasks</h1>
        </div>
        <div className="flex items-center gap-2 text-ink-900">
          <button
            onClick={() => {}}
            className="p-1.5 rounded-xl hover:bg-brand-100/60 transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
            </svg>
          </button>
          <button
            onClick={() => {}}
            className="p-1.5 rounded-xl hover:bg-brand-100/60 transition-colors"
            aria-label="More options"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-4">
        {tabs.map((tab) => {
          const active = taskFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setTaskFilter(tab)}
              className={`px-5 py-2 rounded-full text-[12px] font-bold transition-all ${
                active ? 'bg-brand-600 text-white shadow-sm' : 'bg-[#EDE9F9] text-ink-700 hover:bg-brand-100'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isEditing = editingTask?.id === task.id;
          return (
            <div
              key={task.id}
              className="bg-white rounded-[20px] px-4 py-3.5 shadow-card flex items-center gap-3.5"
            >
              {isEditing ? (
                <div className="flex-1 min-w-0 space-y-2.5">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const title = formData.get('title') as string;
                      const priority = formData.get('priority') as 'High' | 'Medium' | 'Low';
                      if (!title) return;
                      await updateTask(task.id, { title, priority });
                      setEditingTask(null);
                    }}
                  >
                    <input
                      name="title"
                      defaultValue={task.title}
                      className="w-full px-3 py-2 rounded-xl bg-[#F4F1FE] text-sm font-bold text-ink-900 outline-none"
                    />
                    <div className="flex items-center gap-2.5">
                      <select
                        name="priority"
                        defaultValue={task.priority}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setEditingTask(null)}
                        className="text-[11px] text-ink-500 hover:text-ink-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-[11px] text-brand-600 font-bold"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex items-center gap-3.5 cursor-pointer hover:bg-brand-50/30 transition-colors" onClick={async () => toggleTask(task.id)}>
                  {task.completed ? (
                    <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[#C5BEDB] shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-bold truncate ${task.completed ? 'line-through text-ink-400' : 'text-ink-900'}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[12px] text-ink-500">
                      {task.completed ? (
                        <span>Completed</span>
                      ) : (
                        <>
                          <span>{task.dueDate}</span>
                          <span>•</span>
                          {priorityBadge(task.priority)}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTask({ id: task.id, title: task.title, due: task.dueDate, priority: task.priority });
                      }}
                      className="p-1.5 text-brand-600 hover:bg-brand-50/60 rounded-lg"
                      aria-label="Edit task"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteTask(task.id);
                    }}
                      className="p-1.5 text-[#E11D48] hover:bg-[#FCE7EE] rounded-lg"
                      aria-label="Delete task"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
