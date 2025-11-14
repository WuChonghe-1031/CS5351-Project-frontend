import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectDetail } from '../services/projectService';
import { getProjectMembers, removeProjectMember } from '../services/memberService';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  // 强制初始化空数组，避免undefined导致的渲染问题
  const [members, setMembers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 单独提取成员加载逻辑，确保失败后可重试
  const loadMembers = async () => {
    try {
      const response = await getProjectMembers(projectId);
      // 兼容不同后端返回格式（最常见的两种情况）
      const memberList = response.members || response.content || response || [];
      setMembers(memberList);
      console.log('加载成员成功:', memberList); // 调试用，可删除
    } catch (err) {
      setError('成员加载失败: ' + err.message);
      console.error('成员加载错误:', err); // 调试用，可删除
    }
  };

  // 加载项目详情和成员
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 先加载项目详情
        const projectData = await getProjectDetail(projectId);
        setProject(projectData);
        // 再加载成员（确保项目存在）
        await loadMembers();
      } catch (err) {
        setError('项目加载失败: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [projectId]);

  // 手动刷新成员列表（用于删除后重新加载）
  const refreshMembers = async () => {
    setLoading(true);
    await loadMembers();
    setLoading(false);
  };

  // 删除成员
  const handleRemoveMember = async (userId, username) => {
    if (window.confirm(`确定移除 ${username} 吗？`)) {
      try {
        await removeProjectMember(projectId, userId);
        refreshMembers(); // 删除后立即刷新
      } catch (err) {
        alert('删除失败: ' + err.message);
      }
    }
  };
  


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="error-page">
        <h2>项目加载失败</h2>
        <p>{error || '无法获取项目信息'}</p>
        <button onClick={() => window.location.reload()} className="btn">重试</button>
        <Link to="/projects" className="btn secondary">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <header className="page-header">
        <Link to="/projects" className="btn secondary">← 返回列表</Link>
        <div className="header-actions">
          <Link to={`/projects/${projectId}/edit`} className="btn">编辑项目</Link>
          <Link to={`/projects/${projectId}/members/add`} className="btn primary">添加成员</Link>
        </div>
      </header>

      <div className="project-info-card">
        <h1>{project.name}</h1>
        <div className="project-meta">
          <span>项目编码：{project.projectCode}</span>
          <span>创建时间：{new Date(project.createdAt).toLocaleString()}</span>
          <span>创建者：{project.creatorName}</span>
        </div>
        <div className="project-description">
          <h3>项目描述</h3>
          <p>{project.description || '无描述'}</p>
        </div>
      </div>

      {/* 成员列表核心区域 */}
      <div className="project-members-section">
        <h2>项目成员 ({members.length})</h2>
        
        {/* 显示原始数据（调试用，上线可删除） */}
        <div style={{ display: 'none' }}>
          <pre>成员原始数据: {JSON.stringify(members, null, 2)}</pre>
        </div>
        
        {members.length === 0 ? (
          <div className="empty-state">
            <p>未找到成员，请添加成员</p>
            <Link to={`/projects/${projectId}/members/add`} className="btn primary">
              添加成员
            </Link>
          </div>
        ) : (
          <table className="members-table">
            <thead>
              <tr>
                <th>用户ID</th>
                <th>用户名</th>
                <th>角色</th>
                <th>加入时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {/* 强制循环渲染，即使数据格式略有差异 */}
              {members.map((member, index) => (
                <tr key={member.user.id || index}> {/* 兼容无userId的情况 */}
                  <td>{member.user.id || '未知ID'}</td>
                  <td>{member.user.firstName || '未知用户'}</td>
                  <td>
                    {member.role === 'ADMIN' ? '管理员' : 
                     member.role === 'MEMBER' ? '普通成员' : 
                     member.role || '未设置'}
                  </td>
                  <td>
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleString() : '未知时间'}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn secondary"
                      onClick={() => navigate(`/projects/${projectId}/members/${member.user.id}/edit`)}
                      disabled={!member.user.id}
                    >
                      编辑角色
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleRemoveMember(member.user.id, member.user.firstName)}
                      disabled={!member.user.id}
                    >
                      移除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;