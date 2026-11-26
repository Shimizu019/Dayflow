import { useDayflowStore, type TaskFilter } from '@/store/useDayflowStore';

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
    openModal,
  } = useDayflowStore();

  const filteredTasks = tasks.filter((t) => {
    if (taskFilter === 'Pending') return !t.completed;
    if (taskFilter === 'Completed') return t.completed;
    return true;
  });

  const tabs: TaskFilter[] = ['All', 'Pending', 'Completed'];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-20">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[20px] font-extrabold text-ink-900">Tasks</h1>
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
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className="bg-white rounded-[20px] px-4 py-3.5 shadow-card flex items-center gap-3.5 cursor-pointer hover:bg-brand-50/30 transition-colors"
          >
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
              <div className={`text-[14px] font-bold truncate ${task.completed ? 'text-ink-900' : 'text-ink-900'}`}>
                {task.title}
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-[12px] text-ink-500">
                {task.completed ? (
                  <span>Completed</span>
                ) : (
                  <>
                    <span>{task.due}</span>
                    <span>•</span>
                    {priorityBadge(task.priority)}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => openModal('task')}
        className="fixed bottom-6 right-5 w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-fab flex items-center justify-center transition-transform active:scale-95"
        aria-label="New Task"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}
