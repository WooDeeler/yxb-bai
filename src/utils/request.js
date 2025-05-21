import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '../store'

// 创建axios实例
const service = axios.create({
  // baseURL: 'http://119.29.191.232',
  // baseURL: '/api',
  timeout: 30000,
  responseType: 'json'
})


export default service