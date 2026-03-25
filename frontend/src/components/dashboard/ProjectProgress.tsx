import type { Project } from '../../types/project';

type Props = {
  projects: Project[];
};

const colors = ['#0052CC', '#6554C0', '#00875A', '#FF8B00', '#DE350B'];

const ProjectProgress = ({ projects }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-800">プロジェクト進捗</div>
      </div>
      <div className="px-4 py-2">
        {projects.length === 0 && (
          <p className="text-sm text-gray-400 py-4 text-center">プロジェクトがありません</p>
        )}
        {projects.map((project, i) => {
          const color    = colors[i % colors.length];
          const total    = project.task_count;
          const done     = project.completed_task_count;
          const percent  = total > 0 ? Math.round((done / total) * 100) : 0;

          return (
            <div key={project.id} className="border-b border-gray-100 py-2.5 last:border-none">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: color }} />
                  <span className="truncate text-sm font-medium text-gray-800">{project.name}</span>
                </div>
                <span className="text-xs text-gray-400 font-mono">{done} / {total} タスク</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${percent}%`, background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectProgress;
