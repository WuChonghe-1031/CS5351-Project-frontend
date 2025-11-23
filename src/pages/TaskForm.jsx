import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectTasks, updateTask, createTask } from '../services/taskService';
import { getProjectMembers } from '../services/memberService';

const TaskForm = () => {
  const { projectId, taskId } = useParams();
  const isEdit = !!taskId; // true: 编辑任务，false: 创建任务
  const navigate = useNavigate();

  // 🔴 区分创建和编辑的表单状态（严格匹配API）
  const [form, setForm] = useState({
    // 创建和编辑共有的字段
    title: '',
    description: '',
    status: isEdit ? 'To Do' : 'TODO', // 编辑用后端返回值，创建用API要求的"TODO"
    assigneeId: 0,

    // 仅编辑需要的字段（更新接口专用）
    ...(isEdit && {
      storyPoints: 0,
      version: 0
    })
  });

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(isEdit); // 编辑时初始加载数据
  const [error, setError] = useState('');

  // 加载项目成员（用于负责人选择）
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getProjectMembers(Number(projectId));
        setMembers(data.members || []);
      } catch (err) {
        setError('Failed to load members');
      }
    };
    fetchMembers();
  }, [projectId]);

  // 编辑模式：加载任务详情（仅编辑时执行）
  useEffect(() => {
    if (!isEdit) return;

    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskList = await getProjectTasks(Number(projectId));
        const task = taskList.tasks.find(t => t.id === Number(taskId));
        
        if (!task) {
          setError('Task not found');
          return;
        }

        // 编辑模式：映射更新接口需要的字段
        setForm({
          title: task.title,
          description: task.description || '',
          status: task.status, // 使用后端返回的状态值
          assigneeId: task.assignee?.id || 0,
          storyPoints: task.storyPoints || 0,
          version: task.version || 0
        });
      } catch (err) {
        setError(`Failed to load task: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [isEdit, projectId, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const numericProjectId = Number(projectId);
      
      // 🔴 区分创建和更新的提交数据（严格匹配各自API）
      if (isEdit) {
        // 更新任务：包含更新接口要求的所有字段
        const updateData = {
          title: form.title,
          description: form.description,
          status: form.status,
          assigneeId: Number(form.assigneeId),
          storyPoints: Number(form.storyPoints),
          version: Number(form.version)
        };
        console.log('Updating task with data:', updateData);
        await updateTask(numericProjectId, Number(taskId), updateData);
      } else {
        // 创建任务：仅包含POST接口要求的字段
        const createData = {
          title: form.title,
          description: form.description || '', // 允许空字符串
          status: form.status, // 必须是API要求的枚举值（如"TODO"）
          assigneeId: Number(form.assigneeId) // 数字类型
        };
        console.log('Creating task with data:', createData);
        await createTask(numericProjectId, createData);
      }

      // 成功后跳转回任务列表
      navigate(`/projects/${projectId}/tasks`);
    } catch (err) {
      console.error('Operation failed:', err.response?.data);
      setError(err.response?.data?.message || 'Operation failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">Loading task data...</div>;
  }

  return (
    <div className="task-form-page">
      <Link to={`/projects/${projectId}/tasks`} className="btn secondary">Back to Tasks</Link>
      <h1>{isEdit ? 'Edit Task' : 'Create Task'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="task-form">
        {/* 标题（必填） */}
        <div className="form-group">
          <label>Title <span className="required">*</span></label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        {/* 描述（可选） */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={loading}
          />
        </div>

        {/* 状态（必填，区分创建和编辑的选项值） */}
        <div className="form-group">
          <label>Status <span className="required">*</span></label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            disabled={loading}
            required
          >
            {/* 🔴 创建时使用API要求的大写枚举值，编辑时保持后端返回值 */}
            {isEdit ? (
              <>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </>
            ) : (
              <>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </>
            )}
          </select>
        </div>

        {/* 负责人（可选） */}
        <div className="form-group">
          <label>Assignee</label>
          <select
            value={form.assigneeId}
            onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
            disabled={loading}
          >
            <option value={0}>Unassigned</option>
            {members.map(member => (
              <option key={member.user.id} value={member.user.id}>
                {`${member.user.firstName} ${member.user.lastName}`}
              </option>
            ))}
          </select>
        </div>

        {/* 仅编辑模式显示：storyPoints和version（更新接口专用） */}
        {isEdit && (
          <>
            <div className="form-group">
              <label>Story Points <span className="required">*</span></label>
              <input
                type="number"
                value={form.storyPoints}
                onChange={(e) => setForm({ ...form, storyPoints: e.target.value })}
                min="0"
                disabled={loading}
                required
              />
            </div>
            <label>Version <span className="required">*</span></label>
            <input
              type="number"
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
              required
            />
          </>
        )}

        <div className="form-actions">
          <Link to={`/projects/${projectId}/tasks`} className="btn secondary">Cancel</Link>
          <button
            type="submit"
            className="btn primary"
            disabled={loading}
          >
            {loading ? 'Processing...' : isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;