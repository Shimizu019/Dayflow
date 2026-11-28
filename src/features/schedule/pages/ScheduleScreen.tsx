import { useState } from 'react';
import { useDayflowStore } from '@/store/useDayflowStore';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function ScheduleScreen() {
  const {
    scheduleEvents,
    deleteEvent,
    deleteTask,
    openModal,
    tasks,
    toggleTask,
  } = useDayflowStore();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date(todayYear, todayMonth, 1);
    d.setDate(d.getDate() - d.getDay());
    return d;
  });

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
    return { day: DAYS[d.getDay()], date: d.getDate(), full: d.toISOString().split('T')[0] };
  });

  const [selectedDate, setSelectedDate] = useState(todayDate);
  const monthYear = `${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`;

  const selectedDateStr = weekDays.find((d) => d.date === selectedDate)?.full ?? todayStr;
  const selectedDayName = DAY_NAMES[new Date(selectedDateStr).getDay()];

  // Combine tasks and events for the selected date, sorted chronologically
  const dayTasks = tasks
    .filter((t) => t.dueDate === selectedDateStr)
    .map((t) => ({ ...t, type: 'task' as const }));
  const dayEvents = scheduleEvents
    .filter((e) => e.date === selectedDateStr)
    .map((e) => ({ ...e, type: 'event' as const }));

  const agendaItems = [...dayTasks, ...dayEvents].sort((a, b) => {
    const timeA = a.type === 'task' ? (a.dueTime ?? '00:00') : (a.time ?? '00:00');
    const timeB = b.type === 'task' ? (b.dueTime ?? '00:00') : (b.time ?? '00:00');
    return timeA.localeCompare(timeB);
  });

  const dayItemDates = new Set(
    [...scheduleEvents.map((e) => e.date), ...tasks.map((t) => t.dueDate)].filter(Boolean)
  );

  const goPrev = () =>
    setWeekStart((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 7);
      return n;
    });
  const goNext = () =>
    setWeekStart((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 7);
      return n;
    });

  const handleDelete = async (id: number) => {
    await deleteEvent(id);
  };

  const handleToggleTask = async (id: number) => {
    await toggleTask(id);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-[env(safe-area-inset-top)] pb-[calc(96px+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#ECE7FD] text-brand-600 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="17" rx="3" />
              <path strokeLinecap="round" d="M8 2v4M16 2v4M3 9h18" />
            </svg>
          </div>
          <h1 className="text-[18px] font-extrabold text-ink-900">Schedule</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={goPrev}
            className="p-1.5 rounded-xl text-ink-700 hover:bg-brand-100/60 transition-colors"
            aria-label="Previous week"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-[14px] font-bold text-ink-900 tabular-nums">{monthYear}</span>
          <button
            onClick={goNext}
            className="p-1.5 rounded-xl text-ink-700 hover:bg-brand-100/60 transition-colors"
            aria-label="Next week"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#ECE8FA] p-3 mb-4">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((d) => {
            const active = selectedDate === d.date;
            const hasItem = dayItemDates.has(d.full);
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
                  active
                    ? 'bg-[#6D42EF] text-white'
                    : 'text-ink-900 hover:bg-brand-100/70'
                }`}
              >
                <span className={`text-[11px] font-medium ${active ? 'text-white/90' : 'text-ink-500'}`}>
                  {d.day}
                </span>
                <span className={`text-[14px] font-extrabold mt-0.5 ${active ? 'text-white' : 'text-ink-900'}`}>
                  {d.date}
                </span>
                {hasItem && (
                  <span className="w-1.5 h-1.5 mt-1 rounded-full bg-[#6D42EF] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-[15px] font-bold text-ink-900">
          {selectedDayName}, {selectedDateStr}
        </h2>
        {agendaItems.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#ECE8FA] p-6 text-center mt-3">
            <div className="w-12 h-12 rounded-full bg-[#ECE8FA] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 11h6m-3-6v6M12 3a9 9 0 100 18 9 9 0 000-18z" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-ink-900">No items scheduled for this day</h3>
          </div>
        ) : (
          <div className="relative mt-3">
            <div className="absolute left-3 top-1 bottom-1 w-[1px] bg-[#E2DAF8]" />
            {agendaItems.map((item) => {
              const isTask = item.type === 'task';
              const time = isTask
                ? (item.dueTime ?? '')
                : [item.time, item.endTime].filter(Boolean).join('–');
              const location = isTask ? '' : (item.location ?? '');
              const description = isTask ? (item.description ?? '') : (item.description ?? '');
              return (
                <div key={`${item.type}-${item.id}`} className="relative pl-8 mb-4">
                  <span
                    className="absolute left-[3px] top-2 w-5 h-5 -translate-x-1/2 rounded-full ring-2 ring-white shrink-0"
                    style={{
                      backgroundColor: isTask ? '#6D42EF' : '#16A34A',
                    }}
                  />
                  <div className="bg-white rounded-[20px] border border-[#ECE8FA] p-4 flex items-start gap-3">
                    <div className="mt-1 shrink-0">
                      <div className={`text-[11px] font-bold tabular-nums ${isTask ? 'text-brand-600' : 'text-emerald-600'}`}>
                        {time}
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 opacity-70">
                        {isTask ? 'Task' : 'Event'}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-ink-900 leading-snug">{item.title}</div>
                      {location && (
                        <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mt-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" fill="currentColor" />
                          </svg>
                          {location}
                        </div>
                      )}
                      {description && <div className="text-[11px] leading-relaxed text-ink-500 mt-1">{description}</div>}
                      {isTask && (
                        <div className="flex items-center gap-1.5 text-[12px] text-ink-500 mt-1">
                          <span>
                            {item.completed ? 'Completed' : 'Pending'}
                          </span>
                          <span>•</span>
                          <span
                            className={`font-bold text-[10px] uppercase px-1.5 py-0.5 rounded ${
                              item.priority === 'High'
                                ? 'bg-[#FCE7EE] text-[#E11D48]'
                                : item.priority === 'Medium'
                                  ? 'bg-[#FEF3C7] text-[#D97706]'
                                  : 'bg-[#DCFCE7] text-[#16A34A]'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 ml-2 shrink-0">
                      {isTask ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTask(item.id);
                            }}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                              item.completed
                                ? 'bg-brand-50 text-brand-600'
                                : 'bg-[#ECE7FD] text-brand-600 hover:bg-brand-100/60'
                            }`}
                            aria-label={item.completed ? 'Reopen task' : 'Complete task'}
                          >
                            {item.completed ? (
                              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('task', item.id, 'task');
                            }}
                            className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100/60 transition-colors"
                            aria-label="Edit task"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(item.id);
                            }}
                            className="w-11 h-11 rounded-xl bg-[#FCE7EE] text-[#E11D48] flex items-center justify-center hover:bg-[#FDE3E8] transition-colors"
                            aria-label="Delete task"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('event', item.id, 'schedule');
                            }}
                            className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100/60 transition-colors"
                            aria-label="Edit event"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="w-11 h-11 rounded-xl bg-[#FCE7EE] text-[#E11D48] flex items-center justify-center hover:bg-[#FDE3E8] transition-colors"
                            aria-label="Delete event"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-ink-900">Upcoming Events</h2>
        </div>
        {scheduleEvents.length === 0 ? (
          <div className="bg-white rounded-[20px] border border-[#ECE8FA] p-6 text-center mt-3">
            <div className="w-12 h-12 rounded-full bg-[#ECE8FA] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="17" rx="3" />
                <path strokeLinecap="round" d="M8 2v4M16 2v4M3 9h18" />
                <rect x="7.5" y="12.5" width="3" height="3" rx="0.6" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-ink-900">No upcoming events</h3>
            <p className="text-[13px] text-ink-500 mt-1">
              Tap the center + button to add a one-time event.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 mt-3">
            {scheduleEvents
              .filter((e) => e.date >= todayStr)
              .sort((a, b) => a.date.localeCompare(b.date))
              .map((up) => (
                <div key={up.id} className="bg-[#F2EFFC] rounded-[22px] p-4 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#E3DCFA] text-brand-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="17" rx="3" />
                      <path strokeLinecap="round" d="M8 2v4M16 2v4M3 9h18" />
                      <rect x="7.5" y="12.5" width="3" height="3" rx="0.6" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-brand-600">{up.date}</div>
                    <div className="text-[14px] font-bold text-ink-900 mt-0.5">{up.title}</div>
                    <div className="text-[12px] text-ink-500 mt-0.5">{up.time}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
