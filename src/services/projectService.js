import api from './api';

// 获取所有项目（支持分页）
export const getProjects = async (params = {}) => {
  const defaultParams = { page: 0, size: 10, sortBy: 'id', sortDir: 'desc' };
  const response = await api.get('/api/projects', { 
    params: { ...defaultParams, ...params } 
  });
  return response.data.data; // { content: [], totalElements, totalPages }
};

// 获取项目详情
export const getProjectDetail = async (projectId) => {
  const response = await api.get(`/api/projects/${projectId}`);
  return response.data.data;
};

// 创建项目
export const createProject = async (projectData) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const response = await api.post('/api/projects', {
    ...projectData,
    creatorId: user.id // 自动添加创建者ID
  });
  return response.data.data;
};

// 更新项目
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/api/projects/${projectId}`, projectData);
  return response.data.data;
};

// 删除项目
export const deleteProject = async (projectId) => {
  const response = await api.delete(`/api/projects/${projectId}`);
  return response.data;
};