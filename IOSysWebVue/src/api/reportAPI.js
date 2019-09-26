import * as API from './api';

export default {
  /********************** 明细 **********************/
  //查询收入明细列表
  queryInRecord: params => {
    return API.POST(CST.API.Report.QueryInRecord, params);
  },
  //查询支出明细列表
  queryOutRecord: params => {
    return API.POST(CST.API.Report.QueryOutRecord, params);
  },
  //查询转账明细列表
  queryTransferRecord: params => {
    return API.POST(CST.API.Report.QueryTransferRecord, params);
  },
  //查询借还明细列表
  queryBorrowRepayRecord: params => {
    return API.POST(CST.API.Report.QueryBorrowRepayRecord, params);
  },

  /********************** 统计 **********************/
  //收入统计
  sumInCome: params => {
    return API.GET(CST.API.Report.SumInCome, params);
  },
  //支出统计
  sumOutPut: params => {
    return API.GET(CST.API.Report.SumOutPut, params);
  },
  //按借还者统计借还信息
  sumBorrowRepayTarget: params => {
    return API.GET(CST.API.Report.SumBorrowRepayTarget, params);
  },
};