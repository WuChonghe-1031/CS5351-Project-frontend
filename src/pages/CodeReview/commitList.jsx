import React, { useState, useEffect } from "react";
import { Avatar, Button, List, Space, Tag, Tooltip, Typography, message} from "antd";
import { BranchesOutlined, ClockCircleOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import { getCommitDetails, getRepoComments } from '../../api/api';
import DiffComponent from './diffComponent';
import './index.css';

const { Text, Paragraph } = Typography;

const CommitList = ({ repoName, commits, onDetail }) => {
  const [isShowDiff, setIsShowDiff] = useState(false);
  const [diffText, setDiffText] = useState('');
  const [allComments, setAllComments] = useState([]);
  const [currentComments, setCurrentComments] = useState([]);

  useEffect(() => {
    getRepoComments(repoName).then((res) => {
      setAllComments(res);
    });
  }, [repoName]);

  const handleCopy = async (sha) => {
    try {
      await navigator.clipboard.writeText(sha);
      message.success("SHA copied to clipboard!");
    } catch {
      message.error("Failed to copy SHA");
    }
  };
  const handleDetail = (sha) => {
    getCommitDetails(repoName, sha).then((res) => {
      setCurrentComments(allComments.filter(comment => comment.commit_id === sha));
      setDiffText(res);
      setIsShowDiff(true);
      onDetail(true);
    });
  };
  const returnCommitList = () => {
    setIsShowDiff(false);
    onDetail(false);
  }

  return (
    <>
      {isShowDiff ? 
        <div>
          <Button type="primary" className="return-commit-btn" onClick={() => returnCommitList()}>Return</Button>
          <DiffComponent diffText={diffText} />
          <List
            itemLayout="vertical"
            dataSource={currentComments}
            renderItem={(comment) => (
              <List.Item
                key={comment.id}
                style={{
                  borderBottom: "1px solid #f0f0f0",
                  padding: "12px 16px",
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={comment.user?.avatar_url}
                      icon={<UserOutlined />}
                      alt={comment.user?.login || "User"}
                    />
                  }
                  title={ <Text>{comment.user?.login || "Unknown"}</Text> }
                  description={
                    <Text type="secondary">
                      <ClockCircleOutlined style={{ marginRight: 4 }} />
                      {new Date(comment.created_at).toLocaleString()}
                    </Text>
                  }
                />
                <Paragraph style={{ whiteSpace: "pre-wrap"}}>
                  <MessageOutlined style={{ marginRight: 6, color: "#999" }} />
                  {comment.body}
                </Paragraph>
              </List.Item>
            )}
          />
        </div>
        : 
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
                      <Tooltip  placement="rightTop" title={commit.sha}>
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

