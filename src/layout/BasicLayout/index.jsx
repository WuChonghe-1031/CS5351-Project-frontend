import { useState, useEffect } from "react";
import { Routes, Route } from 'react-router-dom'; // 导入路由出口组件
import { routes, notFoundRoute } from '../../routers'; // 导入路由配置
import './bl.css'; // 引入样式

// 子组件：头部
const Header = ({ onToggleSidebar }) => {
  return (
    <header className="basic-layout-header">
      <div className="logo">MyApp</div>
      <button 
        className="sidebar-toggle" 
        onClick={onToggleSidebar}
      >
        菜单
      </button>
      <div className="user-info">用户：张三</div>
    </header>
  );
};



// 子组件：底部
const Footer = () => {
  return (
    <footer className="basic-layout-footer">
      © 2025 MyApp. All rights reserved.
    </footer>
  );
};

// 主布局组件
const BasicLayout = ({ children }) => {
  // 状态：判断是否为移动端（响应式）
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 监听窗口尺寸变化，更新移动端状态
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  return (
    <div className="basic-layout-container">
      {/* 头部 */}
      <Header />

      <div className="basic-layout-body">
        {/* 主内容区 */}
        <main className="basic-layout-content">
          <Routes>
            {/* 渲染所有正常路由 */}
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element} // 渲染对应的页面组件
              />
            ))}
            {/* 渲染404页面 */}
            <Route path={notFoundRoute.path} element={notFoundRoute.element} />
          </Routes>
        </main>
      </div>

      {/* 底部 */}
      <Footer />
    </div>
  );
};

export default BasicLayout;