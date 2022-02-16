<template>
  <div>
    <el-dialog
      title="物流信息"
      :visible.sync="visible"
      width="50%"
      :before-close="handleClose"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in processInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
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
    processInfo: {
      type: Array
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style <style lang="less" scoped>
</style>>
