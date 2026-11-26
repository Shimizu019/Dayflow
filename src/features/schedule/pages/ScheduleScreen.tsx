import { useDayflowStore } from '@/store/useDayflowStore';

export default function ScheduleScreen() {
  const {
    selectedDay,
    selectScheduleDay,
    weekDays,
    timelineEvents,
    upcomingEvents,
  } = useDayflowStore();

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col px-5 pt-2 pb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#ECE7FD] text-brand-600 flex items-center justify-center">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="4" width="18" height="17" rx="3" />
              <path strokeLinecap="round" d="M8 2v4M16 2v4M3 9h18" />
            </svg>
          </div>
          <h1 className="text-[18px] font-extrabold text-ink-900">Schedule</h1>
        </div>
        <button
          onClick={() => {}}
          className="p-1.5 rounded-xl text-ink-700 hover:bg-brand-100/60"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {weekDays.map((d) => {
          const active = selectedDay === d.date;
          return (
            <button
              key={d.date}
              onClick={() => selectScheduleDay(d.date)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-2xl transition-all ${
                active ? 'bg-brand-600 text-white shadow-md' : 'text-ink-900 hover:bg-brand-100/70'
              }`}
            >
              <span className={`text-[11px] font-medium ${active ? 'text-white/85' : 'text-ink-500'}`}>
                {d.day}
              </span>
              <span className="text-[14px] font-extrabold mt-0.5">{d.date}</span>
            </button>
          );
        })}
      </div>

      <div className="relative pl-5 space-y-4 mb-6">
        <div className="absolute left-[5px] top-3 bottom-3 w-[2px] bg-[#E2DAF8]" />
        {timelineEvents.map((ev) => (
          <div key={ev.id} className="relative">
            <span className="absolute -left-5 top-3 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-[#F8F7FC]" />
            <div className="bg-[#ECE8FC] rounded-[22px] p-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/85 text-[#3B66F5] flex items-center justify-center shrink-0 shadow-2xs">
                {ev.icon === 'book' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-brand-600">{ev.time}</div>
                <div className="text-[14px] font-bold text-ink-900 leading-snug mt-0.5">{ev.title}</div>
                <div className="text-[12px] text-ink-500 mt-0.5">{ev.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-bold text-ink-900">Upcoming Events</h2>
          <button
            onClick={() => {}}
            className="text-[12px] font-semibold text-brand-600 hover:underline flex items-center gap-0.5"
          >
            See all
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="space-y-2.5">
          {upcomingEvents.map((up) => (
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
                <div className="text-[12px] text-ink-500 mt-0.5">{up.timeRange}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
