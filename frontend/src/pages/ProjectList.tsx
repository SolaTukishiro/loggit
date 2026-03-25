import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, createProject, deleteProject } from '../api/projects';
import type { Project } from '../types/project';

const ProjectList = () => {
  const [projects, setProjects]     = useState<Project[]>([]);
  const [showForm, setShowForm]     = useState(false);
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor]           = useState('#0052CC');
  const [loading, setLoading]       = useState(false);
  const navigate                    = useNavigate();

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const project = await createProject({ name, description, color });
      setProjects((prev) => [...prev, project]);
      setShowForm(false);
      setName('');
      setDescription('');
      setColor('#0052CC');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const colors = ['#0052CC', '#6554C0', '#00875A', '#FF8B00', '#DE350B', '#00B8D9'];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-800">プロジェクト一覧</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors sm:w-auto"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          新しいプロジェクト
        </button>
      </div>

      {/* プロジェクト一覧 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: project.color ?? '#0052CC' }} />
                <span className="text-sm font-semibold text-gray-800">{project.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
            {project.description && (
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{project.description}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {project.completed_task_count} / {project.task_count} タスク
              </div>
              <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: project.task_count > 0
                      ? `${Math.round((project.completed_task_count / project.task_count) * 100)}%`
                      : '0%',
                    background: project.color ?? '#0052CC'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 新規作成モーダル */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl sm:p-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">新しいプロジェクト</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プロジェクト名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">カラー</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
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
                  {loading ? '作成中...' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
