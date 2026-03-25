import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: Props) => {
  const { pathname }             = useLocation();
  const { user, logout }         = useAuth();
  const navigate                 = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    setShowUserMenu(false);
    onClose();
    await logout();
    navigate('/login');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 max-w-[85vw] flex-col border-r border-gray-200 bg-white shadow-sm transition-transform lg:static lg:z-auto lg:w-60 lg:max-w-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      {/* ロゴ */}
      <div className="flex h-14 items-center gap-2.5 border-b border-gray-200 px-4">
        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          Lg
        </div>
        <span className="text-base font-bold text-gray-800 tracking-tight">Loggit</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto rounded p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          aria-label="メニューを閉じる"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
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
            onClick={onClose}
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
          onClick={onClose}
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
      <div className="p-2 border-t border-gray-200 relative">
        <div
          className="flex items-center gap-2.5 px-2.5 py-2 rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => setShowUserMenu((prev) => !prev)}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <span className="text-sm text-gray-600 font-medium truncate">{user?.name}</span>
        </div>

        {/* ポップアップメニュー */}
        {showUserMenu && (
          <div className="absolute bottom-14 left-2 right-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{user?.email}</div>
            </div>
            <Link
              to="/settings"
              onClick={() => setShowUserMenu(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
              設定
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              ログアウト
            </button>
          </div>
        )}
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
