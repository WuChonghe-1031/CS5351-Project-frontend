import api from './api';

// 简化获取逻辑，确保返回原始数据供前端处理
export const getProjectMembers = async (projectId) => {
  try {
    const response = await api.get(`/api/projects/${projectId}/members`);
    // 直接返回所有数据，不做深层解析，避免解析错误
    return response.data.data ||  [];
  } catch (error) {
    console.error('获取成员列表错误:', error);
    throw new Error(error.response?.data?.message || '获取成员失败');
  }
};

// 其他接口保持不变（不影响成员显示）
export const addProjectMember = async (projectId, userId, role) => {
  try {
    const response = await api.post(`/api/projects/${projectId}/members`, {
      userId,
      role
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '添加成员失败');
  }
};

export const updateMemberRole = async (projectId, userId, role) => {
  try {
    const response = await api.put(
      `/api/projects/${projectId}/members/${userId}/role`,
      { role }
    );
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || '更新角色失败');
  }
};

export const removeProjectMember = async (projectId, userId) => {
  try {
    await api.delete(`/api/projects/${projectId}/members/${userId}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || '删除成员失败');
  }
};