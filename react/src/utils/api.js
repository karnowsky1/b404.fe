import axios from 'axios';

export const getAllCompanies = () =>
  axios.get(window.__env__.API_URL + '/blink/api/company', {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  });
