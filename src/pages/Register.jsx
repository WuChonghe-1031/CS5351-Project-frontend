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
      setError('email password lastname firstname must be filled');
      return false;
    }

    // 2. 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('please enter valid email（xxx@example.com）');
      return false;
    }

    // 3. 验证密码长度（与后端保持一致，例如至少6位）
    if (formData.password.length < 6) {
      setError('the length of password cannot be less than six！');
      return false;
    }

    // 4. 验证密码一致性
    if (formData.password !== formData.confirmPassword) {
      setError('difference enter between two password！');
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
      setSuccess('successfully registered!turn to login page...');
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
        <h2>Register</h2>
        
        {/* 成功提示 */}
        {success && <div className="success-message">{success}</div>}
        {/* 错误提示 */}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* 邮箱输入 */}
          <div className="form-group">
            <label htmlFor="email">Email <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
              disabled={loading}
              autoComplete="email" // 优化自动填充
            />
          </div>

          {/* 密码输入 */}
          <div className="form-group">
            <label htmlFor="password">Password <span className="required">*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least six"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* 确认密码 */}
          <div className="form-group">
            <label htmlFor="confirmPassword">comfirm password <span className="required">*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="enter your password again"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          {/* 名 */}
          <div className="form-group">
            <label htmlFor="firstName">firstName <span className="required">*</span></label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="firstName"
              disabled={loading}
            />
          </div>

          {/* 姓 */}
          <div className="form-group">
            <label htmlFor="lastName">lastName <span className="required">*</span></label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="lastName"
              disabled={loading}
            />
          </div>

          {/* 提交按钮 */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'register completed'}
          </button>
        </form>

        {/* 登录跳转 */}
        <div className="auth-switch">
          Have account?<Link to="/login">Loginnow!</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;