<!-- 支出统计方式选择控件 -->
<template>
  <div>
    <el-select v-model="myValue" placeholder="请选择支出统计方式">
      <el-option v-for="item in this.$store.getters.lstOutGroupType" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import BasAPI from "@/api/basicAPI";

export default {
  data() {
    return {
      myValue: 0
    };
  },
  props: ["value"],
  beforeCreate() {
    let that = this;
    if (this.$store.getters.lstOutGroupType.length == 0) {
      //获取支出统计方式
      BasAPI.queryOutGroupType().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Bas.SetOutGroupTypeList, result.lstInfo);
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
    //通过ID查找对应的收入类型实例
    findItem(id) {
      if (id == null || id == 'undefined' || !this.$store.getters.lstOutGroupType) {
        return null;
      }

      let findItem = null;
      for (let i = 0; i < this.$store.getters.lstOutGroupType.length; i++) {
        let item = this.$store.getters.lstOutGroupType[i];
        if (item.id == id) {
          findItem = item;
          break;
        }
      }

      return findItem;
    }
  }
};
</script>
