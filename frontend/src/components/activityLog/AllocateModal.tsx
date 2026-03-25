import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { fetchProjects } from '../../api/projects';
import { fetchProjectTasks } from '../../api/tasks';
import { createTimeLog } from '../../api/timeLogs';
import type { ActivityLog } from '../../types/activityLog';
import type { Project } from '../../types/project';
import type { Task } from '../../types/task';
import { formatMinutes } from '../../utils/formatTime';

type Props = {
  activityLog: ActivityLog;
  onClose: () => void;
  onSaved: () => void;
};

type Allocation = {
  task_id: number | null;
  duration_minutes: number;
  note: string;
};

const AllocateModal = ({ activityLog, onClose, onSaved }: Props) => {
  const [projects, setProjects]     = useState<Project[]>([]);
  const [tasks, setTasks]           = useState<Task[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([
    { task_id: null, duration_minutes: 0, note: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const totalAllocated = allocations.reduce((sum, a) => sum + a.duration_minutes, 0);
  const activityMinutes = activityLog.duration_minutes ?? 0;
  const isOver = totalAllocated > activityMinutes;

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setTasks([]);
      return;
    }

    fetchProjectTasks(selectedProject).then(setTasks);
  }, [selectedProject]);

  useEffect(() => {
    const validTaskIds = new Set(tasks.map((task) => task.id));
    setAllocations((prev) => prev.map((allocation) => (
      allocation.task_id && !validTaskIds.has(allocation.task_id)
        ? { ...allocation, task_id: null }
        : allocation
    )));
  }, [tasks]);

  const addRow = () => {
    setAllocations((prev) => [...prev, { task_id: null, duration_minutes: 0, note: '' }]);
  };

  const removeRow = (index: number) => {
    setAllocations((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: keyof Allocation, value: number | string | null) => {
    setAllocations((prev) => prev.map((a, i) => i === index ? { ...a, [field]: value } : a));
  };

  const handleProjectChange = (value: string) => {
    const projectId = Number(value) || null;
    setSelectedProject(projectId);
    setTasks([]);
    setAllocations((prev) => prev.map((allocation) => ({ ...allocation, task_id: null })));
  };

  const handleSave = async () => {
    const valid = allocations.filter((a) => a.task_id && a.duration_minutes > 0);
    if (valid.length === 0) { onClose(); return; }
    setLoading(true);
    try {
      await Promise.all(valid.map((a) =>
        createTimeLog(a.task_id!, {
          duration_minutes: a.duration_minutes,
          activity_log_id: activityLog.id,
          worked_on: dayjs(activityLog.started_at).format('YYYY-MM-DD'),
          note: a.note || undefined,
        })
      ));
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-gray-800">時間を配賦する</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* 活動時間サマリー */}
        <div className="mb-4 flex flex-col gap-2 rounded-lg bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            総活動時間：<span className="font-mono font-semibold text-gray-800">{formatMinutes(activityMinutes)}</span>
          </div>
          <div className={`text-sm font-mono font-semibold ${isOver ? 'text-red-500' : 'text-blue-600'}`}>
            配賦済み：{formatMinutes(totalAllocated)}
            {isOver && <span className="text-xs ml-1">（超過）</span>}
          </div>
        </div>

        {/* プロジェクット選択 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">プロジェクト</label>
          <select
            value={selectedProject ?? ''}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">選択してください</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* 配賦行 */}
        <div className="flex flex-col gap-2 mb-4">
          {allocations.map((alloc, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_80px_minmax(0,140px)_auto] sm:items-center">
              <select
                value={alloc.task_id ?? ''}
                onChange={(e) => updateRow(i, 'task_id', Number(e.target.value) || null)}
                className="min-w-0 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">タスクを選択</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={alloc.duration_minutes || ''}
                onChange={(e) => updateRow(i, 'duration_minutes', Number(e.target.value))}
                placeholder="分"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                value={alloc.note}
                onChange={(e) => updateRow(i, 'note', e.target.value)}
                placeholder="メモ"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              />
              {allocations.length > 1 && (
                <button onClick={() => removeRow(i)} className="justify-self-end text-gray-300 hover:text-red-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          + タスクを追加
        </button>

        {isOver && (
          <p className="text-xs text-red-500 mb-3">配賦時間が総活動時間を超えています。このまま保存できますが確認してください。</p>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            スキップ
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocateModal;
