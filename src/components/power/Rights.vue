<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 角色列表区域 -->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-if="scope.row.level === '1'"
              >二级权限</el-tag
            >
            <el-tag type="warning" v-if="scope.row.level === '2'"
              >三级权限</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagenum"
        :page-sizes="[10, 20, 25, 30]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: [],
      pagenum: 1,
      // 当前每页显示多少条数据
      pagesize: 10,
      total: 0
    }
  },
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表(数组类型)
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res.data.length)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.rightsList = res.data
        this.total = res.data.length
      }
    },
    // 监听pageSize改变的事件
    handleSizeChange(newPageSize) {
      // console.log(newPageSize)
      this.pagesize = newPageSize
      this.getRightsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.pagenum = newPage
      this.getRightsList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
