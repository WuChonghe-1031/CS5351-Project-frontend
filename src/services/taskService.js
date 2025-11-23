import api from './api';

// 1. 获取项目下所有任务（GET）
export const getProjectTasks = async (projectId, pageable = {
  page: 0,       // 默认第1页（从0开始计数）
  size: 10,      // 每页默认10条（足够显示大部分情况）
  sort: ['id,desc'] // 默认按ID倒序（新创建的任务在前面）
}) => {
  console.log(`[API Request] getProjectTasks with pageable:`, pageable);
  
  try {
    // 将 pageable 参数转换为查询字符串
    const params = new URLSearchParams();
    params.append('pageable.page', pageable.page);
    params.append('pageable.size', pageable.size);
    
    // 处理排序参数（可能有多个排序条件）
    if (Array.isArray(pageable.sort)) {
      pageable.sort.forEach((sortItem, index) => {
        params.append(`pageable.sort[${index}]`, sortItem);
      });
    }

    // 发送带分页参数的请求
    const response = await api.get(
      `/api/projects/${projectId}/tasks?${params.toString()}`
    );

    console.log(`[API Response] 任务分页数据:`, response.data);
    
    // 后端通常会返回 { content: [], totalElements: 0, ... } 结构
    return {
      tasks: response.data.content || [], // 任务列表数组
      total: response.data.totalElements || 0, // 总任务数
      currentPage: response.data.number || 0, // 当前页码
      totalPages: response.data.totalPages || 0 // 总页数
    };
  } catch (error) {
    console.error(`[API Error] 获取任务失败:`, error);
    throw new Error(`获取任务失败: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * 创建任务（POST）
 * @param {number} projectId - 项目ID（整数）
 * @param {Object} taskData - 任务数据（匹配API请求体）
 */
export const createTask = async (projectId, taskData) => {
  try {
    // 验证创建任务的必填字段
    const requiredFields = ['title', 'status'];
    const missingFields = requiredFields.filter(field => !(field in taskData));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields for create: ${missingFields.join(', ')}`);
    }

    const response = await api.post(
      `/api/projects/${Number(projectId)}/tasks`, // 路径参数为数字
      taskData // 仅包含title、description、status、assigneeId
    );
    return response.data.data;
  } catch (error) {
    console.error('Create task API error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to create task');
  }
};

// 更新任务：保持之前的逻辑（适配更新接口）
export const updateTask = async (projectId, taskId, taskData) => {
  try {
    const requiredFields = ['title', 'status', 'storyPoints', 'version'];
    const missingFields = requiredFields.filter(field => !(field in taskData));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields for update: ${missingFields.join(', ')}`);
    }

    const response = await api.put(
      `/api/projects/${Number(projectId)}/tasks/${Number(taskId)}`,
      taskData
    );
    return response.data.data;
  } catch (error) {
    console.error('Update task API error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to update task');
  }
};




// 4. 部分更新任务（PATCH，如需使用）
export const patchTask = async (projectId, taskId, partialData) => {
  // 路径与方法严格匹配：PATCH /api/projects/{projectId}/tasks/{taskId}
  const response = await api.patch(`/api/projects/${projectId}/tasks/${taskId}`, partialData);
  return response.data.data;
};

// 5. 获取分配给我的任务（GET）
export const getAssignedTasks = async () => {
  // 路径与方法严格匹配：GET /api/tasks/assigned-to-me
  const response = await api.get('/api/tasks/assigned-to-me');
  return response.data.data || [];
};