const basic = {
  state: {
    LstAmountAccount: [], //账户列表
    LstInType: [], //收入类型
    LstOutCategoryType: [], //支出分类类型
    LstBorrowRepayType: [], //借还类型
    LstInGroupType: [], //收入统计方式
    LstOutGroupType: [] //支出统计方式
  },
  getters: {
    //账户列表
    lstAmountAccount: state => state.LstAmountAccount,
    //收入类型列表
    lstInType: state => state.LstInType,
    //支出分类类型列表
    lstOutCategoryType: state => state.LstOutCategoryType,
    //借还类型列表
    lstBorrowRepayType: state => state.LstBorrowRepayType,
    //收入统计方式列表
    lstInGroupType: state => state.LstInGroupType,
    //支出统计方式列表
    lstOutGroupType: state => state.LstOutGroupType
  },
  mutations: {
    //设置账户列表
    [CST.Store.Bas.SetAmountAccountList](state, lstAmountAccount) {
      state.LstAmountAccount = lstAmountAccount;
    },
    //设置收入类型列表
    [CST.Store.Bas.SetInTypeList](state, lstInType) {
      state.LstInType = lstInType;
    },
    //设置支出分类类型
    [CST.Store.Bas.SetOutCategoryTypeList](state, lstOutCategoryType) {
      state.LstOutCategoryType = lstOutCategoryType;
    },
    //设置借还类型列表
    [CST.Store.Bas.SetBorrowRepayTypeList](state, lstBorrowRepayType) {
      state.LstBorrowRepayType = lstBorrowRepayType;
    },
    //设置收入统计方式列表
    [CST.Store.Bas.SetInGroupTypeList](state, lstInGroupType) {
      state.LstInGroupType = lstInGroupType;
    },
    //设置支出统计方式列表
    [CST.Store.Bas.SetOutGroupTypeList](state, lstOutGroupType) {
      state.LstOutGroupType = lstOutGroupType;
    }
  }
};

export default basic;
