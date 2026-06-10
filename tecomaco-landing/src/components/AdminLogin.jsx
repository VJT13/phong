import { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function AdminLogin() {
  const { login } = usePortfolio();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ tài khoản và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(username, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-glass-card">
        <div className="admin-login-header">
          <div className="login-logo">Phong<span>Bui</span></div>
          <h2>Portfolio Admin Access</h2>
          <p>Nhập tài khoản quản trị viên để tiếp tục cấu hình</p>
        </div>

        {error && (
          <div className="admin-login-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-label">Tài khoản (Username)</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="Nhập tài khoản..." 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Mật khẩu (Password)</label>
            <input 
              type="password" 
              className="admin-input" 
              placeholder="Nhập mật khẩu..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="admin-btn-primary login-btn" disabled={loading}>
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>

        <a href="#" className="login-back-link">← Quay về Trang chủ</a>
      </div>
    </div>
  );
}
