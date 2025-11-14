import api from "./api";

// 后端API基础地址（可通过环境变量配置）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * 获取项目下的任务列表
 * @param {string} projectId - 项目ID
 * @returns {Promise}
 */
export const getProjectTasks = (projectId) => {
  return api.get(`/api/projects/${projectId}/tasks`);
};

/**
 * 获取分配给当前用户的任务
 * @returns {Promise}
 */
export const getAssignedTasks = () => {
  return api.get(`/api/tasks/assigned-to-me`);
};

/**
 * 更新任务（部分更新）
 * @param {string} projectId - 项目ID
 * @param {string} taskId - 任务ID
 * @param {object} data - 要更新的任务数据
 * @returns {Promise}
 */
export const updateTask = (projectId, taskId, data) => {
  return api.patch(`/api/projects/${projectId}/tasks/${taskId}`, data);
};

/**
 * 创建任务
 * @param {string} projectId - 项目ID
 * @param {object} data - 任务数据
 * @returns {Promise}
 */
export const createTask = (projectId, data) => {
  return api.post(`/api/projects/${projectId}/tasks`, data);
};

/**
 * 替换更新任务（全量更新）
 * @param {string} projectId - 项目ID
 * @param {string} taskId - 任务ID
 * @param {object} data - 任务数据
 * @returns {Promise}
 */
export const replaceTask = (projectId, taskId, data) => {
  return api.put(`/api/projects/${projectId}/tasks/${taskId}`, data);
};