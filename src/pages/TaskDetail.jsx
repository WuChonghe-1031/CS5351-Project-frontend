import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectTasks } from '../services/taskService';

const TaskDetail = () => {
  const { projectId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const tasks = await getProjectTasks(projectId);
        const foundTask = tasks.find(t => t.id === Number(taskId));
        if (foundTask) {
          setTask(foundTask);
        } else {
          setError('任务不存在');
        }
      } catch (err) {
        setError('加载任务失败：' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    fetchTask();
  }, [projectId, taskId, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '50px' }}>加载任务详情中...</div>;
  }

  if (error || !task) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>任务加载失败</h1>
        <p style={{ color: 'red' }}>{error || '任务不存在'}</p>
        <Link to={`/projects/${projectId}/tasks`}>
          <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            返回任务列表
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to={`/projects/${projectId}/tasks`} style={{ display: 'inline-block', marginBottom: '20px', color: '#2563eb' }}>
        ← 返回任务列表
      </Link>

      <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
        <h1>{task.title}</h1>
        <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
          <span>状态：{task.status === 'TODO' ? '待办' : task.status === 'IN_PROGRESS' ? '进行中' : '已完成'}</span>
          <span>负责人：{task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}`.trim() : '未分配'}</span>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>任务描述</h3>
          <p>{task.description || '无描述'}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Link to={`/projects/${projectId}/tasks/${task.id}/edit`}>
            <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              编辑任务
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;