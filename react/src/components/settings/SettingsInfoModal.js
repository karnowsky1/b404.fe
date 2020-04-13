import React from 'react';
import { Modal } from 'antd';

const { info } = Modal;

export const SettingsInfoModal = () => {
  info({
    title: 'This is a notification message',
    content: (
      <div>
        <p>some messages...some messages...</p>
        <p>some messages...some messages...</p>
      </div>
    ),
    onOk() {},
  });
};
