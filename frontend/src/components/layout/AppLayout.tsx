import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/':              'ダッシュボード',
  '/projects':      'プロジェクト一覧',
  '/tasks':         'タスク一覧',
  '/activity-logs': '活動ログ',
  '/settings':      '設定',
};

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const { pathname }        = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 lg:h-screen lg:overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          title={pageTitles[pathname] ?? 'Loggit'}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
