import { useState, useEffect } from 'react';
import type { ActivityLog } from '../types/activityLog';
import { fetchActivityLogs, startTracking, stopTracking } from '../api/activityLogs';

export const useTracker = () => {
  const [activeLog, setActiveLog] = useState<ActivityLog | null>(null);
  const [elapsed, setElapsed]     = useState<number>(0);

  // ページ読み込み時に計測中ログを取得
  useEffect(() => {
    fetchActivityLogs().then((res) => {
      const tracking = res.data?.find((l: ActivityLog) => l.is_tracking);
      if (tracking) {
        setActiveLog(tracking);
        const diff = Math.floor(
          (Date.now() - new Date(tracking.started_at).getTime()) / 1000
        );
        setElapsed(diff);
      }
    });
  }, []);

  // 1秒ごとにelapsedをインクリメント
  useEffect(() => {
    if (!activeLog) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [activeLog]);

  const start = async (projectId?: number, note?: string) => {
    const log = await startTracking({ project_id: projectId, note });
    setActiveLog(log);
    setElapsed(0);
  };

  const stop = async () => {
    if (!activeLog) return;
    const log = await stopTracking(activeLog.id);
    setActiveLog(null);
    setElapsed(0);
    return log;
  };

  return { activeLog, elapsed, start, stop };
};