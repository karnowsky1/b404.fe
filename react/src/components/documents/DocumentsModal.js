import { Modal, Card, Input, Checkbox } from "antd";
import React from "react";
import { Upload, message } from "antd";

const { Dragger } = Upload;

const props = {
  name: "file",
  multiple: true,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}

export const DocumentsModal = ({ visible, onCancel, title, onOk }) => (
  <Modal title={title} visible={visible} onCancel={onCancel} onOk={onOk}>
    <Card>
      <Input placeholder="Document name..." />
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
