import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',         // 必须匹配后端 email 字段
    password: '',      // 必须匹配后端 password 字段
    confirmPassword: '', // 仅前端验证用，不传给后端
    firstName: '',     // 必须匹配后端 firstName 字段
    lastName: ''       // 必须匹配后端 lastName 字段
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 处理表单输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.trim() })); // 去除首尾空格
    if (error) setError(''); // 输入时清除错误提示
  };

  // 前端表单验证（与后端规则保持一致）
  const validateForm = () => {
    // 1. 检查必填项
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('邮箱、密码、名、姓为必填项！');
      return false;
    }

    // 2. 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('请输入有效的邮箱地址（例如：xxx@example.com）');
      return false;
    }

    // 3. 验证密码长度（与后端保持一致，例如至少6位）
    if (formData.password.length < 6) {
      setError('密码长度不能少于6位！');
      return false;
    }

    // 4. 验证密码一致性
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致！');
      return false;
    }

    return true;
  };

  // 处理注册提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      // 移除前端验证字段 confirmPassword，仅传递后端需要的参数
      const { confirmPassword, ...registerData } = formData;
      
      // 调用注册 API
      await registerUser(registerData);
      
      // 注册成功提示
      setSuccess('注册成功！即将跳转到登录页...');
      setError('');
      
      // 2秒后自动跳转登录页
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // 显示后端返回的具体错误（如邮箱已注册）
      setError(err.message);
      setSuccess('');
    } finally {
      setLoading(false); // 无论成功失败，结束加载状态
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>用户注册</h2>
        
        {/* 成功提示 */}
        {success && <div className="success-message">{success}</div>}
        {/* 错误提示 */}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* 邮箱输入 */}
          <div className="form-group">
            <label htmlFor="email">邮箱 <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱"
              disabled={loading}
              autoComplete="email" // 优化自动填充
            />
          </div>

          {/* 密码输入 */}
          <div className="form-group">
            <label htmlFor="password">密码 <span className="required">*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入至少6位密码"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* 确认密码 */}
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码 <span className="required">*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="请再次输入密码"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* 名 */}
          <div className="form-group">
            <label htmlFor="firstName">名 <span className="required">*</span></label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="请输入您的名"
              disabled={loading}
            />
          </div>

          {/* 姓 */}
          <div className="form-group">
            <label htmlFor="lastName">姓 <span className="required">*</span></label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="请输入您的姓"
              disabled={loading}
            />
          </div>

          {/* 提交按钮 */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '注册中...' : '完成注册'}
          </button>
        </form>

        {/* 登录跳转 */}
        <div className="auth-switch">
          已有账号？<Link to="/login">立即登录</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;