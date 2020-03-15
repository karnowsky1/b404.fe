import React, { Component } from 'react'
import { Card } from 'antd'
import { Upload, message, Icon } from 'antd';
// import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default class Uploads extends Component {
  
  render() {
    return (
      <Card title="Upload">
        <Card style={{ width: "60%", margin: "auto", height: "40vh", display: "flex", flexDirection: "column", justifyContent: "center", }}>
          <Dragger {...props} style={{  margin: "auto", padding: "0 0", width: "70%", height: "50%"}}>
            <p className="ant-upload-drag-icon">
            <Icon type="inbox" theme="outlined"/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
              band files
            </p>
          </Dragger>
        </Card>
      </Card>
    )
  }
}
