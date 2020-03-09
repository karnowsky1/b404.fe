import { Modal, Select } from "antd";
import React from "react";

const { Option } = Select;

export const DocumentsModal = ({ visible, onCancel, title, onOk }) => (
  <Modal title={title} visible={visible} onCancel={onCancel} onOk={onOk}>
    <p>Document Type</p>
    <Select placeholder="Please select action..." style={{ width: "100%" }}>
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
      <Option value="Yiminghe">yiminghe</Option>
    </Select>
  </Modal>
);
