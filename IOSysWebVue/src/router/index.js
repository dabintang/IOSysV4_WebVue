import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/pages/home';
import Login from '@/pages/Account/Login';
import HomePage from '@/pages/homePage';
import UserProfile from '@/pages/Account/profile';
import ChangePwd from '@/pages/Account/changePwd';
import AmountAccountList from '@/pages/Basic/amountAccountList';
import InTypeList from '@/pages/Basic/inTypeList';
import OutTypeList from '@/pages/Basic/outTypeList';
import InComeList from '@/pages/inOut/inComeList';
import OutPutList from '@/pages/inOut/outPutList';
import TransferList from '@/pages/inOut/transferList';
import BorrowRepayList from '@/pages/inOut/borrowRepayList';
import InRecordList from '@/pages/report/inRecordList';
import OutRecordList from '@/pages/report/outRecordList';
import TransferRecordList from '@/pages/report/transferRecordList';
import BorrowRepayRecordList from '@/pages/report/borrowRepayRecordList';
import InSum from '@/pages/report/inSum';
import OutSum from '@/pages/report/outSum';
import BorrowRepaySum from '@/pages/report/borrowRepaySum';

// 懒加载方式，当路由被访问的时候才加载对应组件
// const Login = resolve => require(['@/pages/Account/Login'], resolve);

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/homePage',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [{ path: '/homePage', component: HomePage, name: '首页', menuShow: true }]
    },
    {
      path: '/',
      component: Home,
      iconCls: 'iconfont icon-basic',
      name: '基础',
      menuShow: true,
      children: [
        {
          path: '/basic/inTypeList',
          component: InTypeList,
          iconCls: 'iconfont icon-inType',
          name: '收入类型',
          menuShow: true
        },
        {
          path: '/basic/outTypeList',
          component: OutTypeList,
          iconCls: 'iconfont icon-outType',
          name: '支出类型',
          menuShow: true
        },
        {
          path: '/basic/amountAccountList',
          component: AmountAccountList,
          iconCls: 'iconfont icon-amountAccount',
          name: '账户信息',
          menuShow: true
        }
      ]
    },
    {
      path: '/',
      component: Home,
      iconCls: 'iconfont icon-inout',
      name: '收支',
      menuShow: true,
      children: [
        {
          path: '/basic/inComeList',
          component: InComeList,
          iconCls: 'iconfont icon-inCome',
          name: '收入',
          menuShow: true
        },
        {
          path: '/basic/outPutList',
          component: OutPutList,
          iconCls: 'iconfont icon-outPut',
          name: '支出',
          menuShow: true
        },
        {
          path: '/basic/transfer',
          component: TransferList,
          iconCls: 'iconfont icon-transfer',
          name: '转账',
          menuShow: true
        },
        {
          path: '/basic/borrowRepay',
          component: BorrowRepayList,
          iconCls: 'iconfont icon-borrowRepay',
          name: '借还',
          menuShow: true
        }
      ]
    },
    {
      path: '/',
      component: Home,
      iconCls: 'iconfont icon-report',
      name: '报表',
      menuShow: true,
      children: [
        {
          path: '/report/inRecordList',
          component: InRecordList,
          iconCls: 'iconfont icon-inRecord',
          name: '收入明细',
          menuShow: true
        },
        {
          path: '/report/outRecordList',
          component: OutRecordList,
          iconCls: 'iconfont icon-outRecord',
          name: '支出明细',
          menuShow: true
        },
        {
          path: '/report/transferRecordList',
          component: TransferRecordList,
          iconCls: 'iconfont icon-transferRecord',
          name: '转账明细',
          menuShow: true
        },
        {
          path: '/report/borrowRepayRecordList',
          component: BorrowRepayRecordList,
          iconCls: 'iconfont icon-borrowRepayRecord',
          name: '借还明细',
          menuShow: true
        },
        {
          path: '/report/inSum',
          component: InSum,
          iconCls: 'iconfont icon-inSum',
          name: '收入统计',
          menuShow: true
        },
        {
          path: '/report/outSum',
          component: OutSum,
          iconCls: 'iconfont icon-outSum',
          name: '支出统计',
          menuShow: true
        },
        {
          path: '/report/borrowRepaySum',
          component: BorrowRepaySum,
          iconCls: 'iconfont icon-borrowReplaySum',
          name: '借还统计',
          menuShow: true
        }
      ]
    },
    {
      path: '/',
      component: Home,
      iconCls: 'iconfont icon-setting',
      name: '设置',
      menuShow: true,
      children: [
        {
          path: '/account/profile',
          component: UserProfile,
          iconCls: 'iconfont icon-user',
          name: '个人信息',
          menuShow: true
        },
        {
          path: '/account/changePwd',
          component: ChangePwd,
          iconCls: 'iconfont icon-pwd',
          name: '修改密码',
          menuShow: true
        }
      ]
    }
  ]
});
