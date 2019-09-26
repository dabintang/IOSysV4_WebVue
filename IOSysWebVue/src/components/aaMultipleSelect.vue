<!-- 账户多选控件 -->
<template>
  <div>
    <el-select v-model="myValue" multiple collapse-tags placeholder="请选择账户" style="width:250px;">
      <el-option
        v-for="item in this.$store.getters.lstAmountAccount"
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
  // props: ["value"],
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
    if (this.$store.getters.lstAmountAccount.length == 0) {
      //查询账户列表
      BasAPI.queryAmountAccount().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(
            CST.Store.Bas.SetAmountAccountList,
            result.lstInfo
          );
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
