// 状态字典（中文展示与标签颜色）
export const roleText = { STUDENT: '学生', DELIVERY: '配送员', ADMIN: '管理员' }

export const activityStatusText = {
  RECRUITING: '拼单中',
  SUCCESS: '已成团',
  CANCELLED: '已取消',
  COMPLETED: '已完成'
}
export const activityStatusType = {
  RECRUITING: 'warning',
  SUCCESS: 'success',
  CANCELLED: 'info',
  COMPLETED: 'success'
}

export const orderStatusText = {
  WAIT_PAY: '待支付',
  PAID: '已支付',
  DELIVERING: '配送中',
  DELIVERED: '待确认收货',
  COMPLETED: '已完成',
  CANCELLED: '已取消'
}
export const orderStatusType = {
  WAIT_PAY: 'warning',
  PAID: 'primary',
  DELIVERING: 'warning',
  DELIVERED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger'
}

export const deliveryStatusText = {
  PENDING: '待接单',
  ACCEPTED: '已接单',
  PICKED_UP: '配送中',
  COMPLETED: '已送达',
  CANCELLED: '已取消'
}
export const deliveryStatusType = {
  PENDING: 'warning',
  ACCEPTED: 'primary',
  PICKED_UP: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger'
}

export const categoryOptions = ['零食', '水果', '日用品', '学习用品', '饮品', '数码配件']
