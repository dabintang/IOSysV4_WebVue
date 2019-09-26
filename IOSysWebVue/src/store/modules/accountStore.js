const account = {
  state: {
    loginInfo: null, //登录信息
    userInfo: null //当前用户信息
  },
  getters: {
    // 用户信息
    loginInfo: state => {
      if (!state.loginInfo) {
        var strUser = sessionStorage.getItem(CST.Store.Acc.SetLoginInfo);
        if (strUser) {
          let user = JSON.parse(strUser);
          state.loginInfo = user;
        }
      }

      return state.loginInfo;
    },
    //当前用户信息
    userInfo: state => state.userInfo
  },
  mutations: {
    //设置登录信息
    [CST.Store.Acc.SetLoginInfo](state, loginInfo) {
      state.loginInfo = loginInfo;
      sessionStorage.setItem(CST.Store.Acc.SetLoginInfo, JSON.stringify(loginInfo));
    },
    //设置当前信息
    [CST.Store.Acc.SetCurrentUser](state, userInfo) {
      state.userInfo = userInfo;
    }
  }
};

export default account;
