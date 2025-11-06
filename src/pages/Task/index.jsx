import React, { useState } from 'react';
import { 
  Table, Tag, Space, Drawer, Row, Col, Divider, 
  Button, Modal, Form, Input, Select, DatePicker, InputNumber 
} from 'antd';
import 'antd/dist/reset.css';
// 导入日期格式化工具（AntD DatePicker 依赖）
import dayjs from 'dayjs';

// 1. 初始任务数据（转为状态管理，支持新增后实时更新）
const initialTaskData = [
  {
    key: '1',
    name: 'John Brown',
    status: 'in progress',
    deadline: '2024-12-31',
    tags: ['nice', 'developer'],
    storyPoints: 5,
    assignee: 'Alex Wang',
    priority: 'High',
    description: 'Implement user authentication module with JWT'
  },
  {
    key: '2',
    name: 'Jim Green',
    status: 'not started',
    deadline: '2025-01-15',
    tags: ['loser'],
    storyPoints: 3,
    assignee: 'Linda Zhang',
    priority: 'Medium',
    description: 'Fix responsive layout issues on mobile devices'
  },
  {
    key: '3',
    name: 'Joe Black',
    status: 'completed',
    deadline: '2024-11-30',
    tags: ['cool', 'teacher'],
    storyPoints: 8,
    assignee: 'Mike Chen',
    priority: 'Low',
    description: 'Create API documentation for payment service'
  }
];

// 2. 定义下拉选项（状态、优先级），避免硬编码
const STATUS_OPTIONS = [
  { label: 'In Progress', value: 'in progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Not Started', value: 'not started' }
];
const PRIORITY_OPTIONS = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' }
];

const Task = () => {
  // 3. 状态管理（原有+新增）
  const [taskList, setTaskList] = useState(initialTaskData); // 任务列表（改为状态）
  const [openDetailDrawer, setOpenDetailDrawer] = useState(false); // 详情抽屉
  const [currentTask, setCurrentTask] = useState(null); // 当前查看的任务
  const [openCreateModal, setOpenCreateModal] = useState(false); // 新增任务弹窗
  const [form] = Form.useForm(); // 表单实例（管理新增任务的输入）

  // 4. 详情抽屉逻辑（不变）
  const handleOpenDetailDrawer = (task) => {
    setCurrentTask(task);
    setOpenDetailDrawer(true);
  };
  const handleCloseDetailDrawer = () => {
    setOpenDetailDrawer(false);
    setCurrentTask(null);
  };

  // 5. 新增任务弹窗逻辑
  // 打开弹窗：重置表单（避免残留上次输入）
  const handleOpenCreateModal = () => {
    form.resetFields();
    setOpenCreateModal(true);
  };
  // 关闭弹窗
  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  // 6. 提交新增任务：验证表单 → 处理数据 → 更新任务列表
  const handleSubmitCreateTask = async () => {
    try {
      // ① 表单验证（必填项、格式等）
      const formValues = await form.validateFields();
      
      // ② 处理表单数据（适配现有任务结构）
      const newTask = {
        // 生成唯一key：现有最大key + 1（避免重复）
        key: (Math.max(...taskList.map(task => Number(task.key)), 0) + 1).toString(),
        name: formValues.name, // 任务名称
        status: formValues.status, // 状态
        deadline: formValues.deadline.format('YYYY-MM-DD'), // 日期格式化（与现有一致）
        // 标签处理：输入逗号分隔字符串 → 转为数组（去空格）
        tags: formValues.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        storyPoints: formValues.storyPoints, // 故事点（数字）
        assignee: formValues.assignee, // 负责人
        priority: formValues.priority, // 优先级
        description: formValues.description || '' // 描述（可选，默认空）
      };

      // ③ 更新任务列表（不可变更新，避免直接修改状态）
      setTaskList([...taskList, newTask]);
      
      // ④ 关闭弹窗
      handleCloseCreateModal();
    } catch (error) {
      // 表单验证失败（如必填项未填），不做处理（AntD会自动提示错误）
      console.log('表单验证失败：', error);
    }
  };

  // 7. 表格列配置（不变）
  const taskColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const tagColor = record.status === 'in progress' ? 'blue' :
                        record.status === 'completed' ? 'green' : 'volcano';
        return <Tag color={tagColor} key={record.key}>{record.status}</Tag>;
      }
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Story Points',
      dataIndex: 'storyPoints',
      key: 'storyPoints',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleOpenDetailDrawer(record)} style={{ cursor: 'pointer' }}>
            Details
          </a>
          <a style={{ cursor: 'pointer' }}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div className="task-page" style={{ padding: '20px' }}>
      {/* 8. 页面标题 + 新增任务按钮（新增） */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Task Management Page</h1>
        <Button 
          type="primary" 
          onClick={handleOpenCreateModal}
        >
          Add New Task
        </Button>
      </div>

      {/* 9. 任务表格（dataSource 改为 taskList） */}
      <Table 
        columns={taskColumns} 
        dataSource={taskList} 
        rowKey="key" 
        pagination={{ pageSize: 3 }}
      />

      {/* 10. 任务详情抽屉（不变） */}
      <Drawer
        title="Task Details"
        placement="right"
        width={600}
        open={openDetailDrawer}
        onClose={handleCloseDetailDrawer}
        mask={true}
        maskClosable={true}
      >
        {currentTask && (
          <div style={{ padding: '16px' }}>
            <h3 style={{ marginBottom: '16px', color: '#1677ff' }}>Basic Information</h3>
            <Row gutter={[32, 16]}>
              <Col span={12}>
                <div style={{ color: '#666', marginBottom: '4px' }}>Task Name</div>
                <div style={{ fontWeight: 500 }}>{currentTask.name}</div>
              </Col>
              <Col span={12}>
                <div style={{ color: '#666', marginBottom: '4px' }}>Status</div>
                {currentTask.status === 'in progress' && <Tag color="blue">in progress</Tag>}
                {currentTask.status === 'completed' && <Tag color="green">completed</Tag>}
                {currentTask.status === 'not started' && <Tag color="volcano">not started</Tag>}
              </Col>
              <Col span={12}>
                <div style={{ color: '#666', marginBottom: '4px' }}>Deadline</div>
                <div>{currentTask.deadline}</div>
              </Col>
              <Col span={12}>
                <div style={{ color: '#666', marginBottom: '4px' }}>Story Points</div>
                <div>{currentTask.storyPoints}</div>
              </Col>
              <Col span={12}>
                <div style={{ color: '#666', marginBottom: '4px' }}>Assignee</div>
                <div>{currentTask.assignee}</div>
              </Col>
              <Col span={12}>
                <div style={{ color: '#666', marginBottom: '4px' }}>Priority</div>
                <div>{currentTask.priority}</div>
              </Col>
            </Row>

            <Divider style={{ margin: '24px 0' }}>Tags</Divider>
            <Space size="small">
              {currentTask.tags.map((tag) => (
                <Tag key={tag} color={tag.length > 5 ? 'geekblue' : 'green'}>
                  {tag}
                </Tag>
              ))}
            </Space>

            <Divider style={{ margin: '24px 0' }}>Description</Divider>
            <p style={{ lineHeight: 1.8, color: '#333' }}>
              {currentTask.description}
            </p>
          </div>
        )}
      </Drawer>

      {/* 11. 新增任务弹窗（核心新增部分） */}
      <Modal
        title="Create New Task"
        open={openCreateModal}
        onCancel={handleCloseCreateModal}
        onOk={handleSubmitCreateTask}
        okText="Confirm"
        cancelText="Cancel"
        width={600}
      >
        {/* 表单：与任务字段一一对应，添加验证规则 */}
        <Form
          form={form}
          layout="vertical" // 垂直布局（标签在上，输入框在下，更易读）
          initialValues={{ 
            status: 'not started', // 默认状态：未开始
            priority: 'Medium', // 默认优先级：中
            storyPoints: 1 // 默认故事点：1
          }}
        >
          {/* 任务名称（必填） */}
          <Form.Item
            name="name"
            label="Task Name"
            rules={[{ required: true, message: 'Please enter task name!' }]}
          >
            <Input placeholder="e.g. User Login Module" />
          </Form.Item>

          {/* 状态（必填，下拉选择） */}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select options={STATUS_OPTIONS} placeholder="Select status" />
          </Form.Item>

          {/* 截止日期（必填，日期选择器） */}
          <Form.Item
            name="deadline"
            label="Deadline"
            rules={[{ required: true, message: 'Please select deadline!' }]}
          >
            <DatePicker 
              placeholder="Select date" 
              style={{ width: '100%' }} 
              disabledDate={(current) => current && current < dayjs().startOf('day')} // 禁止选择过去日期
            />
          </Form.Item>

          {/* 故事点（必填，数字输入） */}
          <Form.Item
            name="storyPoints"
            label="Story Points"
            rules={[{ required: true, message: 'Please enter story points!' }]}
          >
            <InputNumber 
              min={1} 
              max={100} 
              placeholder="e.g. 5" 
              style={{ width: '100%' }} 
            />
          </Form.Item>

          {/* 负责人（必填） */}
          {/* <Form.Item
            name="assignee"
            label="Assignee"
            rules={[{ required: true, message: 'Please enter assignee!' }]}
          >
            <Input placeholder="e.g. Alex Wang" />
          </Form.Item> */}

          {/* 优先级（必填，下拉选择） */}
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select priority!' }]}
          >
            <Select options={PRIORITY_OPTIONS} placeholder="Select priority" />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Task;