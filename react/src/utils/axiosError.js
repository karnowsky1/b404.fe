import { message } from 'antd';

export const axiosError = error => {
  message.destroy();
  if (error.response) {
    // Request made and server responded
    message.error(error.response.data.error);
  } else if (error.request) {
    // The request was made but no response was received
    message.error('Server not responding');
  } else {
    // Something happened in setting up the request that triggered an Error
    message.error('Error setting up request');
  }
};
