import React from 'react';
import { useState } from "react";
import { Button, Col, Dropdown, Input, Modal, Popconfirm, Row, Space, Table, Upload } from 'antd';
import { InboxOutlined } from "@ant-design/icons";
import { fileReview } from '../../api/api';
import './index.css';

const CodeReview = () => {
  const [currentFile, setCurrentFile] = useState(null);
  const [resultText, setResultText] = useState('');

  const { Dragger } = Upload;
  const { TextArea } = Input;

  const props = {
    name: 'file',
    beforeUpload(file) {
      setCurrentFile(file)
      return false
    },
    customRequest: (options) => {
			const data= new FormData()
			data.append('file', options.file)
			fileReview(data).then((res) => {
				options.onSuccess(res.data, options.file)
			})
		},
  };
  
  const uploadReviewFile = async () => {
    const data= new FormData()
    data.append('file', currentFile)
    fileReview(data).then((res) => {
      console.log('uploadReviewFile', res);
      setResultText('Sample');
      // setResultText(res.data);
    })
  }


  return (
    <>
      <div className="dragger-container">
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </div>

      <Button onClick={() => uploadReviewFile()} disabled={!currentFile}>Upload</Button>

      <TextArea rows={6} value={resultText} placeholder="Please upload file." className="output-textarea" />
    </>
    
  );
};

export default CodeReview;