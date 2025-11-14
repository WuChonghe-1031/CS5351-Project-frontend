import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectTasks } from '../services/taskService';

const ProjectTasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getProjectTasks(projectId);
        setTasks(data);
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

    fetchTasks();
  }, [projectId, navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '50px' }}>加载任务列表中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to={`/projects/${projectId}`} style={{ display: 'inline-block', marginBottom: '20px', color: '#2563eb' }}>
        ← 返回项目详情
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>项目任务列表</h1>
        <Link to={`/projects/${projectId}/tasks/create`}>
          <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            创建任务
          </button>
        </Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tasks.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #eee', borderRadius: '8px', margin: '10px 0' }}>
          <p>暂无任务，点击"创建任务"开始</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>任务标题</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>状态</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>负责人</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{task.title}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  {task.status === 'TODO' ? '待办' : task.status === 'IN_PROGRESS' ? '进行中' : '已完成'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  {task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}`.trim() : '未分配'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <Link to={`/projects/${projectId}/tasks/${task.id}`} style={{ marginRight: '10px', color: '#2563eb' }}>详情</Link>
                  <Link to={`/projects/${projectId}/tasks/${task.id}/edit`} style={{ marginRight: '10px', color: '#666' }}>编辑</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectTasks;