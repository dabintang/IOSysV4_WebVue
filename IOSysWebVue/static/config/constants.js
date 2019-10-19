const CST = {
  API: {
    Base: 'http://127.0.0.1:20001', //基地址
    Acc: {
      Login: '/api/Account/Login', //登录
      GetCurrentUser: '/api/Account/GetCurrentUser', //获取当前用户信息
      SaveUser: '/api/Account/SaveUser', //保存用户信息
      ChangePassword: '/api/Account/ChangePassword'
    },
    Bas: {
      /********************** 账户 **********************/
      QueryAmountAccount: '/api/Basic/QueryAmountAccount', //查询账户列表
      GetAmountAccount: '/api/Basic/GetAmountAccount', //获取账户
      SaveAmountAccount: '/api/Basic/SaveAmountAccount', //保存账户
      DeleteAmountAccount: '/api/Basic/DeleteAmountAccount', //删除账户

      /********************** 收入类型 **********************/
      QueryInType: '/api/Basic/QueryInType', //查询收入类型列表
      GetInType: '/api/Basic/GetInType', //获取收入类型
      SaveInType: '/api/Basic/SaveInType', //保存收入类型
      DeleteInType: '/api/Basic/DeleteInType', //删除收入类型

      /********************** 支出分类 **********************/
      QueryOutCategoryType: '/api/Basic/QueryOutCategoryType', //查询支出类型列表
      GetOutCategory: '/api/Basic/GetOutCategory', //获取支出分类
      SaveOutCategory: '/api/Basic/SaveOutCategory', //保存支出分类
      DeleteOutCategory: '/api/Basic/DeleteOutCategory', //删除支出分类

      /********************** 支出类型 **********************/
      GetOutType: '/api/Basic/GetOutType', //获取支出类型
      SaveOutType: '/api/Basic/SaveOutType', //保存支出类型
      DeleteOutType: '/api/Basic/DeleteOutType', //删除支出类型

      /********************** 下拉框 **********************/
      QueryBorrowRepayType: '/api/Basic/QueryBorrowRepayType', //获取借还类型
      QueryInGroupType: '/api/Basic/QueryInGroupType', //获取收入统计方式
      QueryOutGroupType: '/api/Basic/QueryOutGroupType', //获取支出统计方式
    },
    InOut: {
      /********************** 收入 **********************/
      QueryInCome: '/api/InOut/QueryInCome', //查询收入列表
      GetInCome: '/api/InOut/GetInCome', //获取收入信息
      SaveInCome: '/api/InOut/SaveInCome', //保存收入信息
      DeleteInCome: '/api/InOut/DeleteInCome', //删除收入信息

      /********************** 支出 **********************/
      QueryOutPut: '/api/InOut/QueryOutPut', //查询支出列表
      GetOutPut: '/api/InOut/GetOutPut', //获取支出信息
      SaveOutPut: '/api/InOut/SaveOutPut', //保存支出信息
      DeleteOutPut: '/api/InOut/DeleteOutPut', //删除支出信息

      /********************** 转账 **********************/
      QueryTransfer: '/api/InOut/QueryTransfer', //查询转账列表
      GetTransfer: '/api/InOut/GetTransfer', //获取转账信息
      SaveTransfer: '/api/InOut/SaveTransfer', //保存转账信息
      DeleteTransfer: '/api/InOut/DeleteTransfer', //删除转账信息

      /********************** 借还 **********************/
      QueryBorrowRepay: '/api/InOut/QueryBorrowRepay', //查询借还列表
      GetBorrowRepay: '/api/InOut/GetBorrowRepay', //获取借还信息
      SaveBorrowRepay: '/api/InOut/SaveBorrowRepay', //保存借还信息
      DeleteBorrowRepay: '/api/InOut/DeleteBorrowRepay', //删除借还信息
    },
    Report: {
      /********************** 明细 **********************/
      QueryInRecord: '/api/Report/QueryInRecord', //查询收入明细列表
      QueryOutRecord: '/api/Report/QueryOutRecord', //查询支出明细列表
      QueryTransferRecord: '/api/Report/QueryTransferRecord', //查询转账明细列表
      QueryBorrowRepayRecord: '/api/Report/QueryBorrowRepayRecord', //查询借还明细列表

      /********************** 统计 **********************/
      SumInCome: '/api/Report/SumInCome', //收入统计
      SumOutPut: '/api/Report/SumOutPut', //支出统计
      SumBorrowRepayTarget: '/api/Report/SumBorrowRepayTarget', //按借还者统计借还信息
    }
  },
  Store: {
    Acc: {
      SetLoginInfo: 'SetLoginInfo', //设置登录信息
      SetCurrentUser: 'SetCurrentUser' //设置当前用户信息
    },
    Bas: {
      SetAmountAccountList: 'SetAmountAccountList', //设置账户列表信息
      SetInTypeList: 'SetInTypeList', //设置收入类型列表信息
      SetOutCategoryTypeList: 'SetOutCategoryTypeList', //设置支出类型列表信息
      SetBorrowRepayTypeList: 'SetBorrowRepayTypeList', //设置借还类型列表信息
      SetInGroupTypeList: 'SetInGroupTypeList', //设置收入统计方式列表信息
      SetOutGroupTypeList: 'SetOutGroupTypeList', //设置支出统计方式列表信息
    }
  },
  Cst: {
    BorrowRepayType: { //借还类型
      borrowIn: 1, //借入
      repayIn: 2, //还入
      borrowOut: 3, //借出
      repayOut: 4, //还出
    }
  }
};
