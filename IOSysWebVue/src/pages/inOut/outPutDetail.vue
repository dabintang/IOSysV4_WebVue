<!-- 支出详情 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-main">
      <!--对话框-->
      <el-dialog :title="this.form.id==0?'新增':'修改'" :visible.sync="isShowForm" :close-on-click-modal="false" center>
        <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
          <el-form-item label="日期" prop="outDate">
            <el-date-picker v-model="form.outDate" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd" :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="类型" prop="outTypeID">
            <OTSelect v-model="form.outTypeID" @change="outTypeChange"></OTSelect>
          </el-form-item>
          <el-form-item label="账户" prop="amountAccountID">
            <AASelect v-model="form.amountAccountID"></AASelect>
          </el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input v-model.number="form.amount" placeholder="请输入金额"></el-input>
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
import InOutAPI from '@/api/inOutAPI';
import Util from '@/utils/util';
import AASelect from '@/components/aaSelect';
import OTSelect from '@/components/otSelect';

export default {
  components: {
    AASelect,
    OTSelect
  },
  data() {
    return {
      //对话框是否显示
      isShowForm: false,

      //表单数据
      form: {
        id: 0, //主键ID
        outDate: '', //日期
        outTypeID: '', //类型
        amountAccountID: '', //账户
        amount: '', //金额
        remark: '' //备注
      },
      //表单验证规则
      formRules: {
        outDate: [
          {
            type: 'string',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
        outTypeID: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        amountAccountID: [{ required: true, message: '请选择账户', trigger: 'change' }],
        amount: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数值' }
        ]
      }
    };
  },
  mounted() {
  },
  methods: {
    //显示对话框
    showForm(id, date) {
      //显示对话框
      this.isShowForm = true;

      //清空输入控件状态
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }

      let that = this;
      //编辑模式
      if (id > 0) {
        //获取信息
        InOutAPI.getOutPut(id).then(function(result) {
          if (result.isOK) {
            that.form = {
              id: result.info.id, //主键ID
              outDate: Util.Fun.formatDate(result.info.outDate), //日期
              outTypeID: result.info.outTypeID, //类型
              amountAccountID: result.info.amountAccountID, //账户
              amount: result.info.amount, //金额
              remark: result.info.remark //备注
            };
          }
        });
      }
      //新增模式
      else {
        this.form = {
          id: 0, //主键ID
          outDate: date, //日期
          outTypeID: '', //类型
          amountAccountID: '', //账户
          amount: '', //金额
          remark: '' //备注
        };
      }
    },
    //保存
    save() {
      let that = this;

      //验证表单
      this.$refs.form.validate(valid => {
        if (valid) {
          //保存
          InOutAPI.saveOutPut(this.form).then(function(result) {
            if (result.isOK) {
              //关闭对话框
              that.isShowForm = false;

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
    },
    //支出类型选择改变事件
    outTypeChange(outType) {
      this.form.amountAccountID = outType.amountAccountID;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
