import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectDetail } from '../services/projectService';
import { getProjectMembers, removeProjectMember } from '../services/memberService';

import { Card, Button, Descriptions } from 'antd';
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
        setError('fail to load project: ' + err.message);
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
    if (window.confirm(`Are you sure to remove ${username} ？`)) {
      try {
        await removeProjectMember(projectId, userId);
        refreshMembers(); // 删除后立即刷新
      } catch (err) {
        alert('fail to delete ' + err.message);
      }
    }
  };
  


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>loading....</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="error-page">
        <h2>fail to load</h2>
        <p>{error || 'cannot get information'}</p>
        <button onClick={() => window.location.reload()} className="btn">retry</button>
        <Link to="/projects" className="btn secondary">返回列表</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <header className="page-header">
        <Link to="/projects" className="btn secondary">← Back</Link>
        <div className="header-actions">
          <Link to={`/projects/${projectId}/tasks`} className="btn">Task</Link>
          <Link to={`/projects/${projectId}/edit`} className="btn">Edit</Link>
          <Link to={`/projects/${projectId}/members/add`} className="btn primary">Add member</Link>
          {/* --- 在这里添加新的按钮 --- */}
          <Link to="/codeAnalysis" className="btn secondary">
            CodeAnalysis
          </Link>
          <Link to="/codeReview" className="btn secondary">
            CodeReview
          </Link>
          {/* ------------------------- */}
        </div>
      </header>
      
      <div className="project-info-card">
        <h1>{project.name}</h1>
        <div className="project-meta">
          <span>Project No.{project.projectCode}</span>
          <span>Time{new Date(project.createdAt).toLocaleString()}</span>
          <span>Creator{project.creatorName}</span>
        </div>
        <div className="project-description">
          <h3>Description</h3>
          <p>{project.description || '无描述'}</p>
        </div>
      </div>

      {/* 成员列表核心区域 */}
      <div className="project-members-section">
        <h2>Member ({members.length})</h2>
        
        {/* 显示原始数据（调试用，上线可删除） */}
        <div style={{ display: 'none' }}>
          <pre>成员原始数据: {JSON.stringify(members, null, 2)}</pre>
        </div>
        
        {members.length === 0 ? (
          <div className="empty-state">
            <p>Cannot find a member please add one</p>
            <Link to={`/projects/${projectId}/members/add`} className="btn primary">
              Add
            </Link>
          </div>
        ) : (
          <table className="members-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Character</th>
                <th>Join time</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {/* 强制循环渲染，即使数据格式略有差异 */}
              {members.map((member, index) => (
                <tr key={member.user.id || index}> {/* 兼容无userId的情况 */}
                  <td>{member.user.id || 'UnknownID'}</td>
                  <td>{member.user.firstName || 'Unknown member'}</td>
                  <td>
                    {member.role === 'ADMIN' ? 'ADMIN' : 
                     member.role === 'MEMBER' ? 'MEMBER' : 
                     member.role || 'Unsetting'}
                  </td>
                  <td>
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleString() : 'Unknown time'}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn secondary"
                      onClick={() => navigate(`/projects/${projectId}/members/${member.user.id}/edit`)}
                      disabled={!member.user.id}
                    >
                      Edit role
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => handleRemoveMember(member.user.id, member.user.firstName)}
                      disabled={!member.user.id}
                    >
                      Remove
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