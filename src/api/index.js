import request from './request'

// 认证
export const login = (data) => request.post('/auth/login', data)
export const register = (data) => request.post('/auth/register', data)
export const fetchMe = () => request.get('/auth/me')

// 团购活动
export const listActivities = (params) => request.get('/activities', { params })
export const getActivity = (id) => request.get(`/activities/${id}`)
export const createActivity = (data) => request.post('/activities', data)
export const updateActivity = (id, data) => request.put(`/activities/${id}`, data)
export const cancelActivity = (id) => request.delete(`/activities/${id}`)
export const joinActivity = (id) => request.post(`/activities/${id}/join`)
export const cancelJoin = (id) => request.post(`/activities/${id}/cancel`)
export const myJoins = () => request.get('/my/joins')

// 订单
export const myOrders = () => request.get('/orders/my')
export const getOrder = (id) => request.get(`/orders/${id}`)
export const payOrder = (id) => request.post(`/orders/${id}/pay`)
export const confirmOrder = (id) => request.post(`/orders/${id}/confirm`)

// 配送
export const deliveryAvailable = () => request.get('/delivery/tasks/available')
export const myDeliveryTasks = (status) => request.get('/delivery/tasks/my', { params: { status } })
export const acceptTask = (id) => request.post(`/delivery/tasks/${id}/accept`)
export const pickupTask = (id) => request.post(`/delivery/tasks/${id}/pickup`)
export const completeTask = (id) => request.post(`/delivery/tasks/${id}/complete`)
export const getRoute = () => request.get('/delivery/route')

// 管理端
export const adminStats = () => request.get('/admin/stats')
export const adminUsers = (params) => request.get('/admin/users', { params })
export const createUser = (data) => request.post('/admin/users', data)
export const updateUser = (id, data) => request.put(`/admin/users/${id}`, data)
export const disableUser = (id) => request.delete(`/admin/users/${id}`)
export const adminActivities = (params) => request.get('/admin/activities', { params })
export const adminOrders = (params) => request.get('/admin/orders', { params })
export const adminDeliveries = (params) => request.get('/admin/deliveries', { params })
export const assignDelivery = (id, deliveryUserId) =>
  request.post(`/admin/deliveries/${id}/assign`, null, { params: { deliveryUserId } })
