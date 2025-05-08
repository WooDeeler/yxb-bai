import request from '../utils/request'


// 用户相关接口
export const userApi = {
  login: (data) => request({
    url: '/userbl/user/login',
    method: 'post',
    data
  })
}

// 文件管理接口
export const fileApi = {
  upload: (data) => request({
    url: '/univbl/study/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  download: (id) => request({
    url: `/univbl/study/download/${id}`,
    method: 'get',
    responseType: 'blob'
  }),
  query: (data) => request({
    url: '/univbl/study/query',
    method: 'post',
    data
  }),
  delete: (data) => request({
    url: `/univbl/study/delete`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
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
    url: '/newsbl/news/list',
    method: 'post',
    data
  }),
  create: (data) => request({
    url: '/newsbl/news/create',
    method: 'post',
    data
  }),
  update: (data) => request({
    url: `/newsbl/news/update`,
    method: 'post',
    data
  }),
  delete: (data) => request({
    url: `/newsbl/news/delete`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  }),
  detail: (data) => request({
    url: `/newsbl/news/detail`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}