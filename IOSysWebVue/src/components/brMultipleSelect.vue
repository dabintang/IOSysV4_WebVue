<!-- 借还类型多选控件 -->
<template>
  <div>
    <el-select v-model="myValue" multiple collapse-tags placeholder="请选择借还类型" style="width:200px;">
      <el-option
        v-for="item in this.$store.getters.lstBorrowRepayType"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
import BasAPI from "@/api/basicAPI";
import Util from "@/utils/util";

export default {
  data() {
    return {
      myValue: []
    };
  },
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
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
  watch: {
    //判断下拉框的值是否有改变
    myValue(val, oldVal) {
      if (Util.Fun.equalsArray(val, oldVal) == false) {
        this.$emit("input", this.myValue);
      }
    }
  },
  methods: {
  }
};
</script>
