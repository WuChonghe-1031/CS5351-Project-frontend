import React from 'react';
import { useState } from "react";
import { Button, Col, Dropdown, Input, Modal, Popconfirm, Row, Space, Table, message } from 'antd';
import { CaretDownOutlined } from "@ant-design/icons";
import { getRepoCommits, getRepoBranches } from '../../api/api';
import CommitList from './commitList';
import './index.css';

const CodeReview = () => {
  const [isShowCommit, setIsShowCommit] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [commits, setCommits] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [currentBranches, setCurrentBranches] = useState(null);
  const [currentBranchName, setCurrentBranchName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repoData, setRepoData] = useState([
    {
      key: 'WuChonghe-1031/CS5351-Project-frontend',
      repoName: 'WuChonghe-1031/CS5351-Project-frontend',
    }
  ]);

  const repoColumns = [
    {
      title: 'Repo Name',
      dataIndex: 'repoName',
      key: 'repoName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => checkRepoCommits(record.repoName)}>Check</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteRepoCommits(record.repoName)}>
            <Button type="link">Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleBranchClick = async e => {
    try {
      const newCommits = await getRepoCommits(currentRepo, e.key);
      if (newCommits && newCommits.length > 0) {
        setCommits(newCommits);
      } 
      setCurrentBranchName(e.key);
    } catch (error) {
      message.error(error);
    }
  };
  const branchMenuProps = {
    items: currentBranches,
    onClick: handleBranchClick,
  };

  const checkRepoCommits = async (repoName) => {
    try {
      const branches = await getRepoBranches(repoName);
      if (branches && branches.length > 0) {
        const branchProps = branches.map((branch) => ({
          key: branch.name,
          label: branch.name
        }));
        setCurrentBranches(branchProps);
        setCurrentRepo(repoName);
        let name = '';
        for (const branch of branches) {
          if (branch.name === 'main' || branch.name === 'master') {
            name = branch.name;
            break;
          }
        }
        name = name || branches[0].name;
        setCurrentBranchName(name);
        const commits = await getRepoCommits(repoName, name);
        if (commits && commits.length > 0) {
          setCommits(commits);
          setIsShowCommit(true);
        } else {
          setIsShowCommit(false);
        }
      }
    } catch {
      message.error("Failed to fetch commits");
    }
  };
  const deleteRepoCommits = (repoName) => {
    const index = repoData.findIndex((item) => item.repoName === repoName);
    if (index !== -1) {
      const newRepoData = [...repoData];
      newRepoData.splice(index, 1);
      setRepoData(newRepoData);
      message.success("Repository deleted successfully");
    } else {
      message.error("Repository not found");
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const repoName = `${userValue}/${repoValue}`;
    try {
      const branches = await getRepoBranches(repoName);
      if (branches && branches.length > 0) {
        repoData.push({
          key: repoName,
          repoName: repoName,
        });
        message.success("Repository added successfully");
      }
    } catch {
      message.error("Failed to add repository");
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [userValue, setUserValue] = useState('');
  const handleUserChange = (e) => {
    setUserValue(e.target.value);
  };
  const [repoValue, setRepoValue] = useState('');
  const handleRepoChange = (e) => {
    setRepoValue(e.target.value);
  }

  return (
    <>
      {
        !isShowCommit ? 
          <div className="page-code-review">
            <Button type="primary" onClick={showModal}>Add Repo</Button>
            <div className="page-code-table">
              <Table columns={repoColumns} dataSource={repoData} />
            </div>
            <Modal
              title="Add Repository"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div className="add-repo-input">
                <Row gutter={16}>
                  <Col span={12}>User</Col>
                  <Col span={12}>Repository</Col>
                </Row>
                <Row gutter={16} className="add-repo-input-row">
                  <Col span={12}>
                    <Input value={userValue} onChange={handleUserChange} />
                  </Col>
                  <Col span={12}>
                    <Input value={repoValue} onChange={handleRepoChange} />
                  </Col>
                </Row>
              </div>
            </Modal>
          </div>
        : 
        <div>
          {
            !isShowDetail ?
            <div className="commit-detail-bar">
              <Dropdown menu={branchMenuProps}>
                <Button>
                  <Space>{currentBranchName}<CaretDownOutlined /></Space>
                </Button>
              </Dropdown>
              <Button type="primary" className="return-repo-btn" onClick={() => setIsShowCommit(false)}>Return</Button>
            </div>
            : null
          }
          <CommitList repoName={currentRepo} commits={commits} onDetail={setIsShowDetail} />
        </div>
      }
    </>
    
  );
};

export default CodeReview;