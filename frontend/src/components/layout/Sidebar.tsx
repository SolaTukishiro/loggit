import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  {
    path: '/',
    label: 'ダッシュボード',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    path: '/projects',
    label: 'プロジェクト一覧',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    path: '/tasks',
    label: 'タスク一覧',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
  {
    path: '/activity-logs',
    label: '活動ログ',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen flex-shrink-0 shadow-sm">
      {/* ロゴ */}
      <div className="h-14 px-4 py-3 border-b border-gray-200 flex items-center gap-2.5">
        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          Lg
        </div>
        <span className="text-base font-bold text-gray-800 tracking-tight">Loggit</span>
      </div>

      {/* ナビ */}
      <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2.5 py-2">
          メイン
        </div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm transition-colors ${
              pathname === item.path
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <span className={pathname === item.path ? 'text-blue-600' : 'text-gray-400'}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}

        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2.5 py-2 mt-2">
          その他
        </div>
        <Link
          to="/settings"
          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm transition-colors ${
            pathname === '/settings'
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
          }`}
        >
          <span className={pathname === '/settings' ? 'text-blue-600' : 'text-gray-400'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          </span>
          設定
        </Link>
      </nav>

      {/* ユーザー情報 */}
      <div className="p-2 border-t border-gray-200">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded hover:bg-gray-50 cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <span className="text-sm text-gray-600 font-medium truncate">{user?.name}</span>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          ログアウト
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;