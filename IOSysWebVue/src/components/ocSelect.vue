<!-- 支出分类选择控件 -->
<template>
  <div>
    <el-select v-model="myValue" placeholder="请选择支出分类">
      <el-option v-for="item in this.$store.getters.lstOutCategoryType" :key="item.id" :label="item.name" :value="item.id" :disabled="!item.isActive">
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
    if (this.$store.getters.lstOutCategoryType.length == 0) {
      //查询支出分类类型列表
      BasAPI.queryOutCategoryType().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Bas.SetOutCategoryTypeList, result.lstInfo);
        }
      });
    }
  },
  mounted(){
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
