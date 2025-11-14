import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getProjects } from '../services/projectService';
import { getProjectDetail } from '../services/projectService';
import { getProjectMembers, removeProjectMember } from '../services/memberService'; // 新增remove导入

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    total: 0
  });
  const navigate = useNavigate();
  const location = useLocation();

  // 加载项目列表
  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects({
        page: pagination.page,
        size: pagination.size
      });
      setProjects(data.content || []);
      setPagination(prev => ({
        ...prev,
        total: data.totalElements || 0
      }));
      setError('');
    } catch (err) {
      setError('加载项目失败：' + (err.response?.data?.message || err.message));
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和刷新信号触发
  useEffect(() => {
    loadProjects();
  }, [pagination.page, pagination.size, location.state?.refresh]);

  // 分页处理
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < Math.ceil(pagination.total / pagination.size)) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>加载项目列表中...</p>
      </div>
    );
  }

  return (
    <div className="project-list-page">
      <header className="page-header">
        <h1>项目列表</h1>
        <div className="header-actions">
          <Link to="/projects/create" className="btn primary">
            创建新项目
          </Link>
          <button onClick={handleLogout} className="btn danger">
            退出登录
          </button>
        </div>
      </header>

      {error && <div className="error-alert">{error}</div>}

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>暂无项目</h2>
          <p>您当前没有任何项目，点击下方按钮创建第一个项目吧</p>
          <Link to="/projects/create" className="btn primary">
            创建新项目
          </Link>
        </div>
      ) : (
        <div className="project-table-container">
          <table className="project-table">
            <thead>
              <tr>
                <th>项目名称</th>
                <th>项目编码</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>
                    <Link to={`/projects/${project.id}`} className="project-link">
                      {project.name}
                    </Link>
                  </td>
                  <td>{project.projectCode}</td>
                  <td>
                    {new Date(project.createdAt).toLocaleString()}
                  </td>
                  <td className="action-buttons">
                    <Link to={`/projects/${project.id}`} className="btn">
                      查看
                    </Link>
                    <Link to={`/projects/${project.id}/edit`} className="btn secondary">
                      编辑
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </div>
      )}
    </div>
  );
};

export default ProjectList;