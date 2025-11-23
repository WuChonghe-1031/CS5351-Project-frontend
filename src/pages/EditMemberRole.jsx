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
          setError('Cannot find');
          return;
        }
        setMember(targetMember);
        setRole(targetMember.role);
      } catch (err) {
        setError('fail to load' + err.message);
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
      setError('please choose different member');
      return;
    }

    try {
      setLoading(true);
      // 调用更新角色 API，传递用户ID
      await updateMemberRole(projectId, Number(userId), role);
      setSuccess('update successfully!');
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
        <p>loading member informations...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="error-page">
        <h2>fail to load member information</h2>
        <p>{error || 'cannot find'}</p>
        <Link to={`/projects/${projectId}`} className="btn secondary">Back</Link>
      </div>
    );
  }

  return (
    <div className="edit-role-page">
      <Link to={`/projects/${projectId}`} className="btn secondary">
        ← Back
      </Link>

      <div className="form-card">
        <h1>Edit user character（UserID: {userId}）</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="role-form">
          <div className="form-group">
            <label>member info</label>
            <div className="member-info">
              <p>ID：{member.user.id}</p>
              <p>Name：{`${member.user.firstName} ${member.user.lastName}`}</p>
              <p>email：{member.user.email}</p>
              <p>character：{member.role === 'ADMIN' ? 'ADMIN' : 'MEMBER'}</p>
            </div>
          </div>
          
          <div className="form-group">
            <label>New <span className="required">*</span></label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading || success}
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          
          <div className="form-actions">
            <Link 
              to={`/projects/${projectId}`} 
              className="btn secondary"
              disabled={loading}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="btn primary"
              disabled={loading || success}
            >
              {loading ? 'updating...' : 'update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberRole;