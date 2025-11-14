import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createTask, updateTask, getProjectTasks } from '../services/taskService';
import { getProjectMembers } from '../services/memberService'; // 复用成员获取逻辑

const TaskForm = () => {
  const { projectId, taskId } = useParams();
  const isEdit = !!taskId;
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    assigneeId: '',
  });
  const [members, setMembers] = useState([]); // 项目成员列表（用于负责人选择）
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 加载项目成员（用于负责人下拉框）
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getProjectMembers(projectId);
        setMembers(data.members || []);
      } catch (err) {
        setError('加载成员失败');
      }
    };
    fetchMembers();
  }, [projectId]);

  // 编辑模式：加载任务详情
  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        try {
          const tasks = await getProjectTasks(projectId);
          const task = tasks.find(t => t.id === Number(taskId));
          if (task) {
            setForm({
              title: task.title,
              description: task.description || '',
              status: task.status,
              assigneeId: task.assignee?.id || '',
            });
          } else {
            setError('任务不存在');
          }
        } catch (err) {
          setError('加载任务失败');
        }
      };
      fetchTask();
    }
  }, [isEdit, projectId, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateTask(projectId, taskId, form);
      } else {
        await createTask(projectId, form);
      }
      navigate(`/projects/${projectId}/tasks`);
    } catch (err) {
      setError(err.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-page">
      <Link to={`/projects/${projectId}/tasks`} className="btn secondary">返回任务列表</Link>
      <h1>{isEdit ? '编辑任务' : '创建任务'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>任务标题 <span className="required">*</span></label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>任务描述</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            disabled={loading}
          ></textarea>
        </div>
        <div className="form-group">
          <label>状态 <span className="required">*</span></label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            disabled={loading}
          >
            <option value="TODO">待办</option>
            <option value="IN_PROGRESS">进行中</option>
            <option value="DONE">已完成</option>
          </select>
        </div>
        <div className="form-group">
          <label>负责人</label>
          <select
            value={form.assigneeId}
            onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
            disabled={loading}
          >
            <option value="">未分配</option>
            {members.map(member => (
              <option 
                key={member.user.id} 
                value={member.user.id}
              >
                {`${member.user.firstName} ${member.user.lastName}`}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <Link 
            to={`/projects/${projectId}/tasks`} 
            className="btn secondary"
            disabled={loading}
          >
            取消
          </Link>
          <button
            type="submit"
            className="btn primary"
            disabled={loading}
          >
            {loading 
              ? (isEdit ? '更新中...' : '创建中...') 
              : (isEdit ? '更新任务' : '创建任务')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;