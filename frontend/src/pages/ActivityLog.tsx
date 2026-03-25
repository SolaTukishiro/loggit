import { useState, useEffect } from 'react';
import { fetchActivityLogs, deleteActivityLog, acknowledgeLog } from '../api/activityLogs';
import AllocateModal from '../components/activityLog/AllocateModal';
import type { ActivityLog as ActivityLogType } from '../types/activityLog';
import { formatMinutes } from '../utils/formatTime';
import dayjs from 'dayjs';

const ActivityLog = () => {
  const [logs, setLogs]               = useState<ActivityLogType[]>([]);
  const [allocateTarget, setAllocateTarget] = useState<ActivityLogType | null>(null);

  useEffect(() => {
    fetchActivityLogs().then((res) => setLogs(res.data ?? []));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    await deleteActivityLog(id);
    setLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAcknowledge = async (log: ActivityLogType) => {
    await acknowledgeLog(log.id);
    setLogs((prev) => prev.map((l) => l.id === log.id ? { ...l, acknowledged_at: new Date().toISOString() } : l));
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-6">活動ログ</h2>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {logs.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">活動ログがありません</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex flex-col gap-3 border-b border-gray-100 px-4 py-3 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center">

            {/* 状態インジケーター */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.is_tracking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />

            {/* メイン情報 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-800">
                  {log.note ?? log.project_name ?? '活動ログ'}
                </span>
                {log.project_name && (
                  <span className="text-xs text-gray-400">{log.project_name}</span>
                )}
                {log.auto_stopped && !log.acknowledged_at && (
                  <span className="text-xs bg-yellow-50 text-yellow-600 border border-yellow-200 px-1.5 py-0.5 rounded">
                    自動停止
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-xs text-gray-400 font-mono">
                  {dayjs(log.started_at).format('MM/DD HH:mm')}
                  {log.ended_at && ` 〜 ${dayjs(log.ended_at).format('HH:mm')}`}
                </span>
                {log.is_tracking ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">● 計測中</span>
                ) : (
                  <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {formatMinutes(log.duration_minutes ?? 0)}
                  </span>
                )}
              </div>
            </div>

            {/* アクション */}
            <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
              {log.auto_stopped && !log.acknowledged_at && (
                <button
                  onClick={() => handleAcknowledge(log)}
                  className="text-xs text-yellow-600 border border-yellow-300 px-2 py-1 rounded hover:bg-yellow-50"
                >
                  確認
                </button>
              )}
              {!log.is_tracking && (
                <button
                  onClick={() => setAllocateTarget(log)}
                  className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
                >
                  配賦する
                </button>
              )}
              <button
                onClick={() => handleDelete(log.id)}
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

      {/* 配賦モーダル */}
      {allocateTarget && (
        <AllocateModal
          activityLog={allocateTarget}
          onClose={() => setAllocateTarget(null)}
          onSaved={() => {
            setAllocateTarget(null);
            fetchActivityLogs().then((res) => setLogs(res.data ?? []));
          }}
        />
      )}
    </div>
  );
};

export default ActivityLog;
