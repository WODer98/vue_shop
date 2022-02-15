<template>
  <div>
    <!-- 编辑商品的对话框 -->
    <el-dialog
      title="修改商品"
      :visible.sync="visible"
      width="65%"
      @close="editDialogClosed"
      :before-close="editDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="editForm" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_name">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogClosed">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    editForm: { type: Object },
    getGoodsList: { type: Function }
  },
  methods: {
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    editGoods() {
      // console.log(this.editForm)
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return null
        // 可以发起修改商品的请求
        const { data: res } = await this.$http.put(
          'goods/' + this.editForm.goods_id,
          {
            goods_name: this.editForm.goods_name,
            goods_price: this.editForm.goods_price,
            goods_number: this.editForm.goods_number,
            goods_weight: this.editForm.goods_weight,
            goods_cat: this.editForm.goods_cat
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.$message.success('修改成功')
          this.$emit('update:visible', false)
          this.getGoodsList()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
