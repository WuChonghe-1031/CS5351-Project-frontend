import api from './api';

/**
 * 用户登录
 * @param {Object} credentials - { email, password }
 * @returns {Promise} 登录结果（含 Token）
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    // const response = { data: { data: { token: "test-token" } } }; // Mock response for testing
    // 从后端响应的 data 中提取 Token（需与后端实际字段匹配）
    const token = response.data?.data?.token;
    // const token = "test-token"; 
    if (!token) {
      throw new Error('登录失败：未获取到授权令牌');
    }
    // 存储 Token 到本地
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    // 提取后端错误信息
    const errorMsg = 
      error.response?.data?.message || 
      error.message || 
      '登录失败，请检查邮箱或密码';
    throw new Error(errorMsg);
  }
};
/**
 * 用户注册
 * @param {Object} userData - { email, password, firstName, lastName }
 * @returns {Promise} 注册结果
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    const errorMsg = 
      error.response?.data?.message || 
      error.message || 
      '注册失败，请检查输入';
    throw new Error(errorMsg);
  }
};