<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col :span="4"
          ><el-button type="primary" @click="showAddDialog"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 通过for循环 嵌套渲染三级权限 -->
                    <el-col>
                      <el-tag
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        type="warning"
                        closable
                        @close="removeRightById(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <AddRoleDialog
      v-if="addDialogVisible"
      :visible.sync="addDialogVisible"
      ref="addFormRef"
      :getRolesList="getRolesList"
    ></AddRoleDialog>
    <EditRoleDialog
      v-if="editDialogVisible"
      :visible.sync="editDialogVisible"
      ref="addFormRef"
      :editForm="editForm"
      :getRolesList="getRolesList"
    ></EditRoleDialog>
    <SetRightDialog
      v-if="setRightDialogVisible"
      :visible.sync="setRightDialogVisible"
      :rightsList="rightsList"
      :defKeys="defKeys"
      :roleId="roleId"
      :getRolesList="getRolesList"
    ></SetRightDialog>
  </div>
</template>

<script>
import AddRoleDialog from './AddRoleDialog'
import EditRoleDialog from './EditRoleDialog'
import SetRightDialog from './SetRightDialog'
export default {
  components: { AddRoleDialog, EditRoleDialog, SetRightDialog },
  data() {
    return {
      rolesList: [],
      rightsList: [],
      // 默认选中的id值
      defKeys: [],
      editForm: {},
      addDialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      roleId: ''
    }
  },
  created() {
    //   获取所有角色
    this.getRolesList()
  },
  methods: {
    //   获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      // console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.rolesList = res.data
        this.total = res.data.length
        // console.log(this.rolesList)
      }
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    modalClose() {
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.editForm = res.data
        this.editDialogVisible = true
      }
    },
    // 根据id删除角色
    async removeRoleById(id) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除用户，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getRolesList()
      }
    },
    // 根据id删除对应权限
    async removeRightById(role, rightId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久取消该权限，是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        // this.getRolesList()
        role.children = res.data
      }
    },
    // 获取所有权限列表(树形)
    async getRightsOfTree() {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        return res.data
      }
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys中
    getLeafNodeKeys(node, arr) {
      // 如果当前节点不包含children属性，则是三级结点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getLeafNodeKeys(item, arr))
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.defKeys = []
      this.roleId = role.id
      // 把获取到的权限数据保存到data中
      this.rightsList = await this.getRightsOfTree()
      /* console.log(this.rightsList)
      递归获取三级节点 */
      this.getLeafNodeKeys(role, this.defKeys)
      // 获取所有权限的数据
      this.setRightDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
