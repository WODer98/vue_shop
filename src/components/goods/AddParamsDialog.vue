<template>
  <div>
    <!-- 添加分类的对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="visible"
      width="40%"
      @close="addDialogClosed"
      :before-close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="90px">
        <el-form-item
          :label="labelText"
          prop="attr_name"
          :rules="[
            { required: true, message: '请输入必填项', trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: '必填项在2~10个字符之间',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addForm: {}
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cateId: { type: Number },
    activeName: { type: String },
    getParamsData: { type: Function }
  },
  methods: {
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.$emit('update:visible', false) // 直接修改父组件的属性},
    },
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return null
        // 可以发起添加参数的网络请求
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.$emit('update:visible', false) // 直接修改父组件的属性
          this.getParamsData()
        }
      })
    }
  },
  computed: {
    titleText() {
      if (this.activeName === 'many') {
        return '添加动态参数'
      } else {
        return '添加静态属性'
      }
    },
    labelText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
