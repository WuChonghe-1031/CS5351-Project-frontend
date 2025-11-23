import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createProject, updateProject, getProjectDetail } from '../services/projectService';

const ProjectForm = () => {
  const { projectId } = useParams();
  const isEdit = !!projectId;
  const [form, setForm] = useState({
    name: '',
    projectCode: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 编辑模式：加载项目数据
  useEffect(() => {
    if (isEdit) {
      const loadProject = async () => {
        try {
          const data = await getProjectDetail(projectId);
          setForm({
            name: data.name,
            projectCode: data.projectCode,
            description: data.description || ''
          });
        } catch (err) {
          setError('Fail to load' + err.message);
        }
      };
      loadProject();
    }
  }, [isEdit, projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 表单验证
    if (!form.name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (!form.projectCode.trim()) {
      setError('No. cannot be empty');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateProject(projectId, form);
        navigate(`/projects/${projectId}`);
      } else {
        await createProject(form);
        // 创建成功后刷新列表页
        navigate('/projects', { state: { refresh: true } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'FAIL RETRY!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-page">
      <Link to={isEdit ? `/projects/${projectId}` : '/projects'} className="btn secondary">
        ← Back
      </Link>

      <div className="form-card">
        <h1>{isEdit ? 'Edit project' : 'New project'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>Name <span className="required">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Please enter the project name"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>No. <span className="required">*</span></label>
            <input
              type="text"
              value={form.projectCode}
              onChange={(e) => setForm({ ...form, projectCode: e.target.value })}
              placeholder="Please enter the project No."
              disabled={loading || isEdit} // 编辑时不可修改编码
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Please enter the project description"
              rows={4}
              disabled={loading}
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => navigate(isEdit ? `/projects/${projectId}` : '/projects')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={loading}
            >
              {loading ? (isEdit ? 'saving...' : 'creating...') : (isEdit ? 'save' : 'create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;