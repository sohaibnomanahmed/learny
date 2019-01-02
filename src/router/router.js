import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'signin',
      component: () => import('../views/Signin')
    },
    {
      path: '/chat/:id',
      name: 'chat',
      props: true,
      component: () => import('../views/User/Chat/Chat'),
      beforeEnter: AuthGuard
    },
    {
      path: '/chatlist/',
      name: 'chatlist',
      component: () => import('../views/User/Chat/ChatList'),
      beforeEnter: AuthGuard
    },
    {
      path: '/profile/:id',
      name: 'profile',
      props: true,
      component: () => import('../views/User/Profile'),
      beforeEnter: AuthGuard
    },
    {
      path: '/mentors',
      name: 'mentors',
      component: () => import('../views/User/Mentors'),
      beforeEnter: AuthGuard
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('../views/User/Requests'),
      beforeEnter: AuthGuard
    }
  ]
})
