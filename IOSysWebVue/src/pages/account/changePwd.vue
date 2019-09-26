<!-- 修改密码 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="oldPwd" label="原密码">
          <el-input type="password" v-model="form.oldPwd" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
          <el-input type="password" v-model="form.newPwd" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPwd" label="确认新密码">
          <el-input type="password" v-model="form.confirmPwd" placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-form-item class="alginCenter">
          <el-button type="danger" @click="handleChangePwd">修改</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import AccAPI from '@/api/accountAPI';
import Util from '@/utils/util';

export default {
  data() {
    return {
      form: {
        oldPwd: '', //原密码
        newPwd: '', //新密码
        confirmPwd: '' //确认新密码
      },
      rules: {
        oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        confirmPwd: [{ required: true, message: '请输入确认新密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    handleChangePwd() {
      let that = this;
      that.$refs.form.validate(valid => {
        if (valid) {
          //验证确认密码
          if (that.form.newPwd != that.form.confirmPwd) {
            that.$message.error({ showClose: true, message: '2次输入的新密码不一致', duration: 2000 });
            return;
          }
          //判断密码长度
          if (that.form.newPwd.length > 10) {
            that.$message.error({ showClose: true, message: '新密码长度不能超过10位', duration: 2000 });
            return;
          }

          //请求参数
          let req = {
            oldPassword: Util.AES.encrypt(that.form.oldPwd),
            newPassword: Util.AES.encrypt(that.form.newPwd)
          };

          AccAPI.changePassword(req).then(function(result) {
            if (result.isOK) {
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
    }
  }
};
</script>
