<!-- 支出类型选择控件 -->
<template>
  <div>
    <el-cascader :options="options" v-model="myValue" @change="change" placeholder="请选择支出类型">
    </el-cascader>
  </div>
</template>

<script>
import BasAPI from '@/api/basicAPI';

export default {
  data() {
    return {
      myValue: [], //选择值
      options: [] //下拉内容
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

          //生成下拉内容
          that.createOptions();
        }
      });
    }
  },
  mounted() {
    //生成下拉内容
    this.createOptions();

    //初始赋值
    let outCategory = this.findOutCategory(this.value);
    if (outCategory) {
      this.myValue = [outCategory.id, this.value];
    } else {
      this.myValue = [];
    }
  },
  watch: {
    //判断下拉框的值是否有改变
    myValue(val, oldVal) {
      if (this.myValue) {
        this.$emit('input', this.myValue[1]);
      }
    },
    value(val, oldVal) {
      if (val != oldVal) {
        let outCategory = this.findOutCategory(this.value);
        if (outCategory) {
          this.myValue = [outCategory.id, this.value];
        } else {
          this.myValue = [];
        }
      }
    }
  },
  methods: {
    //生成下拉内容
    createOptions() {
      this.options = [];

      //遍历支出分类
      this.$store.getters.lstOutCategoryType.forEach(outCategory => {
        let parent = {
          value: outCategory.id,
          label: outCategory.name,
          disabled: !outCategory.isActive,
          children: []
        };
        this.options.push(parent);

        //遍历支出类型
        outCategory.lstOutType.forEach(outType => {
          let child = {
            value: outType.id,
            label: outType.name,
            disabled: !outType.isActive
          };
          parent.children.push(child);
        });
      });
    },
    //选择内容改变
    change(val) {
      if (val) {
        //通过ID查找对应的收入类型实例
        let item = this.findOutType(val[1]);

        //抛出选择改变事件
        this.$emit('change', item);
      }
    },
    //通过支出类型ID查找对应的支出类型实例
    findOutType(outTypeID) {
      if (!outTypeID || !this.$store.getters.lstOutCategoryType) {
        return null;
      }

      let findItem = null;
      for (let i = 0; i < this.$store.getters.lstOutCategoryType.length; i++) {
        let outCategory = this.$store.getters.lstOutCategoryType[i];
        for (let j = 0; j < outCategory.lstOutType.length; j++) {
          let outType = outCategory.lstOutType[j];
          if (outType.id == outTypeID) {
            findItem = outType;
            break;
          }
        }

        if (findItem != null) {
          break;
        }
      }

      return findItem;
    },
    findOutCategory(outTypeID) {
      if (!outTypeID || !this.$store.getters.lstOutCategoryType) {
        return null;
      }

      let findItem = null;
      for (let i = 0; i < this.$store.getters.lstOutCategoryType.length; i++) {
        let outCategory = this.$store.getters.lstOutCategoryType[i];
        for (let j = 0; j < outCategory.lstOutType.length; j++) {
          let outType = outCategory.lstOutType[j];
          if (outType.id == outTypeID) {
            findItem = outCategory;
            break;
          }
        }

        if (findItem != null) {
          break;
        }
      }

      return findItem;
    }
  }
};
</script>
