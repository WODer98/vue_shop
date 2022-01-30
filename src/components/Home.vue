<template>
  <div>
    <el-button @click="logout" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      // 删除token
      window.sessionStorage.removeItem('token')
      //   跳转到登录页
      this.$router.replace('/login')
      this.$message.warning('用户已退出！')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
