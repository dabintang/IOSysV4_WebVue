<!-- 登录 -->
<template>
  <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">登 &nbsp;&nbsp; 录</h3>
    <el-form-item prop="loginName">
      <el-input type="text" v-model="account.loginName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="account.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="doLogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import AccAPI from '@/api/accountAPI';
import Util from '@/utils/util';

export default {
  data() {
    return {
      account: {
        loginName: '',
        password: ''
      },
      rules: {
        loginName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    doLogin() {
      let that = this;
      //输入验证
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          //登录参数
          let loginParams = {
            loginName: this.account.loginName,
            password: Util.AES.encrypt(this.account.password)
          };
          //登录请求
          AccAPI.login(loginParams).then(function(result) {
            if (result.isOK) {
              //设置登录信息
              that.$store.commit(CST.Store.Acc.SetLoginInfo, result.info);
              //跳到主页
              that.$router.push({ path: '/' });
            } else {
              that.$message.error({ showClose: true, message: '登录失败（' + result.msg + '）', duration: 2000 });
            }
          });
        }
      });
    }
  }
};
</script>
<style>
body {
  background: #dfe9fb;
}
</style>
<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 160px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  background: -ms-linear-gradient(top, #ace, #00c1de); /* IE 10 */
  background: -moz-linear-gradient(top, #ace, #00c1de); /*火狐*/
  background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00c1de)); /*谷歌*/
  background: -webkit-linear-gradient(top, #ace, #00c1de); /*Safari5.1 Chrome 10+*/
  background: -o-linear-gradient(top, #ace, #00c1de); /*Opera 11.10+*/

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
