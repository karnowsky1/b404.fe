import React from 'react';
import { Modal } from 'antd';
import {
  welcomeMessageOne,
  welcomeMessageTwo,
  welcomeMessageThree,
  welcomeMessageFour,
} from '../../constants/messages';

const { info } = Modal;

export const SettingsInfoModal = (username) => {
  info({
    title: `Welcome ${username}`,
    content: (
      <div>
        <p></p>
        <p></p>
        <p>{welcomeMessageOne}</p>
        <p>{welcomeMessageTwo}</p>
        <p>{welcomeMessageThree}</p>
        <p style={{ color: '#cc0000' }}>{welcomeMessageFour}</p>
      </div>
    ),
    onOk() {},
  });
};
