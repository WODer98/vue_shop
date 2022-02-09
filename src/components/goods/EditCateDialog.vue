<template>
  <div>
    <!-- 修改菜单的对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="visible"
      width="30%"
      @close="editDialogClosed"
      :before-close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item
          label="分类名称"
          prop="cat_name"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            {
              min: 2,
              max: 10,
              message: '分类名称在2~10个字符之间',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EditCateDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editForm: { type: Object },
    getCateList: { type: Function }
  },
  methods: {
    // 监听分类修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    editCate() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return null
        // 发起修改分类的请求
        const { data: res } = await this.$http.put(
          'categories/' + this.editForm.cat_id,
          { cat_name: this.editForm.cat_name }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.$emit('update:visible', false) // 直接修改父组件的属性
          this.getCateList()
        }
      })
    }
  }
}
</script>

<style>
</style>
