<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="rank" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag type="success" v-if="scope.row.cat_level === 1" size="mini"
            >二级</el-tag
          >
          <el-tag type="warning" v-if="scope.row.cat_level === 2" size="mini"
            >三级</el-tag
          >
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
            ><i class="el-icon-edit">编辑</i></el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="deleteCateById(scope.row.cat_id)"
            ><i class="el-icon-delete">删除</i></el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <AddCateDialog
      v-if="addDialogVisible"
      :visible.sync="addDialogVisible"
      :getCateList="getCateList"
      ref="addFormRef"
    ></AddCateDialog>
    <EditCateDialog
      v-if="editDialogVisible"
      :visible.sync="editDialogVisible"
      :editForm="editForm"
      :getCateList="getCateList"
      ref="addFormRef"
    ></EditCateDialog>
  </div>
</template>

<script>
import AddCateDialog from './AddCateDialog'
import EditCateDialog from './EditCateDialog'
export default {
  components: { AddCateDialog, EditCateDialog },
  data() {
    return {
      //   商品分类的数据列表，默认为空
      cateList: [],
      //   查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      editForm: {},
      //   总数据条数
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      //   为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //   表示将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          //   表示将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用模板名称
          template: 'rank'
        },
        {
          label: '操作',
          //   表示将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用模板名称
          template: 'operation'
        }
      ]
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        // console.log(res.data.result)
        this.cateList = res.data.result
        this.total = res.data.total
      }
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.editForm = res.data
        this.editDialogVisible = true
      }
    },
    // 根据id删除分类
    async deleteCateById(id) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除分类，是否继续？',
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getCateList()
      }
    },
    // 监听pageSize改变的事件
    handleSizeChange(newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getCateList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getCateList()
    }
  },
  created() {
    this.getCateList()
  }
}
</script>

<style lang="less" scoped>
</style>
