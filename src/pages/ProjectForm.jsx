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
          setError('加载项目数据失败：' + err.message);
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
      setError('项目名称不能为空');
      return;
    }
    if (!form.projectCode.trim()) {
      setError('项目编码不能为空');
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
      setError(err.response?.data?.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="project-form-page">
      <Link to={isEdit ? `/projects/${projectId}` : '/projects'} className="btn secondary">
        ← 返回
      </Link>

      <div className="form-card">
        <h1>{isEdit ? '编辑项目' : '创建新项目'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label>项目名称 <span className="required">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="请输入项目名称"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>项目编码 <span className="required">*</span></label>
            <input
              type="text"
              value={form.projectCode}
              onChange={(e) => setForm({ ...form, projectCode: e.target.value })}
              placeholder="请输入项目编码（如 PROJ001）"
              disabled={loading || isEdit} // 编辑时不可修改编码
            />
          </div>
          
          <div className="form-group">
            <label>项目描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="请输入项目描述（可选）"
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
              取消
            </button>
            <button
              type="submit"
              className="btn primary"
              disabled={loading}
            >
              {loading ? (isEdit ? '保存中...' : '创建中...') : (isEdit ? '保存' : '创建')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;