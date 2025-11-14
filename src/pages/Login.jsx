import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import '../styles/Login.css'; // 引入样式文件

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 若已登录，直接跳转到项目列表
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/projects');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('邮箱和密码不能为空！');
      return;
    }

    try {
      setLoading(true);
      await loginUser(formData);
      navigate('/projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>登录 - 项目管理平台</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱地址"
              disabled={loading}
              autoComplete="email"
              required
              className={error && !formData.email ? 'error' : ''}
            />
            <div className="form-helper">请输入有效的邮箱地址</div>
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              disabled={loading}
              autoComplete="current-password"
              required
              className={error && !formData.password ? 'error' : ''}
            />
            <div className="form-helper">密码长度至少6位</div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div className="auth-switch">
          还没有账号？<Link to="/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;