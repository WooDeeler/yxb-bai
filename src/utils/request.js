import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '../store'

// 创建axios实例
const service = axios.create({
  timeout: 30000,
  responseType: 'json'
})


export default service
