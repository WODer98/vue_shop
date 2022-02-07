<template>
  <div>
    <el-dialog
      title="分配权限"
      :visible.sync="visible"
      width="50%"
      @close="setRightDialogClosed"
      :before-close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        show-checkbox
        :props="treeProps"
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogClosed">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
    rightsList: { type: Array },
    defKeys: { type: Array },
    roleId: { type: Number },
    getRolesList: { type: Function }
  },
  data() {
    return {
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  methods: {
    setRightDialogClosed() {
      this.setDialogDefKeys = []
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    // 分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.$emit('update:visible', false) // 直接修改父组件的属性
      }
    }
  }
}
</script>

<style>
</style>
