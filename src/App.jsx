import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ProjectForm from './pages/ProjectForm';
import AddMember from './pages/AddMember'; // 新增：添加成员页面
import EditMemberRole from './pages/EditMemberRole'; // 新增：编辑成员角色页面
import ProjectTasks from './pages/ProjectTasks';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import MyTasks from './pages/MyTasks';

import './App.css';

// 私有路由组件：未登录用户自动跳转登录页
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="app">
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 私有路由 - 项目管理 */}
        <Route path="/projects" element={
          <PrivateRoute>
            <ProjectList />
          </PrivateRoute>
        } />
        <Route path="/projects/create" element={
          <PrivateRoute>
            <ProjectForm />
          </PrivateRoute>
        } />
        <Route path="/projects/:projectId" element={
          <PrivateRoute>
            <ProjectDetail />
          </PrivateRoute>
        } />
        <Route path="/projects/:projectId/edit" element={
          <PrivateRoute>
            <ProjectForm />
          </PrivateRoute>
        } />
        
        {/* 私有路由 - 成员管理 */}
        <Route path="/projects/:projectId/members/add" element={
          <PrivateRoute>
            <AddMember />
          </PrivateRoute>
        } />
        <Route path="/projects/:projectId/members/:userId/edit" element={
          <PrivateRoute>
            <EditMemberRole />
          </PrivateRoute>
        } />
        <Route path="/projects/:projectId/tasks" element={<PrivateRoute><ProjectTasks /></PrivateRoute>} />
        <Route path="/projects/:projectId/tasks/create" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        <Route path="/projects/:projectId/tasks/:taskId" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
        <Route path="/projects/:projectId/tasks/:taskId/edit" element={<PrivateRoute><TaskForm /></PrivateRoute>} />
        <Route path="/tasks/assigned-to-me" element={<PrivateRoute><MyTasks /></PrivateRoute>} />
        

        {/* 根路径重定向 */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;