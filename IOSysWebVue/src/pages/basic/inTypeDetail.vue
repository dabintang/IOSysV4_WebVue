<!-- 收入类型详情 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-main">

      <!--对话框-->
      <el-dialog :title="this.form.id==0?'新增':'修改'" :visible.sync="isShowForm" :close-on-click-modal="false" center>
        <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" maxlength="64" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="默认账户" prop="amountAccountID">
            <AASelect v-model="form.amountAccountID"></AASelect>
          </el-form-item>
          <el-form-item label="是否可用" prop="isActive">
            <el-switch v-model="form.isActive"></el-switch>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" :rows="4" maxlength="1024" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="isShowForm = false">取消</el-button>
          <el-button type="danger" @click.native="save">保存</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
import BasAPI from '@/api/basicAPI';
import AASelect from '@/components/aaSelect';

export default {
  components: {
    AASelect
  },
  data() {
    return {
      //对话框是否显示
      isShowForm: false,

      //表单数据
      form: {
        id: 0, //主键ID
        name: '', //名称
        amountAccountID: '', //默认账户
        isActive: true, //是否可用
        remark: '' //备注
      },
      //表单验证规则
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        amountAccountID: [{ required: true, message: '请选择默认账户', trigger: 'change' }]
      }
    };
  },
  mounted() {
  },
  methods: {
    //显示对话框
    showForm(id) {
      let that = this;

      //编辑模式
      if (id > 0) {
        //获取信息
        BasAPI.getInType(id).then(function(result) {
          if (result.isOK) {
            that.form = {
              id: result.info.id, //主键ID
              name: result.info.name, //名称
              amountAccountID: result.info.amountAccountID, //默认账户
              isActive: result.info.isActive, //是否可用
              remark: result.info.remark //备注
            };
          }
        });
      }
      //新增模式
      else {
        this.form = {
          id: 0, //主键ID
          name: '', //名称
          amountAccountID: '', //默认账户
          isActive: true, //是否可用
          remark: '' //备注
        };
      }

      //显示
      that.isShowForm = true;

      //清空输入控件状态
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    //保存
    save() {
      let that = this;

      //验证表单
      this.$refs.form.validate(valid => {
        if (valid) {
          //保存
          BasAPI.saveInType(this.form).then(function(result) {
            if (result.isOK) {
              //关闭对话框
              that.isShowForm = false;

              //成功提示
              that.$message.success({ showClose: true, message: '保存成功', duration: 2000 });

              //触发保存成功事件
              that.$emit("saved");
            } else {
              //错误提示
              let msg = '保存失败（' + result.msg + '）';
              that.$message.error({ showClose: true, message: msg, duration: 2000 });
            }
          });
        }
      });
    },
  }
};
</script>

<style scoped lang="scss">
</style>
