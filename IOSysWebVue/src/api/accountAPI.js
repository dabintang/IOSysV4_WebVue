import * as API from './api';

export default {
  //登录
  login: params => {
    return API.POST(CST.API.Acc.Login, params);
  },
  //获取个人信息
  getCurrentUser: params => {
    return API.GET(CST.API.Acc.GetCurrentUser, params);
  },
  //修改个人信息
  saveUser: params => {
    return API.POST(CST.API.Acc.SaveUser, params);
  },
  //修改密码
  changePassword: params => {
    return API.POST(CST.API.Acc.ChangePassword, params);
  }
};
