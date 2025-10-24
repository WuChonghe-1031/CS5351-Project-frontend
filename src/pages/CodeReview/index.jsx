import React from 'react';
import { useState, useEffect } from "react";
import { Button, Table } from 'antd';
import { getRepoCommits } from '../../api/api';
import CommitList from './commitList';

const CodeReview = () => {
  const [isShowCommit, setIsShowCommit] = useState(false);
  const [commits, setCommits] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);

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

  const checkRepoCommits = async (repoName) => {
    const commits = await getRepoCommits(repoName);
    if (commits && commits.length > 0) {
      setCommits(commits);
      setCurrentRepo(repoName);
      setIsShowCommit(true);
    } else {
      setIsShowCommit(false);
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
        : <CommitList repoName={currentRepo} commits={commits} />
      }
    </>
    
  );
};

export default CodeReview;