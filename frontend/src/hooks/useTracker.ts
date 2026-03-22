import { useState, useEffect } from 'react';
import type { ActivityLog } from '../types/activityLog';
import { fetchActivityLogs, startTracking, stopTracking } from '../api/activityLogs';

export const useTracker = () => {
  const [activeLog, setActiveLog] = useState<ActivityLog | null>(null);
  const [elapsed, setElapsed]     = useState<number>(0);

  const calculateElapsed = (startedAt: string) => {
    return Math.max(
      0,
      Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    );
  };

  // ページ読み込み時に計測中ログを取得
  useEffect(() => {
    fetchActivityLogs().then((res) => {
      const tracking = res.data?.find((l: ActivityLog) => l.is_tracking);
      if (tracking) {
        setActiveLog(tracking);
        setElapsed(calculateElapsed(tracking.started_at));
      }
    });
  }, []);

  // started_at を基準に毎回再計算し、非アクティブ復帰時の interval 間引きも補正する
  useEffect(() => {
    if (!activeLog) {
      setElapsed(0);
      return;
    }

    const syncElapsed = () => setElapsed(calculateElapsed(activeLog.started_at));
    syncElapsed();

    const timer = setInterval(syncElapsed, 1000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncElapsed();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeLog]);

  const start = async (projectId?: number, note?: string) => {
    const log = await startTracking({ project_id: projectId, note });
    setActiveLog(log);
    setElapsed(calculateElapsed(log.started_at));
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
