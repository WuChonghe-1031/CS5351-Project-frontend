import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProjects } from '../services/projectService';

const ProjectDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    total: 0
  });
  const navigate = useNavigate();

  // 加载所有项目
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { projects, total } = await getAllProjects({
        page: pagination.page,
        size: pagination.size
      });
      setProjects(projects);
      setPagination(prev => ({ ...prev, total }));
      setError('');
    } catch (err) {
      setError(err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [pagination.page, pagination.size]);

  // 分页控制
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>加载项目列表中...</p>
      </div>
    );
  }

  return (
    <div className="project-dashboard">
      {/* 顶部操作栏 */}
      <div className="dashboard-header">
        <h1>敏捷项目管理</h1>
        <div className="header-actions">
          <Link to="/projects/create" className="btn primary-btn">
            创建新项目
          </Link>
          <button onClick={handleLogout} className="btn danger-btn">
            退出登录
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-alert">{error}</div>
      )}

      {/* 项目统计卡片 */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>总项目数</h3>
          <p className="stat-value">{pagination.total}</p>
        </div>
        <div className="stat-card">
          <h3>进行中项目</h3>
          <p className="stat-value">
            {projects.filter(p => p.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>已完成项目</h3>
          <p className="stat-value">
            {projects.filter(p => p.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* 项目列表 */}
      <div className="projects-section">
        <h2>所有项目</h2>
        
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>暂无项目数据</h3>
            <p>点击"创建新项目"开始敏捷开发之旅</p>
            <Link to="/projects/create" className="btn primary-btn">
              创建第一个项目
            </Link>
          </div>
        ) : (
          <>
            <div className="projects-table">
              <table>
                <thead>
                  <tr>
                    <th>项目名称</th>
                    <th>编码</th>
                    <th>状态</th>
                    <th>迭代次数</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="project-row">
                      <td>
                        <Link to={`/projects/${project.id}`} className="project-link">
                          {project.name}
                        </Link>
                      </td>
                      <td>{project.code}</td>
                      <td>
                        <span className={`status-badge ${project.status.toLowerCase()}`}>
                          {project.status === 'ACTIVE' ? '进行中' : 
                           project.status === 'COMPLETED' ? '已完成' : '规划中'}
                        </span>
                      </td>
                      <td>{project.sprintCount || 0}</td>
                      <td>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/projects/${project.id}`} className="btn btn-sm">
                            详情
                          </Link>
                          <Link to={`/projects/${project.id}/edit`} className="btn btn-sm secondary">
                            编辑
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页控件 */}
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
              >
                上一页
              </button>
              <span>
                第 {pagination.page + 1} 页 / 共 {Math.ceil(pagination.total / pagination.size)} 页
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={(pagination.page + 1) * pagination.size >= pagination.total}
              >
                下一页
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDashboard;