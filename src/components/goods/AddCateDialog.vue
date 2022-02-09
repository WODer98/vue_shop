<template>
  <div>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="visible"
      width="40%"
      @close="addDialogClosed"
      :before-close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="90px">
        <el-form-item
          label="分类名称:"
          prop="cat_name"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: '分类名在2~10个字符之间',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            clearable
            ref="refHandle"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddCateDialog',
  data() {
    return {
      // 添加分类的表单数据
      addForm: {
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级
        cat_level: 0
      },
      parentCateList: [],
      cascaderProps: {
        checkStrictly: true,
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //   选中的父级分类id数组
      selectedKeys: []
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    getCateList: {
      type: Function
    }
  },
  created() {
    this.getParentCateList()
  },
  mounted() {
    setInterval(function () {
      document.querySelectorAll('.el-cascader-node__label').forEach((el) => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click()
        }
      })
    }, 1000)
  },
  watch: {
    handlerValue() {
      if (this.$refs.refHandle) {
        // 监听值发生变化就关闭它
        this.$refs.refHandle.dropDownVisible = false
      }
    }
  },
  methods: {
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.parentCateList = res.data
        // console.log(this.parentCateList)
      }
    },
    // 监听用户添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.$emit('update:visible', false) // 直接修改父组件的属性
      this.selectedKeys = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 选择项发生变化触发
    handleChange() {
      //   console.log(this.selectedKeys)
      /* 如果selectedKeys数组中的length大于0,证明选中的父级分类
      反之,就说明没有选中任何分类 */
      if (this.selectedKeys.length > 0) {
        //   父级分类的id
        this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addForm.cat_level = this.selectedKeys.length
        return null
      } else {
        //   父级分类的id
        this.addForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addForm.cat_level = 0
      }
    },
    addCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return null
        // 可以发起添加分类请求
        // console.log(this.addForm)
        const { data: res } = await this.$http.post('categories', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.getCateList()
          this.addForm.cat_pid = 0
          this.addForm.cat_level = 0
          this.$refs.addFormRef.resetFields()
          this.$emit('update:visible', false) // 直接修改父组件的属性
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
