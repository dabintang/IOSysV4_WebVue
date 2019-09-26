<!-- 收入类型选择控件 -->
<template>
  <div>
    <el-select v-model="myValue" placeholder="请选择收入类型" @change="change" :disabled="disabled">
      <el-option v-for="item in this.$store.getters.lstInType" :key="item.id" :label="item.name" :value="item.id" :disabled="!item.isActive">
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
  props: ["value", "disabled"],
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
    //选择内容改变
    change(val) {
      //通过ID查找对应的收入类型实例
      let item = this.findItem(val);

      //抛出选择改变事件
      this.$emit("change", item);
    },
    //通过ID查找对应的收入类型实例
    findItem(id) {
      if (!id || !this.$store.getters.lstInType) {
        return null;
      }

      let findItem = null;
      for (let i = 0; i < this.$store.getters.lstInType.length; i++) {
        let item = this.$store.getters.lstInType[i];
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
