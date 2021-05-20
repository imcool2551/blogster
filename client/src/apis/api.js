import axios from 'axios';

export default axios.create({
  // baseURL: 'http://localhost:5000/',
  baseURL: 'https://api.wsangwook.com/',
  headers: {
    Authorization: {
      toString() {
        return `Bearer ${localStorage.getItem('token')}`;
      },
    },
    'x-access-token': {
      toString() {
        return `${window.localStorage.getItem('token')}`;
      },
    },
  },
});
