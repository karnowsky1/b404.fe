import { axiosError } from './axiosError';
import axios from 'axios';
import { Modal } from 'antd';

const { confirm } = Modal;

export const showDeleteConfirmUtil = (
  id,
  content,
  associatedContent,
  onSuccess,
  onCancel
) => {
  confirm({
    title: `Are you sure you want to delete this ${content}?`,
    content: `If you delete this ${content}, all associated ${associatedContent} will be romoved from the system!`,
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      axios
        .delete(`${window.__env__.API_URL}/blink/api/${content}/${id}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then(onSuccess)
        .catch(axiosError);
    },
    onCancel,
  });
};
