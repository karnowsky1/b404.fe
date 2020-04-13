import { Modal, Card, Input, Checkbox } from 'antd';
import React from 'react';
import { Upload, message } from 'antd';
import axios from 'axios';
import { axiosError } from '../../utils/axiosError';
import { TOKEN_KEY } from '../../constants/auth';

const { Dragger } = Upload;

var checked = false;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function uploadFile(base64, file) {
  console.log(file);
  console.log(base64);

  let requestObject = {
    name: document.getElementById('nameInput').value,
    file: base64,
    confidential: checked,
  };

  const url = window.__env__.API_URL + '/blink/api/file';
  axios
    .post(url, requestObject, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(TOKEN_KEY),
      },
    })
    .then((response) => {
      if (response.status === 200) {
        message.success('Data saved successfully');
      }
    })
    .catch(axiosError);
}

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  beforeUpload(file) {
    getBase64(file).then((data) => {
      if (document.getElementById('nameInput').value === '') {
        alert('Please provide file name');
      } else {
        uploadFile(data, file);
      }
    });
  },
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

function onChange(e) {
  console.log(`checked = ${(checked = true)}`);
}

export const DocumentsModal = ({ visible, onCancel, title, onOk }) => (
  <Modal title={title} visible={visible} onCancel={onCancel} onOk={onOk}>
    <Card>
      <Input id="nameInput" placeholder="Document name..." />
      <p></p>
      <Checkbox onChange={onChange}>Confidential</Checkbox>
      <p></p>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon"></p>
        <p className="ant-upload-text">
          Click here or drag a file to this area to upload.
        </p>
      </Dragger>
    </Card>
  </Modal>
);
