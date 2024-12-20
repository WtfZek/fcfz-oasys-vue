import axios from 'axios'
import config from '../config'
import {ElMessage} from 'element-plus'
import store from "../store";
import router from '../router'

const NETWORK_ERROR = '网络请求异常,请稍后重试.....'

// axios.defaults.withCredentials = true;
// 创建一个axios实例对象
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 10000, // 设置超时时间
})

// 在请求之前做一些事情
service.interceptors.request.use((req) => {
  // 可以自定义header
  const key = localStorage.getItem('tokenKey'); // 一般都是 satoken
  const value = localStorage.getItem('tokenValue'); // uuid 形式
  // store.commit('getToken');
  if (key && value) {
    req.headers[key] = value;
  }
  // jwt-token认证的时候
  return req
})

// 在请求之后做一些事情
service.interceptors.response.use((res) => {
  // if (res.config.url.includes('/captcha/get')) {
  //   return res;
  // }
  const {code, data, msg} = res.data
  console.log('res', res)
  console.log('code', code)
  // 根据后端 协商  视情况而定
  if (code === '200') {
    console.log('data', data)
    return data ? data : true;
  } else if (code === '10302') {
    console.log('token过期')
    store.commit('clearToken');
    store.commit('cleanMenu');
    store.commit('clearToken');
    router.push('/login')
  } else if (code === '500') {
    console.log('服务器异常')
    console.log(msg)
    ElMessage.error('服务器异常')
    return Promise.reject('服务器异常')
  } else {
    // 网络请求错误，用element-plus的弹窗信息
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

// 封装的核心函数
function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() == 'get') {
    options.params = options.data
  }
  // 对mock的处理
  let isMock = config.mock
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock
  }

  // 设置 responseType 为 blob（如果明确需要流）
  if (options.responseType) {
    service.defaults.responseType = options.responseType;
  }

  // 对线上环境做处理
  if (config.env == 'prod') {
    // 不给你用到mock的机会
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }

  // 这样外部 .service 也是 .request
  return service(options)
}
export default request