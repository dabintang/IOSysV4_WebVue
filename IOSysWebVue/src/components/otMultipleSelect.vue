<!-- 支出类型多选控件 -->
<!-- 账户多选控件 -->
<template>
  <div>
    <el-select v-model="myValue" multiple collapse-tags placeholder="请选择支出类型" style="width:250px;">
      <el-option-group
        v-for="outCategory in this.$store.getters.lstOutCategoryType"
        :key="outCategory.id"
        :label="outCategory.name"
      >
        <el-option
          v-for="outType in outCategory.lstOutType"
          :key="outType.id"
          :label="outType.name"
          :value="outType.id"
        ></el-option>
      </el-option-group>
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
  mounted() {
    if (Util.Fun.equalsArray(this.myValue, this.value) == false) {
      this.myValue = this.value;
    }
  },
  watch: {
    //判断下拉框的值是否有改变
    myValue(val, oldVal) {
      if (Util.Fun.equalsArray(val, oldVal) == false) {
        this.$emit("input", this.myValue);
      }
    },
    value(val, oldVal) {
      if (Util.Fun.equalsArray(val, oldVal) == false) {
        this.myValue = this.value;
      }
    }
  }
};
</script>
