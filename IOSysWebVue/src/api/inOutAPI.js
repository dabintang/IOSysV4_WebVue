import * as API from './api';

export default {
  /********************** 收入 **********************/
  //查询收入列表
  queryInCome: date => {
    return API.GET(CST.API.InOut.QueryInCome + '/' + date);
  },
  //获取收入信息
  getInCome: id => {
    return API.GET(CST.API.InOut.GetInCome + '/' + id);
  },
  //保存收入信息
  saveInCome: params => {
    return API.POST(CST.API.InOut.SaveInCome, params);
  },
  //删除收入信息
  deleteInCome: params => {
    return API.POST(CST.API.InOut.DeleteInCome, params);
  },

  /********************** 支出 **********************/
  //查询支出列表
  queryOutPut: date => {
    return API.GET(CST.API.InOut.QueryOutPut + '/' + date);
  },
  //获取支出信息
  getOutPut: id => {
    return API.GET(CST.API.InOut.GetOutPut + '/' + id);
  },
  //保存支出信息
  saveOutPut: params => {
    return API.POST(CST.API.InOut.SaveOutPut, params);
  },
  //删除支出信息
  deleteOutPut: params => {
    return API.POST(CST.API.InOut.DeleteOutPut, params);
  },

  /********************** 转账 **********************/
  //查询转账列表
  queryTransfer: date => {
    return API.GET(CST.API.InOut.QueryTransfer + '/' + date);
  },
  //获取转账信息
  getTransfer: id => {
    return API.GET(CST.API.InOut.GetTransfer + '/' + id);
  },
  //保存转账信息
  saveTransfer: params => {
    return API.POST(CST.API.InOut.SaveTransfer, params);
  },
  //删除转账信息
  deleteTransfer: params => {
    return API.POST(CST.API.InOut.DeleteTransfer, params);
  },

  /********************** 借还 **********************/
  //查询借还列表
  queryBorrowRepay: date => {
    return API.GET(CST.API.InOut.QueryBorrowRepay + '/' + date);
  },
  //获取借还信息
  getBorrowRepay: id => {
    return API.GET(CST.API.InOut.GetBorrowRepay + '/' + id);
  },
  //保存借还信息
  saveBorrowRepay: params => {
    return API.POST(CST.API.InOut.SaveBorrowRepay, params);
  },
  //删除借还信息
  deleteBorrowRepay: params => {
    return API.POST(CST.API.InOut.DeleteBorrowRepay, params);
  },
};