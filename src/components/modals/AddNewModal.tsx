import { useState } from 'react';
import { useDayflowStore } from '@/store/useDayflowStore';

export default function AddNewModal() {
  const {
    isModalOpen,
    modalDirectForm,
    closeModal,
    submitExpense,
    submitGoal,
    submitTask,
    submitEvent,
  } = useDayflowStore();
  const [showSubForm, setShowSubForm] = useState<string | null>(null);

  if (!isModalOpen) return null;

  // If a direct form was requested, open it
  if (modalDirectForm && !showSubForm) {
    setShowSubForm(modalDirectForm);
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-[#141122]/55 backdrop-blur-[1.5px] transition-opacity"
      onClick={closeModal}
    >
      <div className="relative z-50 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-[30px] p-5 shadow-2xl transform transition-all duration-200 scale-100">
          <h3 className="text-center text-[17px] font-bold text-ink-900 mb-4">Add New</h3>

          <div className="divide-y divide-gray-100 mt-4">
            {showSubForm ? (
              <>
                {showSubForm === 'expense' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowSubForm(null)}
                        className="text-xs font-semibold text-ink-500 hover:text-ink-900"
                      >
                        ← Back
                      </button>
                      <h3 className="text-[16px] font-bold text-ink-900">Add Expense</h3>
                      <span className="w-8" />
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
                        const amount = Number((form.elements.namedItem('amount') as HTMLInputElement).value);
                        submitExpense(category, amount);
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 mb-1">Category</label>
                        <select
                          name="category"
                          defaultValue="Food & Drinks"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                        >
                          <option value="Food & Drinks">Food & Drinks</option>
                          <option value="Transport">Transport</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 mb-1">Amount (₱)</label>
                        <input
                          name="amount"
                          type="number"
                          min="1"
                          placeholder="e.g. 120"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-bold text-ink-900 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-1"
                      >
                        Save Expense
                      </button>
                    </form>
                  </div>
                )}
                {showSubForm === 'goal' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowSubForm(null)}
                        className="text-xs font-semibold text-ink-500 hover:text-ink-900"
                      >
                        ← Back
                      </button>
                      <h3 className="text-[16px] font-bold text-ink-900">Create Savings Goal</h3>
                      <span className="w-8" />
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                        const saved = Number((form.elements.namedItem('saved') as HTMLInputElement).value);
                        const target = Number((form.elements.namedItem('target') as HTMLInputElement).value);
                        submitGoal(title, saved, target);
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 mb-1">Goal Name</label>
                        <input
                          name="title"
                          type="text"
                          placeholder="e.g. Emergency Fund"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">Initial Saved (₱)</label>
                          <input
                            name="saved"
                            type="number"
                            min="0"
                            defaultValue="500"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-bold text-ink-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">Target (₱)</label>
                          <input
                            name="target"
                            type="number"
                            min="100"
                            defaultValue="5000"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-bold text-ink-900 outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-1"
                      >
                        Create Goal
                      </button>
                    </form>
                  </div>
                )}
                {showSubForm === 'task' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowSubForm(null)}
                        className="text-xs font-semibold text-ink-500 hover:text-ink-900"
                      >
                        ← Back
                      </button>
                      <h3 className="text-[16px] font-bold text-ink-900">Create Task</h3>
                      <span className="w-8" />
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                        const due = (form.elements.namedItem('due') as HTMLSelectElement).value;
                        const priority = (form.elements.namedItem('priority') as HTMLSelectElement).value;
                        submitTask(title, due, priority as 'High' | 'Medium' | 'Low');
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 mb-1">Task Title</label>
                        <input
                          name="title"
                          type="text"
                          placeholder="e.g. Review Figma Prototype"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">Due</label>
                          <select
                            name="due"
                            defaultValue="Today"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                          >
                            <option value="Today">Today</option>
                            <option value="Tomorrow">Tomorrow</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">Priority</label>
                          <select
                            name="priority"
                            defaultValue="High"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-1"
                      >
                        Add Task
                      </button>
                    </form>
                  </div>
                )}
                {showSubForm === 'event' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowSubForm(null)}
                        className="text-xs font-semibold text-ink-500 hover:text-ink-900"
                      >
                        ← Back
                      </button>
                      <h3 className="text-[16px] font-bold text-ink-900">Add Event</h3>
                      <span className="w-8" />
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                        const time = (form.elements.namedItem('time') as HTMLInputElement).value;
                        const location = (form.elements.namedItem('location') as HTMLInputElement).value;
                        submitEvent(title, time, location);
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 mb-1">Event Title</label>
                        <input
                          name="title"
                          type="text"
                          placeholder="e.g. Design Critique"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">Time</label>
                          <input
                            name="time"
                            type="text"
                            defaultValue="3:30 PM"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-ink-700 mb-1">Location</label>
                          <input
                            name="location"
                            type="text"
                            defaultValue="Room 204"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-1"
                      >
                        Save Event
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowSubForm('expense')}
                  className="w-full flex items-center gap-3.5 py-3 px-1.5 hover:bg-brand-50/60 rounded-xl transition-colors text-left group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#FCE7EE] text-[#E11D48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="6" width="18" height="13" rx="3" />
                      <path d="M16 12.5h2.5" />
                      <path d="M7 6V4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5V6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-ink-900">Add Expense</div>
                    <div className="text-[12px] text-ink-500">Track your spending</div>
                  </div>
                </button>
                <button
                  onClick={() => setShowSubForm('goal')}
                  className="w-full flex items-center gap-3.5 py-3 px-1.5 hover:bg-brand-50/60 rounded-xl transition-colors text-left group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#E3F7ED] text-[#16A34A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2z" />
                      <path d="M16 13h2" />
                      <path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-ink-900">Create Savings Goal</div>
                    <div className="text-[12px] text-ink-500">Save for your dreams</div>
                  </div>
                </button>
                <button
                  onClick={() => setShowSubForm('task')}
                  className="w-full flex items-center gap-3.5 py-3 px-1.5 hover:bg-brand-50/60 rounded-xl transition-colors text-left group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#ECE7FD] text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-ink-900">Create Task</div>
                    <div className="text-[12px] text-ink-500">Stay on track</div>
                  </div>
                </button>
                <button
                  onClick={() => setShowSubForm('event')}
                  className="w-full flex items-center gap-3.5 py-3 px-1.5 hover:bg-brand-50/60 rounded-xl transition-colors text-left group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#FEF0DC] text-[#D97706] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="17" rx="3" />
                      <path strokeLinecap="round" d="M8 2v4M16 2v4M3 9h18" />
                      <rect x="7.5" y="12.5" width="3" height="3" rx="0.6" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-ink-900">Add Event</div>
                    <div className="text-[12px] text-ink-500">Keep your schedule</div>
                  </div>
                </button>
              </>
            )}
          </div>

          <button
            onClick={closeModal}
            className="mt-4 w-full py-3.5 rounded-2xl bg-[#EAE4FC] hover:bg-[#DFD6FA] text-ink-900 font-bold text-[14px] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
