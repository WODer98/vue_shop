<template>
  <div>
    <el-dialog
      title="分配角色"
      :visible.sync="visible"
      width="50%"
      @close="setRoleDialogClosed"
      :before-close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogClosed">取 消</el-button>
        <el-button type="primary" @click="saveSetRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userInfo: { type: Object },
    rolesList: { type: Array },
    getUserList: { type: Function }
  },
  data() {
    return {
      selectedRoleId: ''
    }
  },
  methods: {
    //   点击按钮分配角色
    async saveSetRole() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择需要分配的角色！')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        { rid: this.selectedRoleId }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getUserList()
        this.$emit('update:visible', false) // 直接修改父组件的属性
      }
    },
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.$emit('update:visible', false) // 直接修改父组件的属性
    }
  }
}
</script>

<style>
</style>
