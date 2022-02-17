import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器及其样式
import VueQuillEditor from 'vue-quill-editor'

// 导入进度条的js和css文件
import NProgress from 'nprogress'
import axios from 'axios'

// 导入全局样式表
import './assets/css/global.css'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)


new Vue({
  router,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  render: h => h(App)
}).$mount('#app')
