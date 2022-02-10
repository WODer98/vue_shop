<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图去 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <el-cascader
            clearable
            ref="refHandle"
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          label="动态参数"
          name="many"
          :disabled="this.selectedKeys.length === 0"
        >
          <el-button type="primary" size="mini" @click="showAddDialog"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag -->
                <el-tag
                  class="attrTag"
                  v-for="item in scope.row.attr_vals"
                  :key="item.attr_id"
                  closable
                  @close="handleClose(item, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeAttrById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
          :disabled="this.selectedKeys.length === 0"
          ><el-button type="primary" size="mini" @click="showAddDialog"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag -->
                <el-tag
                  class="attrTag"
                  v-for="item in scope.row.attr_vals"
                  :key="item.attr_id"
                  closable
                  @close="handleClose(item, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeAttrById(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table></el-tab-pane
        >
      </el-tabs>
    </el-card>
    <AddParamsDialog
      v-if="addDialogVisible"
      ref="addFormRef"
      :visible.sync="addDialogVisible"
      :cateId="cateId"
      :activeName="activeName"
      :getParamsData="getParamsData"
    ></AddParamsDialog>
    <EditParamsDialog
      v-if="editDialogVisible"
      ref="editFormRef"
      :visible.sync="editDialogVisible"
      :cateId="cateId"
      :activeName="activeName"
      :getParamsData="getParamsData"
      :editForm="editForm"
    ></EditParamsDialog>
  </div>
</template>

<script>
import AddParamsDialog from './AddParamsDialog'
import EditParamsDialog from './EditParamsDialog'
export default {
  components: { AddParamsDialog, EditParamsDialog },
  data() {
    return {
      cateList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      editForm: {},
      // 级联选择框双向绑定到的数组
      selectedKeys: [],
      // 动态参数渲染数据
      manyTabData: [],
      // 静态属性渲染数据
      onlyTabData: [],
      cascaderProps: {
        // 级联选择框的配置
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的页签名称
      activeName: 'many'
    }
  },
  watch: {
    handlerValue() {
      if (this.$refs.refHandle) {
        // 监听值发生变化就关闭它
        this.$refs.refHandle.dropDownVisible = false
      }
    }
  },
  computed: {
    cateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      } else {
        return null
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.cateList = res.data
        // console.log(this.cateList)
      }
    },
    // 获取params数据
    async getParamsData() {
      // 选中的分类不是3级分类
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.onlyTabData = []
        this.manyTabData = []
        return null
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框的内容
          item.inputValue = ''
        })
        // console.log(res.data)
        if (this.activeName === 'many') {
          this.manyTabData = res.data
        } else {
          this.onlyTabData = res.data
        }
      }
    },
    // 级联选择框发生变化会触发这个函数
    async handleChange() {
      this.getParamsData()
    },
    // tab页签点击事件
    handleTabClick() {
      this.getParamsData()
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    async showEditDialog(attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        { params: { attr_sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.editForm = res.data
        // console.log(this.editForm)
        this.editDialogVisible = true
      }
    },
    async removeAttrById(attrId) {
      // 弹框提示用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除参数，是否继续？',
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
        `categories/${this.cateId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
        this.getParamsData()
      }
    },
    async handleClose(item, row) {
      row.attr_vals.splice(item, 1)
      this.saveAttrValues(row)
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      row.inputVisible = true
      /* 让文本框自动获得焦点
        $nextTick()：当页面上的元素重新渲染之后，才会执行回调函数中的代码 */
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框按下了enter键或失去了焦点
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return null
      }
      // 如果没有return，则证明用户输入的内容需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      // 发起请求，保存操作
      this.saveAttrValues(row)
    },
    async saveAttrValues(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.$message.success(res.meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.attrTag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>
