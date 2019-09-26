<!-- 收入类型多选控件 -->
<template>
  <div>
    <el-select v-model="myValue" multiple collapse-tags placeholder="请选择收入类型" style="width:250px;">
      <el-option
        v-for="item in this.$store.getters.lstInType"
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
  //props: ["value"],
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
    if (this.$store.getters.lstInType.length == 0) {
      //查询收入类型列表
      BasAPI.queryInType().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Bas.SetInTypeList, result.lstInfo);
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
