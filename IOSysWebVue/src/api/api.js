import axios from 'axios';
import router from '@/router';
import store from '@/store/store';
import { Message, Loading } from 'element-ui';

//axios.defaults.withCredentials = true;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';//配置请求头

const qs = require('qs');

//等待框
let loadingInstance = null;

//添加一个请求拦截器
axios.interceptors.request.use(
  function (config) {
    //显示等待框
    loadingInstance = Loading.service({
      lock: true,
      text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    //传入Token
    if (store.getters.loginInfo) {
      // 判断是否存在Token，如果存在的话，则每个http header都加上Token
      config.headers.Authorization = `${store.getters.loginInfo.token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error

    //关闭等待框
    if (loadingInstance) {
      loadingInstance.close();
    }

    return Promise.reject(error);
  }
);

// 添加一个响应拦截器
axios.interceptors.response.use(
  function (response) {
    //关闭等待框
    if (loadingInstance) {
      loadingInstance.close();
    }

    return response;
  },
  function (error) {
    // Do something with response error

    //关闭等待框
    if (loadingInstance) {
      loadingInstance.close();
    }

    //提升消息
    let msg = '请求出现异常（' + error + '）';

    //如果是未授权错误，跳到登录页
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          });

          msg = '登录超时，请重新登录';
      }
    }

    //弹框显示错误
    Message({
      showClose: true,
      message: msg,
      type: 'error',
      duration: 3000
    });

    return Promise.reject(error);
  }
);

//通用方法
export const POST = (url, params) => {
  return axios.post(`${CST.API.Base}${url}`, params).then(res => res.data);
};

export const GET = (url, params) => {
  return axios.get(`${CST.API.Base}${url}`,
    {
      params: params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
      }
    }).then(res => res.data);
};

export const PUT = (url, params) => {
  return axios.put(`${CST.API.Base}${url}`, params).then(res => res.data);
};

export const DELETE = (url, params) => {
  return axios.delete(`${CST.API.Base}${url}`, { params: params }).then(res => res.data);
};

export const PATCH = (url, params) => {
  return axios.patch(`${CST.API.Base}${url}`, params).then(res => res.data);
};
