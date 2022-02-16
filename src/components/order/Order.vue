<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getOrderList"
            @keyup.enter.native="getOrderList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="95px"
        ></el-table-column>
        <el-table-column label="是否付款" width="95px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          prop="create_time"
          width="140px"
        ></el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-tooltip
              effect="dark"
              content="修改地址"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showAddressDialog()"
              ></el-button
            ></el-tooltip>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProcessDialog()"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <AddressDialog
      v-if="addressVisible"
      ref="addressFormRef"
      :visible.sync="addressVisible"
      :addressForm="addressForm"
    ></AddressDialog>
    <ProcessInfo
      v-if="processVisible"
      :visible.sync="processVisible"
      :processInfo="processInfo"
    ></ProcessInfo>
  </div>
</template>

<script>
import AddressDialog from './AddressDialog'
import ProcessInfo from './ProcessInfo'
export default {
  components: { AddressDialog, ProcessInfo },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressForm: { address1: [], address2: '' },
      addressVisible: false,
      processVisible: false,
      processInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 监听pageSize改变的事件
    handleSizeChange(newPageSize) {
      // console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    async getOrderList() {
      const moment = require('moment')
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.total = res.data.total
        this.orderList = res.data.goods
        this.orderList.forEach((order) => {
          order.create_time = moment(order.create_time).format(
            'YYYY-MM-DD HH:mm:SS'
          )
        })
      }
    },
    showAddressDialog() {
      this.addressVisible = true
    },
    async showProcessDialog() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error(res.status.msg)
      } else {
        this.processInfo = res.data
        this.processVisible = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
