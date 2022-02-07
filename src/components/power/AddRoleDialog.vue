<template>
  <div>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="visible"
      width="30%"
      @close="addDialogClosed"
      :before-close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
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
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddRoleDialog',
  data() {
    return {
      // 添加用户的表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    getRolesList: { type: Function }
  },
  methods: {
    // 监听用户添加对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    // 点击添加角色
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return null
        // 可以发起添加角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
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
