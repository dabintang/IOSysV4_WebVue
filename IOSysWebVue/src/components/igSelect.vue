<!-- 收入统计方式选择控件 -->
<template>
  <div>
    <el-select v-model="myValue" placeholder="请选择收入统计方式">
      <el-option v-for="item in this.$store.getters.lstInGroupType" :key="item.id" :label="item.name" :value="item.id">
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
    if (this.$store.getters.lstInGroupType.length == 0) {
      //获取收入统计方式
      BasAPI.queryInGroupType().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Bas.SetInGroupTypeList, result.lstInfo);
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
      if (!id || !this.$store.getters.lstInGroupType) {
        return null;
      }

      let findItem = null;
      for (let i = 0; i < this.$store.getters.lstInGroupType.length; i++) {
        let item = this.$store.getters.lstInGroupType[i];
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
