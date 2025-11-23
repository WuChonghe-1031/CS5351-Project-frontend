// src/pages/TaskDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectTasks } from '../services/taskService';

// 辅助函数：格式化日期
const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

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
        // 获取任务列表
        const taskListResult = await getProjectTasks(Number(projectId));
        // 从列表中查找当前任务
        const foundTask = taskListResult.tasks.find(t => t.id === Number(taskId));
        
        if (!foundTask) {
          setError('No tasks');
          return;
        }
        
        setTask(foundTask);
      } catch (err) {
        setError(`fail to load${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [projectId, taskId]);

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '50px' }}>loading...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>error</h1>
        <p>{error}</p>
        <Link to={`/projects/${projectId}/tasks`}>
          <button style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}>
            return to project list
          </button>
        </Link>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>cannot find task</h1>
        <p>the task may be deleted</p>
        <Link to={`/projects/${projectId}/tasks`}>
          <button style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}>
            return to project list
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to={`/projects/${projectId}/tasks`} style={{ display: 'inline-block', marginBottom: '20px', color: '#2563eb' }}>
        ← return to project list
      </Link>

      <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginBottom: '20px', color: '#333' }}>{task.title}</h1>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>Status</strong>
          <span style={{ 
            display: 'inline-block', 
            marginLeft: '10px', 
            padding: '3px 8px', 
            borderRadius: '4px',
            backgroundColor: 
              task.status === 'To Do' ? '#f0f8ff' : 
              task.status === 'In Progress' ? '#fff3cd' : 
              task.status === 'Done' ? '#d4edda' : '#e2e6ea',
            color: 
              task.status === 'To Do' ? '#007bff' : 
              task.status === 'In Progress' ? '#856404' : 
              task.status === 'Done' ? '#28a745' : '#343a40'
          }}>
            {task.status}
          </span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>description</strong>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>{task.description || '无描述'}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <strong>storypoint:</strong>
            <p>{task.storyPoints}</p>
          </div>
          <div>
            <strong>version:</strong>
            <p>{task.version}</p>
          </div>
        </div>

        <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#555' }}>related information</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>project belong to</strong>
            <p>{task.project?.name} ({task.project?.projectCode})</p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>person in charge</strong>
            <p>
              {task.assignee 
                ? `${task.assignee.firstName} ${task.assignee.lastName} (${task.assignee.email})` 
                : 'unassigned'}
            </p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <strong>creator</strong>
            <p>
              {task.creator 
                ? `${task.creator.firstName} ${task.creator.lastName} (${task.creator.email})` 
                : 'Nnoe'}
            </p>
          </div>
        </div>

        <hr style={{ margin: '20px 0', borderColor: '#eee' }} />

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '15px', color: '#555' }}>Time</h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <strong>Create time</strong>
              <p>{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <strong>Last update</strong>
              <p>{formatDate(task.updatedAt)}</p>
            </div>
            {task.status === 'Done' && (
              <div>
                <strong>Complete time</strong>
                <p>{formatDate(task.completedAt)}</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <Link to={`/projects/${projectId}/tasks/${task.id}/edit`}>
            <button style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;