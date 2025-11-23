// src/pages/ProjectTasks.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectTasks } from '../services/taskService';

const ProjectTasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 分页状态（默认第一页，10条/页）
  const [pageable, setPageable] = useState({
    page: 0,
    size: 10,
    sort: ['id,desc']
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // 传递 projectId 和 pageable 参数
      const result = await getProjectTasks(projectId, pageable);
      setTasks(result.tasks); // 从返回结果中提取任务列表
      setTotalTasks(result.total); // 保存总任务数
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载或分页参数变化时重新获取数据
  useEffect(() => {
    fetchTasks();
  }, [projectId, pageable]);

  // 分页控制：上一页/下一页
  const handlePageChange = (newPage) => {
    setPageable(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="project-tasks-page">
      <Link to={`/projects/${projectId}`} className="btn secondary">Return to project details</Link>
      <h1>Total（ {totalTasks} tasks）</h1>
      <Link to={`/projects/${projectId}/tasks/create`} className="btn primary">New</Link>

      {loading ? (
        <div className="loading">loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks</p>
        </div>
      ) : (
        <>
          <table className="tasks-table">
            {/* 表格内容不变，与之前相同 */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Person in charge</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.status}</td>
                  <td>{task.assignee?.firstName || '未分配'}</td>
                  <td>
                    <Link to={`/projects/${projectId}/tasks/${task.id}`} className="btn">Details</Link>
                    <Link to={`/projects/${projectId}/tasks/${task.id}/edit`} className="btn secondary">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 分页控件 */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pageable.page - 1)}
              disabled={pageable.page === 0}
            >
              PgUp
            </button>
            <span>
              {pageable.page + 1} 
            </span>
            <button
              onClick={() => handlePageChange(pageable.page + 1)}
              disabled={(pageable.page + 1) * pageable.size >= totalTasks}
            >
              PgDn
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectTasks;