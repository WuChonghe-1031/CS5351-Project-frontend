import { StrictMode } from 'react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import BasicLayout from './layout/BasicLayout/index.jsx'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 关键：用 BrowserRouter 包裹，让整个应用支持路由 */}
    <BrowserRouter>
      <BasicLayout /> {/* 根组件是 BasicLayout */}
    </BrowserRouter>
  </React.StrictMode>
)
