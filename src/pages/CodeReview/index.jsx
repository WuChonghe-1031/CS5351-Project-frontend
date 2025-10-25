import React from 'react';
import { useState } from "react";
import { Button, Dropdown, Space, Table, message } from 'antd';
import { CaretDownOutlined } from "@ant-design/icons";
import { getRepoCommits, getRepoBranches } from '../../api/api';
import CommitList from './commitList';

const CodeReview = () => {
  const [isShowCommit, setIsShowCommit] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [commits, setCommits] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [currentBranches, setCurrentBranches] = useState(null);
  const [currentBranchName, setCurrentBranchName] = useState('');

  const repoColumns = [
    {
      title: 'Repo Name',
      dataIndex: 'repoName',
      key: 'repoName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (<Button type="link" onClick={() => checkRepoCommits(record.repoName)}>Check</Button>),
    },
  ];
  const repoData = [
    {
      key: 'WuChonghe-1031/CS5351-Project-frontend',
      repoName: 'WuChonghe-1031/CS5351-Project-frontend',
    }
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
    } catch (error) {
      message.error(error);
    }
  };

  return (
    <>
      {
        !isShowCommit ? 
          <div className="page-code-review">
            <Button type="primary">Add Repo</Button>
            <Table columns={repoColumns} dataSource={repoData} />
          </div>
        : 
        <div>
          {
            !isShowDetail ?
            <>
              <Dropdown menu={branchMenuProps}>
                <Button>
                  <Space>{currentBranchName}<CaretDownOutlined /></Space>
                </Button>
              </Dropdown>
              <Button type="primary" onClick={() => setIsShowCommit(false)}>Return</Button>
            </>
            : null
          }
          <CommitList repoName={currentRepo} commits={commits} onDetail={setIsShowDetail} />
        </div>
      }
    </>
    
  );
};

export default CodeReview;