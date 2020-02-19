import React from "react";
import { Divider, Modal, Progress, Select } from "antd";

const { Option } = Select;

export const AssignModal = ({ companies, onCancel, title, onOk }) => (
  <Modal title={title} visible onOk={onOk} onCancel={onCancel}>
    <Progress percent={30} />
    <Divider type="horizontal" />
    <p>
      <b>Company*</b>
    </p>
    <Select style={{ width: "100%" }} placeholder="Select Company">
      {companies.map(({ value, label }) => (
        <Option value={value} key={value}>
          {label}
        </Option>
      ))}
    </Select>
  </Modal>
);

export const AssignPeople = ({ person, document, onCancel, title, onOk }) => (
  <Modal title={title} visible onOk={onOk} onCancel={onCancel}>
    <Progress percent={30} />
    <Divider type="horizontal" />
    <p>
      <b>Person*</b>
    </p>
    <Select style={{ width: "100%" }} placeholder="John Smith">
      {person.map(({ value, label }) => (
        <Option value={value} key={value}>
          {label}
        </Option>
      ))}
    </Select>
    <Divider type="horizontal"> S I G N S </Divider>
    <p>
      <b>Object*</b>
    </p>
    <Select style={{ width: "100%" }} placeholder="Document A"></Select>
  </Modal>
);
