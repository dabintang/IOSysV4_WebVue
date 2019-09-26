<!-- 支出分类详情 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-main">

      <!--分类对话框-->
      <el-dialog :title="formCategory.id==0?'新增分类':'修改分类'" :visible.sync="isShowFormCategory" :close-on-click-modal="false" center>
        <el-form :model="formCategory" label-width="80px" :rules="formRulesCategory" ref="formCategory">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formCategory.name" maxlength="64" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="是否可用" prop="isActive">
            <el-switch v-model="formCategory.isActive"></el-switch>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formCategory.remark" :rows="4" maxlength="1024" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="isShowFormCategory = false">取消</el-button>
          <el-button type="danger" @click.native="saveCategory">保存</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
import BasAPI from '@/api/basicAPI';

export default {
  data() {
    return {
      //分类对话框是否显示
      isShowFormCategory: false,
      //分类表单数据
      formCategory: {
        id: 0, //主键ID
        name: '', //名称
        isActive: true, //是否可用
        remark: '' //备注
      },
      //分类表单验证规则
      formRulesCategory: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    };
  },
  mounted() {
  },
  methods: {
    //显示分类对话框
    showFormCategory(id) {
      //显示对话框
      this.isShowFormCategory = true;

      //清空输入控件状态
      if (this.$refs.formCategory) {
        this.$refs.formCategory.resetFields();
      }

      let that = this;
      //编辑模式
      if (id > 0) {
        //获取信息
        BasAPI.getOutCategory(id).then(function(result) {
          if (result.isOK) {
            that.formCategory = {
              id: result.info.id, //主键ID
              name: result.info.name, //名称
              isActive: result.info.isActive, //是否可用
              remark: result.info.remark //备注
            };
          }
        });
      }
      //新增模式
      else {
        this.formCategory = {
          id: 0, //主键ID
          name: '', //名称
          isActive: true, //是否可用
          remark: '' //备注
        };
      }
    },
    //保存分类
    saveCategory() {
      let that = this;

      //验证表单
      this.$refs.formCategory.validate(valid => {
        if (valid) {
          //保存
          BasAPI.saveOutCategory(this.formCategory).then(function(result) {
            if (result.isOK) {
              //关闭对话框
              that.isShowFormCategory = false;

              //成功提示
              that.$message.success({
                showClose: true,
                message: '保存成功',
                duration: 2000
              });

              //触发保存成功事件
              that.$emit("saved");
            } else {
              //错误提示
              let msg = '保存失败（' + result.msg + '）';
              that.$message.error({
                showClose: true,
                message: msg,
                duration: 2000
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
