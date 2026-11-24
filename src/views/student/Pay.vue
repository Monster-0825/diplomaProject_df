<template>
  <div class="pay-wrap">
    <el-card class="pay-card" shadow="never">
      <div class="pay-head">
        <div class="page-title grad-text">订单支付</div>
      </div>

      <div v-if="order" class="pay-body">
        <div class="amount">¥{{ order.amount }}</div>
        <div class="order-no">订单号：{{ order.orderNo }}</div>
        <div class="activity">商品：{{ order.activityTitle || '-' }}</div>

        <!-- 支付二维码 -->
        <div class="qr-box">
          <img src="/payImg.jpg" class="qr-img" alt="支付二维码" />
          <div class="qr-tip">请使用微信 / 支付宝扫码支付</div>
        </div>

        <!-- 支付倒计时 -->
        <div class="countdown" v-if="remaining > 0">
          请在 <span class="cd-num">{{ mm }}:{{ ss }}</span> 内完成支付，超时订单将保持待支付状态
        </div>

        <div class="actions">
          <el-button type="primary" class="btn" :loading="paying" @click="onPaid">已完成支付</el-button>
          <el-button class="btn" @click="onCancel">取消支付</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getOrder, payOrder } from '@/api'

const route = useRoute()
const router = useRouter()

const orderId = Number(route.params.orderId)
const order = ref(null)
const paying = ref(false)
const remaining = ref(15 * 60) // 15 分钟支付倒计时
let timer = null

const mm = computed(() => String(Math.floor(remaining.value / 60)).padStart(2, '0'))
const ss = computed(() => String(remaining.value % 60).padStart(2, '0'))

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/my-orders')
  }
}

onMounted(async () => {
  order.value = await getOrder(orderId)
  // 非待支付状态（已支付 / 已取消等）直接提示返回，不改动数据
  if (order.value.status !== 'WAIT_PAY') {
    ElMessage.warning('该订单无需支付')
    goBack()
    return
  }
  timer = setInterval(() => {
    if (remaining.value > 0) {
      remaining.value--
    } else {
      clearInterval(timer)
      ElMessage.warning('支付超时，订单仍为待支付状态')
      goBack()
    }
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// 已完成支付：走原支付逻辑（订单待支付 -> 已支付，并生成配送任务），成功后返回上一页
async function onPaid() {
  paying.value = true
  try {
    await payOrder(orderId)
    ElMessage.success('支付成功，已生成配送任务')
    goBack()
  } finally {
    paying.value = false
  }
}

// 取消支付：直接返回上一页，数据保持不变
function onCancel() {
  ElMessage.info('已取消支付')
  goBack()
}
</script>

<style scoped>
.pay-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: 20px 0;
}
.pay-card {
  width: 440px;
  text-align: center;
  padding: 6px 12px 18px;
}
.pay-head {
  text-align: left;
}

.amount {
  font-size: 42px;
  font-weight: 800;
  margin: 8px 0 6px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #0891b2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.order-no,
.activity {
  color: #64748b;
  font-size: 13px;
  margin-top: 6px;
}

/* 二维码区域 */
.qr-box {
  margin: 20px auto 0;
  width: 230px;
  padding: 10px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid rgba(99, 102, 241, 0.22);
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.14);
}
.qr-img {
  width: 100%;
  height: 210px;
  object-fit: contain;
  border-radius: 8px;
  display: block;
}
.qr-tip {
  color: #64748b;
  font-size: 12.5px;
  margin-top: 8px;
}

.countdown {
  margin-top: 14px;
  color: #64748b;
  font-size: 13px;
}
.cd-num {
  color: #e11d48;
  font-weight: 700;
  font-size: 16px;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 14px;
  justify-content: center;
}
.btn {
  min-width: 150px;
}
</style>
