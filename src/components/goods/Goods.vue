<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAddGoosPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          width="95px"
          prop="goods_price"
          label="商品价格(元)"
        ></el-table-column>
        <el-table-column
          width="70px"
          prop="goods_weight"
          label="商品重量"
        ></el-table-column>
        <el-table-column
          width="140px"
          prop="add_time"
          label="创建时间"
        ></el-table-column>
        <el-table-column width="130px" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <EditGoodsDialog
      v-if="editDialogVisible"
      ref="editFormRef"
      :visible.sync="editDialogVisible"
      :editForm="editForm"
      :getGoodsList="getGoodsList"
    ></EditGoodsDialog>
  </div>
</template>

<script>
import EditGoodsDialog from './EditGoodsDialog'
export default {
  components: { EditGoodsDialog },
  data() {
    return {
      queryInfo: {
        //   查询参数
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      total: 0,
      goodsList: [],
      editForm: { goods_cat: [] },
      editDialogVisible: false
    }
  },
  methods: {
    // 监听pageSize改变的事件
    handleSizeChange(newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getGoodsList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async deleteById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getGoodsList()
      }
    },
    //   获取商品列表
    async getGoodsList() {
      const moment = require('moment')
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.goodsList = res.data.goods
        this.total = res.data.total
        this.goodsList.forEach((good) => {
          good.add_time = moment(good.add_time).format('YYYY-MM-DD HH:mm:ss')
        })
      }
    },
    toAddGoosPage() {
      this.$router.push('goods/add')
    },
    async showEditDialog(goodsId) {
      const { data: res } = await this.$http.get('goods/' + goodsId)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.editForm = res.data
        this.editDialogVisible = true
      }
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>
</style>
