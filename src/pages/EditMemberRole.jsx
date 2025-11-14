import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectMembers, updateMemberRole } from '../services/memberService';

const EditMemberRole = () => {
  const { projectId, userId } = useParams();
  const [member, setMember] = useState(null);
  const [role, setRole] = useState('MEMBER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // 加载成员信息
  useEffect(() => {
    const loadMember = async () => {
      try {
        setLoading(true);
        const membersRes = await getProjectMembers(projectId);
        // 从成员列表中找到目标用户
        const targetMember = membersRes.members.find(m => m.user.id === Number(userId));
        if (!targetMember) {
          setError('未找到该成员');
          return;
        }
        setMember(targetMember);
        setRole(targetMember.role);
      } catch (err) {
        setError('加载成员信息失败：' + err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMember();
  }, [projectId, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (member?.role === role) {
      setError('请选择不同的角色');
      return;
    }

    try {
      setLoading(true);
      // 调用更新角色 API，传递用户ID
      await updateMemberRole(projectId, Number(userId), role);
      setSuccess('角色更新成功！');
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>加载成员信息中...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="error-page">
        <h2>成员信息加载失败</h2>
        <p>{error || '未找到该成员'}</p>
        <Link to={`/projects/${projectId}`} className="btn secondary">返回项目详情</Link>
      </div>
    );
  }

  return (
    <div className="edit-role-page">
      <Link to={`/projects/${projectId}`} className="btn secondary">
        ← 返回项目详情
      </Link>

      <div className="form-card">
        <h1>编辑成员角色（UserID: {userId}）</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="role-form">
          <div className="form-group">
            <label>成员信息</label>
            <div className="member-info">
              <p>用户ID：{member.user.id}</p>
              <p>用户名：{`${member.user.firstName} ${member.user.lastName}`}</p>
              <p>邮箱：{member.user.email}</p>
              <p>当前角色：{member.role === 'ADMIN' ? '管理员' : '普通成员'}</p>
            </div>
          </div>
          
          <div className="form-group">
            <label>新角色 <span className="required">*</span></label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading || success}
            >
              <option value="MEMBER">普通成员</option>
              <option value="ADMIN">管理员</option>
            </select>
          </div>
          
          <div className="form-actions">
            <Link 
              to={`/projects/${projectId}`} 
              className="btn secondary"
              disabled={loading}
            >
              取消
            </Link>
            <button
              type="submit"
              className="btn primary"
              disabled={loading || success}
            >
              {loading ? '更新中...' : '更新角色'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberRole;