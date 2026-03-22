import { useState, useEffect } from 'react';
import { useTracker } from '../hooks/useTracker';
import { fetchSummary } from '../api/activityLogs';
import { fetchProjects } from '../api/projects';
import { fetchTasks } from '../api/tasks';
import StatCard from '../components/dashboard/StatCard';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import ProjectProgress from '../components/dashboard/ProjectProgress';
import { formatElapsed, formatMinutes } from '../utils/formatTime';
import type { Project } from '../types/project';
import type { Task } from '../types/task';
import dayjs from 'dayjs';

const Dashboard = () => {
  const { activeLog, elapsed, stop } = useTracker();
  const [period, setPeriod]           = useState<'week' | 'month'>('week');
  const [summary, setSummary]         = useState<any>(null);
  const [projects, setProjects]       = useState<Project[]>([]);
  const [dueTasks, setDueTasks]       = useState<Task[]>([]);

  useEffect(() => {
    fetchSummary(period).then(setSummary);
  }, [period]);

  useEffect(() => {
    fetchProjects().then(setProjects);
    fetchTasks({ due_date: dayjs().format('YYYY-MM-DD') }).then((tasks) => {
      // Doneステータス（order:3）以外のタスクだけ表示
      setDueTasks(tasks.filter((t) => t.status.order !== 3));
    });
  }, []);

  return (
    <div className="p-6 flex flex-col gap-4">

      {/* 打刻ウィジェット */}
      {activeLog && (
        <div className="bg-white border border-gray-200 border-l-4 border-l-green-500 rounded-lg px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">計測中</span>
            </div>
            <div className="text-sm font-semibold text-gray-800">
              {activeLog.project_name ?? 'プロジェクト未設定'}
            </div>
            {activeLog.note && (
              <div className="text-xs text-gray-400">{activeLog.note}</div>
            )}
          </div>
          <div className="text-center">
            <div className="font-mono text-3xl font-semibold text-gray-800 tracking-wide">
              {formatElapsed(elapsed)}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">経過時間</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={stop}
              className="flex items-center gap-1.5 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              停止
            </button>
          </div>
        </div>
      )}

      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="今週の活動時間"
          value={summary ? formatMinutes(summary.total_activity_minutes) : '-'}
        />
        <StatCard
          label="今週の配賦時間"
          value={summary ? formatMinutes(summary.total_tracked_minutes) : '-'}
        />
        <StatCard
          label="今日の期限タスク"
          value={dueTasks.length}
          sub={`${dueTasks.filter(t => !t.deleted_at).length}件 未完了`}
          subColor="red"
        />
      </div>

      {/* グラフ + 期限タスク */}
      <div className="grid grid-cols-2 gap-4">
        <WeeklyChart
          data={[]}
          period={period}
          onChangePeriod={setPeriod}
        />
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="text-sm font-semibold text-gray-800">今日の期限タスク</div>
          </div>
          <div className="px-4 py-2">
            {dueTasks.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">期限タスクはありません</p>
            )}
            {dueTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-none">
                <div className="w-3.5 h-3.5 border-2 border-gray-300 rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 truncate">{task.title}</div>
                  <div className="text-xs text-gray-400">{task.project_name}</div>
                </div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                  task.priority === 3 ? 'bg-red-50 text-red-500' :
                  task.priority === 2 ? 'bg-yellow-50 text-yellow-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {task.priority_label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* プロジェクト進捗 */}
      <ProjectProgress projects={projects} />

    </div>
  );
};

export default Dashboard;