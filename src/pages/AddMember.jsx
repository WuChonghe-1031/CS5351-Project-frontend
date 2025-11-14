import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { addProjectMember } from '../services/memberService';

const AddMember = () => {
  const { projectId } = useParams();
  const [form, setForm] = useState({
    userId: '', // 仅保留 UserID 输入
    role: 'MEMBER'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 表单验证
    if (!form.userId.trim()) {
      setError('请输入成员 UserID');
      return;
    }
    if (isNaN(Number(form.userId))) {
      setError('UserID 必须是数字');
      return;
    }

    try {
      setLoading(true);
      await addProjectMember(projectId, Number(form.userId), form.role);
      setSuccess('成员添加成功！');
      setForm({ userId: '', role: 'MEMBER' });
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || '添加成员失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-member-page">
      <Link to={`/projects/${projectId}`} className="btn secondary">
        ← 返回项目详情
      </Link>

      <div className="form-card">
        <h1>添加项目成员（按 UserID）</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-group">
            <label>成员 UserID <span className="required">*</span></label>
            <input
              type="number"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              placeholder="请输入要添加的成员 UserID"
              disabled={loading || success}
            />
            <p className="form-hint">请确保该 UserID 已注册账号</p>
          </div>
          
          <div className="form-group">
            <label>成员角色 <span className="required">*</span></label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
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
              {loading ? '添加中...' : '添加成员'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;