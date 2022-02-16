<template>
  <div>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="visible" width="50%">
      <!-- 内容主体区域 -->
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        @close="addressDialogClosed"
        :before-close="addressDialogClosed"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
        <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
          </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input
        ></el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addressDialogClosed">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    addressForm: { type: Object }
  },
  methods: {
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>>
