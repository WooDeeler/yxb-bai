import request from '../utils/request'


// 用户相关接口
export const userApi = {
  login: (data) => request({
    url: '/user/login',
    method: 'post',
    data
  }),
  logout: () => request({
    url: '/user/logout',
    method: 'post'
  }),
  getUserInfo: () => request({
    url: '/user/info',
    method: 'get'
  })
}

// 文件管理接口
export const fileApi = {
  upload: (data) => request({
    url: '/file/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  download: (id) => request({
    url: `/file/download/${id}`,
    method: 'get',
    responseType: 'blob'
  }),
  list: (params) => request({
    url: '/file/list',
    method: 'get',
    params
  }),
  delete: (id) => request({
    url: `/file/${id}`,
    method: 'delete'
  })
}

// 院校管理接口
export const schoolApi = {
  list: (data) => request({
    url: '/univbl/univ/page',
    method: 'post',
    data
  }),
  condQuery: (data) => request({
    url: '/univbl/univ/condQuery',
    method: 'post',
    data
  }),
  create: (data) => request({
    url: '/univbl/univ/add',
    method: 'post',
    data
  }),
  update: (data) => request({
    url: `/univbl/univ/update`,
    method: 'post',
    data
  }),
  delete: (data) => request({
    url: '/univbl/univ/delete',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  }),
}

// 专业管理接口
export const majorApi = {
  condQuery: (data) => request({
    url: '/univbl/major/condQuery',
    method: 'post',
    data
  }),
  create: (data) => request({
    url: '/univbl/major/add',
    method: 'post',
    data
  }),
  update: (data) => request({
    url: `/univbl/major/update`,
    method: 'post',
    data
  }),
  delete: (data) => request({
    url: '/univbl/major/delete',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  }),
}

// 新闻管理接口
export const newsApi = {
  list: (data) => request({
    url: '/newsvl/news/list',
    method: 'post',
    data
  }),
  create: (data) => request({
    url: '/newsvl/news',
    method: 'post',
    data
  }),
  update: (data) => request({
    url: `/newsvl/news/${id}`,
    method: 'post',
    data
  }),
  delete: (data) => request({
    url: `/newsvl/news/${id}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  }),
  detail: (data) => request({
    url: `/newsvl/news/${id}`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}