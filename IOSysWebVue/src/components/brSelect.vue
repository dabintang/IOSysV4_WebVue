<!-- 借还类型选择控件 -->
<template>
  <div>
    <el-select v-model="myValue" placeholder="请选择借还类型">
      <el-option v-for="item in this.$store.getters.lstBorrowRepayType" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import BasAPI from "@/api/basicAPI";

export default {
  data() {
    return {
      myValue: ""
    };
  },
  props: ["value"],
  beforeCreate() {
    let that = this;
    if (this.$store.getters.lstBorrowRepayType.length == 0) {
      //获取借还类型列表
      BasAPI.queryBorrowRepayType().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Bas.SetBorrowRepayTypeList, result.lstInfo);
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
        this.$emit("input", this.myValue);
      }
    },
    value(val, oldVal) {
      if (val != oldVal) {
        this.myValue = this.value;
      }
    }
  },
  methods: {
  }
};
</script>
