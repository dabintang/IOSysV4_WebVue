<!-- 账户选择控件 -->
<template>
  <div>
    <el-select v-model="myValue" placeholder="请选择账户">
      <el-option v-for="item in this.$store.getters.lstAmountAccount" :key="item.id" :label="item.name" :value="item.id" :disabled="!item.isActive">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import BasAPI from '@/api/basicAPI';

export default {
  data() {
    return {
      myValue: ''
    };
  },
  props: ['value'],
  beforeCreate() {
    let that = this;
    if (this.$store.getters.lstAmountAccount.length == 0) {
      //查询账户列表
      BasAPI.queryAmountAccount().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Bas.SetAmountAccountList, result.lstInfo);
        }
      });
    }
  },
  mounted() {
    if (this.myValue != this.value) {
      this.myValue = this.value;
    }
  },
  watch: {
    //判断下拉框的值是否有改变
    myValue(val, oldVal) {
      if (val != oldVal) {
        this.$emit('input', this.myValue);
      }
    },
    value(val, oldVal) {
      if (val != oldVal) {
        this.myValue = this.value;
      }
    }
  }
};
</script>
