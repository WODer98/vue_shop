<template>
  <div>
    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="visible"
      width="30%"
      @close="editDialogClosed"
      :before-close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item
          label="角色名"
          prop="roleName"
          :rules="[
            { required: true, message: '请输入角色名', trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: '角色名在3~10个字符之间',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'editRoleDialog',
  data() {
    return {
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editForm: { type: Object },
    getRolesList: { type: Function }
  },
  methods: {
    // 监听用户修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    // 点击修改确定按钮
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return null
        // 可以发起修改角色的网络请求
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.$emit('update:visible', false) // 直接修改父组件的属性
          this.getRolesList()
        }
      })
    }
  }
}
</script>

<style>
</style>
