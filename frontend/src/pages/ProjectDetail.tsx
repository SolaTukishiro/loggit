import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProject } from '../api/projects';
import { fetchProjectTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import type { Project, ProjectStatus } from '../types/project';
import type { Task } from '../types/task';

const ProjectDetail = () => {
  const navigate                        = useNavigate();
  const { id }                          = useParams<{ id: string }>();
  const [project, setProject]           = useState<Project | null>(null);
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [showForm, setShowForm]         = useState(false);
  const [formStatus, setFormStatus]     = useState<number | null>(null);
  const [title, setTitle]               = useState('');
  const [priority, setPriority]         = useState<1 | 2 | 3>(1);
  const [loading, setLoading]           = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [isNotFound, setIsNotFound]     = useState(false);
  const [retryKey, setRetryKey]         = useState(0);
  const projectId                       = Number(id);

  useEffect(() => {
    let active = true;

    if (!id || Number.isNaN(projectId)) {
      setProject(null);
      setTasks([]);
      setLoadingProject(false);
      setIsNotFound(true);
      setError('プロジェクトが見つかりません。');
      return;
    }

    const loadProject = async () => {
      setLoadingProject(true);
      setError(null);
      setIsNotFound(false);
      setProject(null);
      setTasks([]);

      try {
        const [projectData, taskData] = await Promise.all([
          fetchProject(projectId),
          fetchProjectTasks(projectId),
        ]);

        if (!active) return;
        setProject(projectData);
        setTasks(taskData);
      } catch (err) {
        if (!active) return;

        const status = axios.isAxiosError(err) ? err.response?.status : undefined;
        setProject(null);
        setTasks([]);

        if (status === 403 || status === 404) {
          setIsNotFound(true);
          setError('このプロジェクトは表示できません。削除されたか、アクセス権がありません。');
        } else {
          setError('プロジェクトの読み込みに失敗しました。ネットワークを確認して再試行してください。');
        }
      } finally {
        if (active) {
          setLoadingProject(false);
        }
      }
    };

    void loadProject();

    return () => {
      active = false;
    };
  }, [id, projectId, retryKey]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !formStatus) return;
    setLoading(true);
    try {
      const task = await createTask(project.id, {
        title,
        status_id: formStatus,
        priority,
      });
      setTasks((prev) => [...prev, task]);
      setShowForm(false);
      setTitle('');
      setPriority(1);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, statusId: number) => {
    const task = await updateTask(taskId, { status_id: statusId });
    setTasks((prev) => prev.map((t) => t.id === taskId ? task : t));
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm('削除しますか？')) return;
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const priorityColors: Record<number, string> = {
    1: 'bg-gray-100 text-gray-400',
    2: 'bg-yellow-50 text-yellow-600',
    3: 'bg-red-50 text-red-500',
  };

  if (loadingProject) {
    return <div className="p-4 text-gray-400 sm:p-6">読み込み中...</div>;
  }

  if (error || !project) {
    return (
      <div className="p-4 sm:p-6">
        <div className="max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-800">
            {isNotFound ? 'プロジェクトが見つかりません' : 'プロジェクトを読み込めませんでした'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {error ?? 'プロジェクトの表示に失敗しました。'}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              プロジェクト一覧へ戻る
            </button>
            {!isNotFound && (
              <button
                type="button"
                onClick={() => setRetryKey((current) => current + 1)}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                再試行
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: project.color ?? '#0052CC' }} />
          <h2 className="truncate text-base font-semibold text-gray-800">{project.name}</h2>
        </div>
        <button
          onClick={() => { setShowForm(true); setFormStatus(project.statuses[0]?.id ?? null); }}
          className="flex w-full items-center justify-center gap-1.5 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors sm:w-auto"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          タスクを追加
        </button>
      </div>

      {/* カンバンボード */}
      <div className="flex flex-1 gap-4 overflow-x-auto pb-4">
        {project.statuses.map((status: ProjectStatus) => {
          const columnTasks = tasks.filter((t) => t.status.id === status.id);
          return (
            <div key={status.id} className="w-[85vw] max-w-sm flex-shrink-0 sm:w-72">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700">{status.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-mono">
                    {columnTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => { setShowForm(true); setFormStatus(status.id); }}
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {columnTasks.map((task) => (
                  <div key={task.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex-1 break-words text-sm text-gray-800">{task.title}</span>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}>
                        {task.priority_label}
                      </span>
                      <select
                        value={task.status.id}
                        onChange={(e) => handleStatusChange(task.id, Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-gray-400 border-none outline-none bg-transparent cursor-pointer"
                      >
                        {project.statuses.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* タスク作成モーダル */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl sm:p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">タスクを追加</h3>
            <form onSubmit={handleCreateTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                <select
                  value={formStatus ?? ''}
                  onChange={(e) => setFormStatus(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  {project.statuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>low</option>
                  <option value={2}>mid</option>
                  <option value={3}>high</option>
                </select>
              </div>
              <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '追加中...' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
