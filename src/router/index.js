import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')

// import Home from '../components/Home'
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')

// import Welcome from '../components/Welcome'
const Welcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

/* import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles' */
const User = () =>
  import(/* webpackChunkName: "User_Rights_Roles" */ '../components/user/User.vue')
const Rights = () =>
  import(/* webpackChunkName: "User_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () =>
  import(/* webpackChunkName: "User_Rights_Roles" */ '../components/power/Roles.vue')

/* import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params' */
const Cate = () =>
  import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () =>
  import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

/* import Goods from '../components/goods/Goods'
import AddGoods from '../components/goods/AddGoods' */
const Goods = () =>
  import(/* webpackChunkName: "Goods_AddGoods" */ '../components/goods/Goods.vue')
const AddGoods = () =>
  import(/* webpackChunkName: "Goods_AddGoods" */ '../components/goods/AddGoods.vue')

/* import Order from '../components/order/Order'
import Report from '../components/report/Report' */
const Order = () =>
  import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () =>
  import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      component: Login
    },
    { path: '/', redirect: '/login' },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{ path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }]
    }
  ]
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
