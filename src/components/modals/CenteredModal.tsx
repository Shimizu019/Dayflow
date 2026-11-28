import { useDayflowStore } from '@/store/useDayflowStore';
import { validateAmount } from '@/utils/format';

export default function CenteredModal() {
  const {
    modalState,
    modalEditId,
    modalEditType,
    closeModal,
    openModal,
    // Expenses
    addExpense,
    updateExpense,
    deleteExpense,
    // Savings
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    // Tasks
    addTask,
    updateTask,
    deleteTask,
    // Schedule
    addEvent,
    updateEvent,
    deleteEvent,
    // Store data for edit prefill
    expenses,
    savingsGoals,
    tasks,
    scheduleEvents,
  } = useDayflowStore();

  if (modalState === 'closed') return null;

  const editId = modalEditId;
  const editType = modalEditType;
  const isEditMode = editId != null && editType != null;

  const editExpense = editType === 'expense' ? expenses.find((e) => e.id === editId) : null;
  const editGoal = editType === 'savings' ? savingsGoals.find((g) => g.id === editId) : null;
  const editTask = editType === 'task' ? tasks.find((t) => t.id === editId) : null;
  const editEvent = editType === 'schedule' ? scheduleEvents.find((e) => e.id === editId) : null;

  const isMenu = modalState === 'menu';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141122]/65 backdrop-blur-[3px] transition-opacity px-3"
      role="presentation"
      onClick={closeModal}
    >
      <div className="relative z-50 w-full max-w-[380px]" onClick={(e) => e.stopPropagation()}>
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="bg-white rounded-[28px] p-5 sm:p-6 shadow-[0_24px_70px_-20px_rgba(25,22,39,0.42)] ring-1 ring-black/[0.04] transform transition-all duration-200 scale-100 max-h-[calc(100dvh-32px)] overflow-y-auto">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-4">
            <button
              onClick={() => {
                if (!isMenu) {
                  openModal('menu');
                } else {
                  closeModal();
                }
              }}
              className="justify-self-start rounded-lg px-1 py-1 text-[11px] font-semibold text-ink-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              {!isMenu ? '← Back' : 'Close'}
            </button>
            <h3 id="modal-title" className="text-[17px] font-extrabold tracking-tight text-ink-900 text-center">
              {modalState === 'expense'
                ? isEditMode
                  ? 'Edit Expense'
                  : 'Add Expense'
                : modalState === 'savings'
                  ? isEditMode
                    ? 'Edit Goal'
                    : 'Create Savings Goal'
                  : modalState === 'task'
                    ? isEditMode
                      ? 'Edit Task'
                      : 'Create Task'
                    : modalState === 'event'
                      ? isEditMode
                        ? 'Edit Event'
                        : 'Add Event'
                      : 'Add something new'}
            </h3>
            <button
              onClick={closeModal}
              className="justify-self-end w-7 h-7 rounded-full bg-[#F4F1FE] flex items-center justify-center text-ink-500 hover:text-ink-900 hover:bg-[#EAE4FC] transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-3">
            {isMenu && (
              <div className="add-option-grid grid grid-cols-2 gap-2.5">
                <p className="col-span-2 text-[11px] leading-relaxed text-ink-500 mb-1">Choose a shortcut to get started. Your entry will be saved in the right place.</p>
                <button
                  onClick={() => openModal('expense')}
                  className="add-option-card w-full min-h-[70px] flex items-center gap-3.5 py-3 px-3.5 rounded-[18px] border border-[#F0EDF8] bg-white shadow-[0_2px_8px_rgba(37,28,74,0.035)] hover:border-[#DCD0FB] hover:bg-[#FCFBFF] hover:shadow-card active:scale-[0.99] transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="w-11 h-11 rounded-[15px] bg-[#FCE7EE] text-[#E11D48] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="6" width="18" height="13" rx="3" />
                      <path d="M16 12.5h2.5" />
                      <path d="M7 6V4.5A1.5 1.5 0 018.5 3h7A1.5 1.5 0 0117 4.5V6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-ink-900">Add Expense</div>
                    <div className="text-[11px] text-ink-500 mt-0.5">Track your spending</div>
                  </div>
                  <svg className="w-4 h-4 ml-auto text-ink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </button>
                <button
                  onClick={() => openModal('savings')}
                  className="add-option-card w-full min-h-[70px] flex items-center gap-3.5 py-3 px-3.5 rounded-[18px] border border-[#F0EDF8] bg-white shadow-[0_2px_8px_rgba(37,28,74,0.035)] hover:border-[#DCD0FB] hover:bg-[#FCFBFF] hover:shadow-card active:scale-[0.99] transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="w-11 h-11 rounded-[15px] bg-[#E3F7ED] text-[#16A34A] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2z" />
                      <path d="M16 13h2" />
                      <path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-ink-900">Create Savings Goal</div>
                    <div className="text-[11px] text-ink-500 mt-0.5">Save for your dreams</div>
                  </div>
                  <svg className="w-4 h-4 ml-auto text-ink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </button>
                <button
                  onClick={() => openModal('task')}
                  className="add-option-card w-full min-h-[70px] flex items-center gap-3.5 py-3 px-3.5 rounded-[18px] border border-[#F0EDF8] bg-white shadow-[0_2px_8px_rgba(37,28,74,0.035)] hover:border-[#DCD0FB] hover:bg-[#FCFBFF] hover:shadow-card active:scale-[0.99] transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="w-11 h-11 rounded-[15px] bg-[#ECE7FD] text-brand-600 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-ink-900">Create Task</div>
                    <div className="text-[11px] text-ink-500 mt-0.5">Stay on track</div>
                  </div>
                  <svg className="w-4 h-4 ml-auto text-ink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </button>
                <button
                  onClick={() => openModal('event')}
                  className="add-option-card w-full min-h-[70px] flex items-center gap-3.5 py-3 px-3.5 rounded-[18px] border border-[#F0EDF8] bg-white shadow-[0_2px_8px_rgba(37,28,74,0.035)] hover:border-[#DCD0FB] hover:bg-[#FCFBFF] hover:shadow-card active:scale-[0.99] transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="w-11 h-11 rounded-[15px] bg-[#FEF0DC] text-[#D97706] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="17" rx="3" />
                      <path strokeLinecap="round" d="M8 2v4M16 2v4M3 9h18" />
                      <rect x="7.5" y="12.5" width="3" height="3" rx="0.6" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-ink-900">Add Event</div>
                    <div className="text-[11px] text-ink-500 mt-0.5">Keep your schedule</div>
                  </div>
                  <svg className="w-4 h-4 ml-auto text-ink-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                </button>
              </div>
            )}

            {modalState === 'expense' && (
              <div className="space-y-3">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                    const amount = Number((form.elements.namedItem('amount') as HTMLInputElement).value);
                    const category = (form.elements.namedItem('category') as HTMLSelectElement).value as 'Food & Drinks' | 'Transport' | 'Others';
                    const date = (form.elements.namedItem('date') as HTMLInputElement).value || new Date().toISOString().split('T')[0];
                    if (!title.trim() || !validateAmount(amount)) return;
                    if (editId && editType === 'expense') {
                      await updateExpense(editId, { title, amountCentavos: Math.round(amount * 100), category, date });
                    } else {
                      await addExpense(title, amount, category, date);
                    }
                    closeModal();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Expense Title</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editExpense?.title ?? ''}
                      placeholder="e.g. Lunch at Cafe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Amount (₱)</label>
                      <input
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        defaultValue={editExpense ? (editExpense.amountCentavos / 100).toString() : ''}
                        placeholder="e.g. 120"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-bold text-ink-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Category</label>
                      <select
                        name="category"
                        defaultValue={editExpense?.category ?? 'Food & Drinks'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                      >
                        <option value="Food & Drinks">Food & Drinks</option>
                        <option value="Transport">Transport</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Date</label>
                    <input
                      name="date"
                      type="date"
                      defaultValue={editExpense?.date ?? new Date().toISOString().split('T')[0]}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-2"
                  >
                    {isEditMode ? 'Save Changes' : 'Save Expense'}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteExpense(editId!);
                        closeModal();
                      }}
                      className="w-full py-3 rounded-2xl bg-[#FCE7EE] text-[#E11D48] font-bold text-sm mt-1"
                    >
                      Delete Expense
                    </button>
                  )}
                </form>
              </div>
            )}

            {modalState === 'savings' && (
              <div className="space-y-3">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                    const saved = Number((form.elements.namedItem('saved') as HTMLInputElement).value);
                    const target = Number((form.elements.namedItem('target') as HTMLInputElement).value);
                    if (!title.trim() || target <= 0) return;
                    if (editId && editType === 'savings') {
                      await updateSavingsGoal(editId, { title, currentCentavos: Math.round(saved * 100), targetCentavos: Math.round(target * 100) });
                    } else {
                      await addSavingsGoal(title, saved, target);
                    }
                    closeModal();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Goal Name</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editGoal?.title ?? ''}
                      placeholder="e.g. Emergency Fund"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Current Saved (₱)</label>
                      <input
                        name="saved"
                        type="number"
                        min="0"
                        defaultValue={editGoal ? (editGoal.currentCentavos / 100).toString() : '500'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-bold text-ink-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Target (₱)</label>
                      <input
                        name="target"
                        type="number"
                        min="100"
                        defaultValue={editGoal ? (editGoal.targetCentavos / 100).toString() : '5000'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-bold text-ink-900 outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-2"
                  >
                    {isEditMode ? 'Save Changes' : 'Create Goal'}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteSavingsGoal(editId!);
                        closeModal();
                      }}
                      className="w-full py-3 rounded-2xl bg-[#FCE7EE] text-[#E11D48] font-bold text-sm mt-1"
                    >
                      Delete Goal
                    </button>
                  )}
                </form>
              </div>
            )}

            {modalState === 'task' && (
              <div className="space-y-3">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;
                    const dueDate = (form.elements.namedItem('dueDate') as HTMLInputElement).value;
                    const dueTime = (form.elements.namedItem('dueTime') as HTMLInputElement).value;
                    const priority = (form.elements.namedItem('priority') as HTMLSelectElement).value as 'High' | 'Medium' | 'Low';
                    if (!title.trim() || !dueDate || !dueTime) return;
                    if (editId && editType === 'task') {
                      await updateTask(editId, { title, description, dueDate, dueTime, priority });
                    } else {
                      await addTask(title, description, dueDate, dueTime, priority);
                    }
                    closeModal();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Task Title</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editTask?.title ?? ''}
                      placeholder="e.g. Review Figma Prototype"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={editTask?.description ?? ''}
                      placeholder="Add task details..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm text-ink-900 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Due Date</label>
                      <input
                        name="dueDate"
                        type="date"
                        defaultValue={editTask?.dueDate ?? new Date().toISOString().split('T')[0]}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Due Time</label>
                      <input
                        name="dueTime"
                        type="time"
                        defaultValue={editTask?.dueTime ?? '09:00'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      defaultValue={editTask?.priority ?? 'High'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-2"
                  >
                    {isEditMode ? 'Save Changes' : 'Add Task'}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteTask(editId!);
                        closeModal();
                      }}
                      className="w-full py-3 rounded-2xl bg-[#FCE7EE] text-[#E11D48] font-bold text-sm mt-1"
                    >
                      Delete Task
                    </button>
                  )}
                </form>
              </div>
            )}

            {modalState === 'event' && (
              <div className="space-y-3">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
                    const time = (form.elements.namedItem('time') as HTMLInputElement).value;
                    const location = (form.elements.namedItem('location') as HTMLInputElement).value;
                    if (!title.trim() || !date || !time) return;
                    if (editId && editType === 'schedule') {
                      await updateEvent(editId, { title, date, time, location });
                    } else {
                      await addEvent(title, date, time, location);
                    }
                    closeModal();
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Event Title</label>
                    <input
                      name="title"
                      type="text"
                      defaultValue={editEvent?.title ?? ''}
                      placeholder="e.g. Design Critique"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Date</label>
                      <input
                        name="date"
                        type="date"
                        defaultValue={editEvent?.date ?? new Date().toISOString().split('T')[0]}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 mb-1">Time</label>
                      <input
                        name="time"
                        type="time"
                        defaultValue={editEvent?.time ?? '09:00'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-700 mb-1">Location</label>
                    <input
                      name="location"
                      type="text"
                      defaultValue={editEvent?.location ?? ''}
                      placeholder="e.g. Room 204"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F1FE] text-sm font-semibold text-ink-900 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-brand-600 text-white font-bold text-sm shadow-hero mt-2"
                  >
                    {isEditMode ? 'Save Changes' : 'Save Event'}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={async () => {
                        await deleteEvent(editId!);
                        closeModal();
                      }}
                      className="w-full py-3 rounded-2xl bg-[#FCE7EE] text-[#E11D48] font-bold text-sm mt-1"
                    >
                      Delete Event
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>

          <button
            onClick={closeModal}
            className="mt-4 w-full py-3 rounded-2xl border border-[#E5DDF8] bg-[#F4F1FE] hover:bg-[#EAE4FC] text-ink-700 font-bold text-[13px] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
