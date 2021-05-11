import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:5000/',
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    'x-access-token': `${window.localStorage.getItem('token')}`,
  },
});
