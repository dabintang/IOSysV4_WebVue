import * as API from './api';

export default {
  /********************** 账户 **********************/
  //查询账户列表
  queryAmountAccount: params => {
    return API.GET(CST.API.Bas.QueryAmountAccount, params);
  },
  //获取账户
  getAmountAccount: id => {
    return API.GET(CST.API.Bas.GetAmountAccount + '/' + id);
  },
  //保存账户
  saveAmountAccount: params => {
    return API.POST(CST.API.Bas.SaveAmountAccount, params);
  },
  //删除账户
  deleteAmountAccount: params => {
    return API.POST(CST.API.Bas.DeleteAmountAccount, params);
  },

  /********************** 收入类型 **********************/
  //查询收入类型列表
  queryInType: params => {
    return API.GET(CST.API.Bas.QueryInType, params);
  },
  //获取收入类型
  getInType: id => {
    return API.GET(CST.API.Bas.GetInType + '/' + id);
  },
  //保存收入类型
  saveInType: params => {
    return API.POST(CST.API.Bas.SaveInType, params);
  },
  //删除收入类型
  deleteInType: params => {
    return API.POST(CST.API.Bas.DeleteInType, params);
  },

  /********************** 支出类型 **********************/
  //查询支出分类类型列表
  queryOutCategoryType: params => {
    return API.GET(CST.API.Bas.QueryOutCategoryType, params);
  },
  //获取支出分类
  getOutCategory: id => {
    return API.GET(CST.API.Bas.GetOutCategory + '/' + id);
  },
  //保存支出分类
  saveOutCategory: params => {
    return API.POST(CST.API.Bas.SaveOutCategory, params);
  },
  //删除支出分类
  deleteOutCategory: params => {
    return API.POST(CST.API.Bas.DeleteOutCategory, params);
  },
  //获取支出类型
  getOutType: id => {
    return API.GET(CST.API.Bas.GetOutType + '/' + id);
  },
  //保存支出类型
  saveOutType: params => {
    return API.POST(CST.API.Bas.SaveOutType, params);
  },
  //删除支出类型
  deleteOutType: params => {
    return API.POST(CST.API.Bas.DeleteOutType, params);
  },

  /********************** 下拉框 **********************/
   //获取借还类型列表
   queryBorrowRepayType: ()=> {
    return API.GET(CST.API.Bas.QueryBorrowRepayType);
  },
   //获取收入统计方式
   queryInGroupType: () => {
    return API.GET(CST.API.Bas.QueryInGroupType);
  },
  //获取支出统计方式
  queryOutGroupType: () => {
    return API.GET(CST.API.Bas.QueryOutGroupType);
  },
};
