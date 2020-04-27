import axios from 'axios';

export function login(data) {
  return (dispatch) => {
    return axios.post('window.__env__.API_URL', data).then((res) => {
      const token = res.data.token;
      localStorage.setItem('jwtToken');
    });
  };
}
