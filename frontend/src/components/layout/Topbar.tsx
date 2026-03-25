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
  onOpenSidebar: () => void;
};

const Topbar = ({ title, onOpenSidebar }: Props) => {
  const { activeLog, elapsed, start, stop } = useTracker();
  const [stoppedLog, setStoppedLog]         = useState<ActivityLog | null>(null);

  const handleStop = async () => {
    const log = await stop();
    if (log) setStoppedLog(log);
  };

  return (
    <>
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="rounded-md border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-700 lg:hidden"
              aria-label="メニューを開く"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
            <div className="truncate text-base font-semibold tracking-tight text-gray-800 sm:text-lg">{title}</div>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">

          {activeLog ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-1.5">
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
              className="flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
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
