import React, { useState } from "react";
import { List, Avatar, Typography, Tag, Tooltip, Space, message } from "antd";
import { ClockCircleOutlined, BranchesOutlined, UserOutlined } from "@ant-design/icons";
import { getCommitDetails } from '../../api/api';
import DiffComponent from './diffComponent';

const { Text } = Typography;

const CommitList = ({ repoName, commits }) => {
  const [isShowDiff, setIsShowDiff] = useState(false);
  const [diffText, setDiffText] = useState('');

  const handleCopy = async (sha) => {
    try {
      await navigator.clipboard.writeText(sha);
      message.success("SHA copied to clipboard!");
    } catch (err) {
      message.error("Failed to copy SHA");
    }
  };
  const handleDetail = (sha) => {
    getCommitDetails(repoName, sha).then((res) => {
      setDiffText(res);
      setIsShowDiff(true);
    });
  };

  return (
    <>
      {isShowDiff ? 
        <DiffComponent diffText={diffText} /> : 
        <List
          itemLayout="horizontal"
          dataSource={commits}
          renderItem={(commit) => (
            <List.Item
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={commit.author?.avatar_url}
                    icon={<UserOutlined />}
                    alt={commit.author?.login || "User"}
                  />
                }
                title={
                  <Space direction="vertical" size={2}>
                    <Text
                      strong
                      style={{ cursor: "pointer", transition: "color 0.2s ease" }}
                      onClick={() => handleDetail(commit.sha)}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1677ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#000000")}
                    >
                      {commit.commit.message.split("\n")[0]}
                    </Text>
                    <Space size="small">
                      <Tooltip title={commit.sha}>
                        <Tag color="blue" onClick={() => handleCopy(commit.sha)} style={{ cursor: "pointer", userSelect: "none", }}>
                          {commit.sha.substring(0, 7)}
                        </Tag>
                      </Tooltip>
                      <Text type="secondary">
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {new Date(commit.commit.author.date).toLocaleString()}
                      </Text>
                    </Space>
                  </Space>
                }
                description={
                  <Space>
                    <BranchesOutlined />
                    <Text>{commit.author?.login || "Unknown Author"}</Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      }
    </>
  );
};

export default CommitList;

