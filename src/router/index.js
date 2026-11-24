import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/home',
    children: [
      { path: 'home', name: 'Home', component: () => import('@/views/Home.vue') },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('@/views/student/ActivityList.vue'),
        meta: { roles: ['STUDENT', 'ADMIN'] }
      },
      {
        path: 'my-orders',
        name: 'MyOrders',
        component: () => import('@/views/student/MyOrders.vue'),
        meta: { roles: ['STUDENT'] }
      },
      {
        path: 'pay/:orderId',
        name: 'Pay',
        component: () => import('@/views/student/Pay.vue'),
        meta: { roles: ['STUDENT'] }
      },
      {
        path: 'delivery',
        name: 'Delivery',
        component: () => import('@/views/delivery/DeliveryTasks.vue'),
        meta: { roles: ['DELIVERY'] }
      },
      {
        path: 'delivery-map',
        name: 'DeliveryMap',
        component: () => import('@/views/delivery/DeliveryMap.vue'),
        meta: { roles: ['DELIVERY'] }
      },
      {
        path: 'admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { roles: ['ADMIN'] }
      },
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue'),
        meta: { roles: ['ADMIN'] }
      },
      {
        path: 'admin/activities',
        name: 'AdminActivities',
        component: () => import('@/views/admin/Activities.vue'),
        meta: { roles: ['ADMIN'] }
      },
      {
        path: 'admin/orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Orders.vue'),
        meta: { roles: ['ADMIN'] }
      },
      {
        path: 'admin/deliveries',
        name: 'AdminDeliveries',
        component: () => import('@/views/admin/Deliveries.vue'),
        meta: { roles: ['ADMIN'] }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  const store = useUserStore()
  if (to.path === '/login') {
    return store.token ? '/home' : true
  }
  if (!store.token) {
    return '/login'
  }
  if (to.meta?.roles && !to.meta.roles.includes(store.user?.role)) {
    return '/home'
  }
  return true
})

export default router
