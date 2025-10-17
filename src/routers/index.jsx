// src/router/index.js
// 1. 导入需要的页面组件（提前创建好首页、仪表盘等页面）
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';

// 2. 定义路由数组（包含：路径、组件、菜单名称等信息）
export const routes = [
  {
    path: '/',          // 路由路径
    name: '首页',       // 侧边栏菜单名称
    element: <Home/>,  // 对应渲染的页面组件
    exact: true,        // 是否精确匹配（v6 中默认精确匹配，可省略）
  },
  {
    path: '/dashboard',
    name: '仪表盘',
    element: <Dashboard />,
  },
  {
    path: '/login',
    name: '登录页',
    element: <Login />,
  },
];

// 3. 定义404路由（放在最后，匹配所有未定义的路径）
export const notFoundRoute = {
  path: '*',
  element: <NotFound />,
};