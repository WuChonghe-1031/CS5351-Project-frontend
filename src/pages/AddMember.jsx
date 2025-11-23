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
      setError('please enter UserID');
      return;
    }
    if (isNaN(Number(form.userId))) {
      setError('UserID must be int');
      return;
    }

    try {
      setLoading(true);
      await addProjectMember(projectId, Number(form.userId), form.role);
      setSuccess('Success');
      setForm({ userId: '', role: 'MEMBER' });
      setTimeout(() => {
        navigate(`/projects/${projectId}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Fail retry!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-member-page">
      <Link to={`/projects/${projectId}`} className="btn secondary">
        ← Back
      </Link>

      <div className="form-card">
        <h1>Add member（UserID）</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-group">
            <label> UserID <span className="required">*</span></label>
            <input
              type="number"
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              placeholder=" UserID"
              disabled={loading || success}
            />
            <p className="form-hint"> Ensure the UserID has registered</p>
          </div>
          
          <div className="form-group">
            <label>Character <span className="required">*</span></label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
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
              {loading ? 'ADDING...' : 'ADD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMember;