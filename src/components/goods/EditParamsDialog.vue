<template>
  <div>
    <!-- 修改分类的对话框 -->
    <el-dialog
      :title="titleText"
      :visible.sync="visible"
      width="40%"
      @close="editDialogClosed"
      :before-close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" ref="addFormRef" label-width="90px">
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
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    cateId: { type: Number },
    editForm: { type: Object },
    activeName: { type: String },
    getParamsData: { type: Function }
  },
  methods: {
    editDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.$emit('update:visible', false) // 直接修改父组件的属性},
    },
    editParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return null
        // 可以发起修改参数的网络请求
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
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
        return '修改动态参数'
      } else {
        return '修改静态属性'
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
