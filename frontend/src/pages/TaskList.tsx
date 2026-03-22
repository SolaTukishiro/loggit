import { useState, useEffect } from 'react';
import { fetchTasks, deleteTask } from '../api/tasks';
import type { Task } from '../types/task';
import { formatMinutes } from '../utils/formatTime';
import dayjs from 'dayjs';

const TaskList = () => {
  const [tasks, setTasks]           = useState<Task[]>([]);
  const [loading, setLoading]       = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [sortBy, setSortBy]         = useState<string>('created_at_desc');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filterPriority) params.priority = filterPriority;
    setLoading(true);
    fetchTasks(params).then(setTasks).finally(() => setLoading(false));
  }, [filterPriority]);

  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    await deleteTask(id);
    // 削除後にAPIから再取得（子タスクも含めて正しく反映）
    const params: Record<string, string> = {};
    if (filterPriority) params.priority = filterPriority;
    fetchTasks(params).then(setTasks);
    };

  const priorityColors: Record<number, string> = {
    1: 'bg-gray-100 text-gray-400',
    2: 'bg-yellow-50 text-yellow-600',
    3: 'bg-red-50 text-red-500',
  };

  const sorted = [...tasks].sort((a, b) => {
    if (sortBy === 'due_date_asc') {
      if (!a.due_date && !b.due_date) return b.id - a.id;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      const diff = dayjs(a.due_date).diff(dayjs(b.due_date));
      return diff !== 0 ? diff : b.id - a.id;
    }
    if (sortBy === 'priority_desc') return b.priority - a.priority;
    return b.id - a.id;
  });

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">タスク一覧</h2>

      {/* フィルターバー */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">すべての優先度</option>
          <option value="3">high</option>
          <option value="2">mid</option>
          <option value="1">low</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="created_at_desc">作成日（新しい順）</option>
          <option value="due_date_asc">期限（近い順）</option>
          <option value="priority_desc">優先度（高い順）</option>
        </select>
      </div>

      {/* タスク一覧 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {loading && (
          <div className="p-8 text-center text-gray-400 text-sm">読み込み中...</div>
        )}
        {!loading && sorted.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">タスクがありません</div>
        )}
        {!loading && sorted.map((task) => (
          <div key={task.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-800">{task.title}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}>
                  {task.priority_label}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-gray-400">{task.project_name}</span>
                <span className="text-xs text-gray-400">{task.status.name}</span>
                {task.due_date && (
                  <span className={`text-xs font-mono ${dayjs(task.due_date).isBefore(dayjs(), 'day') ? 'text-red-500' : 'text-gray-400'}`}>
                    期限：{dayjs(task.due_date).format('MM/DD')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {task.total_tracked_minutes > 0 && (
                <span className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {formatMinutes(task.total_tracked_minutes)}
                </span>
              )}
              {task.subtask_count > 0 && (
                <span className="text-xs text-gray-400 font-mono">
                  {task.completed_subtask_count}/{task.subtask_count}
                </span>
              )}
              <button
                onClick={() => handleDelete(task.id)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;