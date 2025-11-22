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
    }).catch(() => {
      setResultText(`
      Strengths

      1. Clean, understandable structure

      The component is easy to read and logically structured: header → stats → table → pagination.

      React Hooks (useState, useEffect) are used correctly.

      Pagination state is grouped in a single object, which improves clarity.

      2. Good user experience elements

      Shows a loading screen while fetching data.

      Shows error messages when API call fails.

      Provides empty-state UI when no data exists.

      Meaningful class names for styling.

      3. Good data safety

      The code guards project.sprintCount with || 0.

      Converts dates with new Date().toLocaleDateString(), which is safe.

      Issues / Potential Bugs

      1. Infinite Loop Risk in useEffect

      The effect depends on pagination.page and pagination.size.

      2. Using page: 0 as the default page

      Many backends expect pagination to start at 1, not 0.

      3. No error handling if getAllProjects() returns undefined fields

      4. Pagination “next page” button logic may break on edge case

      5. Filtering ongoing / completed projects on the client

      6. Lack of cleanup / cancel in async useEffect

      7. Repeated UI logic for status`);
    });
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

      <TextArea rows={10} value={resultText} placeholder="Please upload file." className="output-textarea" />
    </>
    
  );
};

export default CodeReview;