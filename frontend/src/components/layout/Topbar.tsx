import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import { useTracker } from '../../hooks/useTracker';
import { formatElapsed } from '../../utils/formatTime';
import AllocateModal from '../activityLog/AllocateModal';
import type { ActivityLog } from '../../types/activityLog';

dayjs.locale('ja');

type Props = {
  title: string;
};

const Topbar = ({ title }: Props) => {
  const { activeLog, elapsed, start, stop } = useTracker();
  const [stoppedLog, setStoppedLog]         = useState<ActivityLog | null>(null);

  const handleStop = async () => {
    const log = await stop();
    if (log) setStoppedLog(log);
  };

  return (
    <>
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="text-lg font-semibold text-gray-800 tracking-tight">{title}</div>
        <div className="flex items-center gap-3">

          {activeLog ? (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-600">計測中</span>
              </div>
              <span className="font-mono text-sm font-semibold text-gray-800">
                {formatElapsed(elapsed)}
              </span>
              <button
                onClick={handleStop}
                className="bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded hover:bg-red-600 transition-colors"
              >
                停止
              </button>
            </div>
          ) : (
            <button
              onClick={() => start()}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
              計測開始
            </button>
          )}

          <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded font-mono">
            {dayjs().format('YYYY-MM-DD ddd').toUpperCase()}
          </div>
        </div>
      </div>

      {stoppedLog && (
        <AllocateModal
          activityLog={stoppedLog}
          onClose={() => setStoppedLog(null)}
          onSaved={() => setStoppedLog(null)}
        />
      )}
    </>
  );
};

export default Topbar;