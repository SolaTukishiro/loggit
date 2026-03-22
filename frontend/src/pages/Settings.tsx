import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import { useToast } from '../contexts/ToastContext';
import dayjs from 'dayjs';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { showToast }     = useToast();

  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [enableTracking, setEnableTracking]   = useState(true);
  const [loadingProfile, setLoadingProfile]   = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingTracking, setLoadingTracking] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
    client.get('/settings').then((res) => {
      setEnableTracking(res.data.data.enable_task_time_tracking);
    });
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const res = await client.put('/user', { name, email });
      updateUser(res.data.data);
      showToast('プロフィールを更新しました', 'success');
    } catch {
      showToast('更新に失敗しました', 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    try {
      await client.put('/user/password', {
        current_password: currentPassword,
        password: newPassword,
      });
      showToast('パスワードを変更しました', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch {
      showToast('パスワードの変更に失敗しました', 'error');
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleTrackingToggle = async (value: boolean) => {
    const previousValue = enableTracking;
    setEnableTracking(value);
    setLoadingTracking(true);
    try {
      await client.put('/settings', { enable_task_time_tracking: value });
      showToast('設定を保存しました', 'success');
    } catch {
      setEnableTracking(previousValue);
      showToast('設定の保存に失敗しました', 'error');
    } finally {
      setLoadingTracking(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl flex flex-col gap-6">
      <h2 className="text-base font-semibold text-gray-800">設定</h2>

    {/* アカウント情報 */}
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-gray-200">
        <div className="text-sm font-semibold text-gray-800">アカウント情報</div>
    </div>
    <div className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
        {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <div className="flex flex-col gap-1">
        <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
        <div className="text-xs text-gray-400">{user?.email}</div>
        {user?.created_at && (
            <div className="text-xs text-gray-400">
            登録日：{dayjs(user.created_at).format('YYYY年MM月DD日')}
            </div>
        )}
        </div>
    </div>
    </div>

      {/* プロフィール */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-800">プロフィール</div>
        </div>
        <form onSubmit={handleProfileUpdate} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingProfile}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingProfile ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>

      {/* パスワード変更 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-800">パスワード変更</div>
        </div>
        <form onSubmit={handlePasswordUpdate} className="p-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loadingPassword}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingPassword ? '変更中...' : '変更する'}
            </button>
          </div>
        </form>
      </div>

      {/* トラッキング設定 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-sm font-semibold text-gray-800">トラッキング設定</div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-800">タスク時間配賦機能</div>
            <div className="text-xs text-gray-400 mt-0.5">停止後に配賦モーダルを表示する</div>
          </div>
          <button
            onClick={() => handleTrackingToggle(!enableTracking)}
            disabled={loadingTracking}
            className={`w-10 h-6 rounded-full transition-colors relative disabled:opacity-50 ${enableTracking ? 'bg-blue-600' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${enableTracking ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
