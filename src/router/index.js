import { createRouter, createWebHistory } from 'vue-router'
import Login from "../components/Login.vue"
import Home from "../components/Dashboard.vue"
import Setting from "../components/Setting.vue"
import Manage from "../components/Manage.vue"
import Recording from "../components/Recording.vue";
import ResetPassword from "../components/ResetPassword.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/setting',
      component: Setting
    },
    {
      path: '/recording',
      component: Recording
    },
    {
      path: '/manage',
      component: Manage
    },
    {
      path: '/dashboard',
      component: Home
    }

  ]
})

// router.beforeEach((to, from, next) => {
//   const user = JSON.parse(localStorage.getItem('loginResult'))
//   if (!user && to.path !== '/login') {
//     next('/login')
//   }
//   else {
//     next()
//   }
// })
export default router
