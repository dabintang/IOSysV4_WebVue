<!-- 支出类型详情 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-main">

      <!--类型对话框-->
      <el-dialog :title="formType.id==0?'新增类型':'修改类型'" v-show="isShowFormType" :visible.sync="isShowFormType" :close-on-click-modal="false" center>
        <el-form :model="formType" label-width="80px" :rules="formRulesType" ref="formType">
          <el-form-item label="名称" prop="name">
            <el-input v-model="formType.name" maxlength="64" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="支出分类" prop="outCategoryID">
            <OCSelect v-model="formType.outCategoryID"></OCSelect>
          </el-form-item>
          <el-form-item label="默认账户" prop="amountAccountID">
            <AASelect v-model="formType.amountAccountID"></AASelect>
          </el-form-item>
          <el-form-item label="是否可用" prop="isActive">
            <el-switch v-model="formType.isActive"></el-switch>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formType.remark" :rows="4" maxlength="1024" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="isShowFormType = false">取消</el-button>
          <el-button type="danger" @click.native="saveType">保存</el-button>
        </div>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import BasAPI from '@/api/basicAPI';
import AASelect from '@/components/aaSelect';
import OCSelect from '@/components/ocSelect';

export default {
  components: {
    AASelect,
    OCSelect
  },
  data() {
    return {
      //类型对话框是否显示
      isShowFormType: false,
      //类型表单数据
      formType: {
        id: 0, //主键ID
        outCategoryID: 0, //支出分类ID
        name: '', //名称
        amountAccountID: '', //默认账户
        isActive: true, //是否可用
        remark: '' //备注
      },
      //类型表单验证规则
      formRulesType: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        outCategoryID: [{ required: true, message: '请选择分类', trigger: 'change' }],
        amountAccountID: [{ required: true, message: '请选择默认账户', trigger: 'change' }]
      }
    };
  },
  mounted() {
  },
  methods: {
    //显示类型对话框
    showFormType(id, outCategoryID) {
      //显示对话框
      this.isShowFormType = true;

      //清空输入控件状态
      if (this.$refs.formType) {
        this.$refs.formType.resetFields();
      }

      let that = this;
      //编辑模式
      if (id > 0) {
        //获取信息
        BasAPI.getOutType(id).then(function(result) {
          if (result.isOK) {
            that.formType = {
              id: result.info.id, //主键ID
              outCategoryID: result.info.outCategoryID, //支出分类ID
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
         this.formType = {
            id: 0, //主键ID
            outCategoryID: outCategoryID, //支出分类ID
            name: '', //名称
            amountAccountID: '', //默认账户
            isActive: true, //是否可用
            remark: '' //备注
          };
      }
    },
    //保存类型
    saveType() {
      let that = this;

      //验证表单
      this.$refs.formType.validate(valid => {
        if (valid) {
          //保存
          BasAPI.saveOutType(this.formType).then(function(result) {
            if (result.isOK) {
              //关闭对话框
              that.isShowFormType = false;

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
