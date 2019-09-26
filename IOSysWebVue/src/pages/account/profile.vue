<!-- 个人信息 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.loginName" placeholder="请输入账号" disabled></el-input>
        </el-form-item>
        <el-form-item prop="nickName" label="昵称">
          <el-input v-model="form.nickName" maxlength="64" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input v-model="form.mobile" maxlength="64" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="form.email" maxlength="64" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input type="textarea" v-model="form.remark" rows="3" maxlength="1024" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item class="alginCenter">
          <el-button type="danger" @click="saveProfile">修改</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import AccAPI from '@/api/accountAPI';

export default {
  data() {
    return {
      form: {
        loginName: '', //登录名
        nickName: '', //昵称
        mobile: '', //手机
        email: '', //邮箱
        remark: '' //备注
      },
      rules: {
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    let that = this;

    //未缓存，请求数据
    if (!this.$store.getters.userInfo) {
      //请求参数
      let apiParams = {};
      //请求
      AccAPI.getCurrentUser(apiParams).then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Acc.SetCurrentUser, result.info);

          //初始化页面
          that.initPage();
        }
      });
    } else {
      //初始化页面
      that.initPage();
    }
  },
  methods: {
    //初始化页面
    initPage() {
      let user = this.$store.getters.userInfo;
      if (user) {
        this.form.loginName = user.loginName;
        this.form.nickName = user.nickName;
        this.form.mobile = user.mobile;
        this.form.email = user.email;
        this.form.remark = user.remark;
      }
    },
    //保存个人信息
    saveProfile() {
      let that = this;
      this.$refs.form.validate(valid => {
        if (valid) {
          //获取表单数据
          let user = this.getFormData();

          //保存
          AccAPI.saveUser(user).then(function(result) {
            if (result.isOK) {
              //缓存
              that.$store.commit(CST.Store.Acc.SetCurrentUser, user);

              that.$message.success({ showClose: true, message: '修改成功', duration: 2000 });

              //跳到首页
              that.$router.replace('/');
            } else {
              let msg = "修改失败（" + result.msg + "）";
              that.$message.error({ showClose: true, message: msg, duration: 2000 });
            }
          });
        }
      });
    },
    //获取表单数据
    getFormData() {
      let fromData = {
        id: this.$store.getters.userInfo.id,
        loginName: this.form.loginName,
        nickName: this.form.nickName,
        mobile: this.form.mobile,
        email: this.form.email,
        remark: this.form.remark
      };

      return fromData;
    }
  }
};
</script>
