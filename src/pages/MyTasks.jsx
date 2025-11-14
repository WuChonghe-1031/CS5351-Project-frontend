import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAssignedTasks } from '../services/taskService';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getAssignedTasks();
        setTasks(data);
      } catch (err) {
        setError('加载我的任务失败：' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }

    fetchTasks();
  }, [navigate]);

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '50px' }}>加载我的任务中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>我的任务</h1>
        <Link to="/projects">
          <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            查看所有项目
          </button>
        </Link>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tasks.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #eee', borderRadius: '8px', margin: '10px 0' }}>
          <p>暂无分配给您的任务</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>任务标题</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>项目名称</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>状态</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #eee' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{task.title}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{task.project?.name || '未知项目'}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  {task.status === 'TODO' ? '待办' : task.status === 'IN_PROGRESS' ? '进行中' : '已完成'}
                </td>
                <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                  <Link to={`/projects/${task.projectId}/tasks/${task.id}`} style={{ marginRight: '10px', color: '#2563eb' }}>详情</Link>
                  <Link to={`/projects/${task.projectId}/tasks/${task.id}/edit`} style={{ marginRight: '10px', color: '#666' }}>编辑</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyTasks;