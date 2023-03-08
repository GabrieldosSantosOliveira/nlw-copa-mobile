import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://172.21.59.207:3333',
});
