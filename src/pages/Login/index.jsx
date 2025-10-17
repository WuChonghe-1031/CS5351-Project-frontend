import React, { useState, useEffect } from 'react';
import styles from './login.module.css';

const Login = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState('login'); // 'login' 或 'register'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // 切换Tab时重置表单和错误信息
  useEffect(() => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  }, [activeTab]);

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 实时清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    const { username, password, confirmPassword } = formData;

    // 通用验证（用户名和密码）
    if (!username.trim()) newErrors.username = '用户名不能为空';
    if (!password) newErrors.password = '密码不能为空';
    else if (password.length < 6) newErrors.password = '密码至少6个字符';

    // 注册页额外验证
    if (activeTab === 'register') {
      if (!confirmPassword) newErrors.confirmPassword = '请确认密码';
      else if (confirmPassword !== password) newErrors.confirmPassword = '两次密码不一致';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // 无错误返回true
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 模拟登录/注册请求
    if (activeTab === 'login') {
      console.log('登录提交:', { username: formData.username, password: formData.password });
      alert('登录成功！（实际项目中会调用API）');
    } else {
      console.log('注册提交:', { username: formData.username, password: formData.password });
      alert('注册成功！（实际项目中会调用API）');
      setActiveTab('login'); // 注册成功后切换到登录页
    }
  };

  return (
    <div className={styles.container}>
      {/* Tab切换栏 */}
      <div className={styles.tabs}>
        <div 
          className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
          onClick={() => setActiveTab('login')}
        >
          登录
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
          onClick={() => setActiveTab('register')}
        >
          注册
        </div>
      </div>

      {/* 登录表单 */}
      <div className={`${styles.formContainer} ${activeTab === 'login' ? styles.visible : styles.hidden}`}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="请输入用户名"
            />
            <div className={styles.error}>{errors.username}</div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="请输入密码"
            />
            <div className={styles.error}>{errors.password}</div>
          </div>

          <button type="submit" className={styles.button}>
            登录
          </button>
        </form>
      </div>

      {/* 注册表单 */}
      <div className={`${styles.formContainer} ${activeTab === 'register' ? styles.visible : styles.hidden}`}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="请设置用户名"
            />
            <div className={styles.error}>{errors.username}</div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="请设置密码（至少6位）"
            />
            <div className={styles.error}>{errors.password}</div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>确认密码</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="请再次输入密码"
            />
            <div className={styles.error}>{errors.confirmPassword}</div>
          </div>

          <button type="submit" className={styles.button}>
            注册
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;