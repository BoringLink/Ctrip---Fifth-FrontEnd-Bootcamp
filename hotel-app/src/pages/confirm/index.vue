<template>
  <view class="container">
    <view v-if="loading" class="loading">加载中...</view>
    <template v-else-if="reservation">
      <view class="success-icon">✓</view>
      <text class="title">预订成功！</text>

      <view class="card">
        <view class="row"><text class="row-label">预订编号</text><text class="row-value">{{ reservation.id.slice(0,8).toUpperCase() }}</text></view>
        <view class="row"><text class="row-label">酒店</text><text class="row-value">{{ reservation.hotel?.nameZh ?? '-' }}</text></view>
        <view class="row"><text class="row-label">房型</text><text class="row-value">{{ reservation.room?.name ?? '-' }}</text></view>
        <view class="row"><text class="row-label">入住日期</text><text class="row-value">{{ reservation.checkInDate.slice(0,10) }}</text></view>
        <view class="row"><text class="row-label">离店日期</text><text class="row-value">{{ reservation.checkOutDate.slice(0,10) }}</text></view>
        <view class="row"><text class="row-label">联系人</text><text class="row-value">{{ reservation.guestName }}</text></view>
        <view class="row"><text class="row-label">手机号</text><text class="row-value">{{ reservation.guestPhone }}</text></view>
        <view class="row"><text class="row-label">状态</text><text class="row-value">{{ statusLabel[reservation.status] ?? reservation.status }}</text></view>
        <view class="row"><text class="row-label">总价</text><text class="row-value highlight">¥{{ reservation.totalPrice }}</text></view>
      </view>

      <button class="home-btn" @click="goHome">返回首页</button>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reservationsApi } from '@/api/index'

const reservation = ref<any>(null)
const loading = ref(true)
const statusLabel: Record<string, string> = {
  confirmed: '已确认', check_in: '已入住', check_out: '已退房', cancelled: '已取消',
}

onMounted(async () => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const id = (page.$page?.options ?? page.options ?? {}).id
  if (id) reservation.value = await reservationsApi.getById(id)
  loading.value = false
})

const goHome = () => uni.reLaunch({ url: '/pages/home/index' })
</script>

<style>
.container { background: #f5f5f5; min-height: 100vh; padding: 24px 16px; display: flex; flex-direction: column; align-items: center; }
.loading { text-align: center; padding: 40px; color: #aaa; }
.success-icon { width: 72px; height: 72px; border-radius: 36px; background: #52c41a; color: #fff; font-size: 36px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 32px; margin-bottom: 16px; }
.title { font-size: 22px; font-weight: 700; margin-bottom: 24px; }
.card { background: #fff; border-radius: 12px; padding: 16px; width: 100%; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
.row:last-child { border-bottom: none; }
.row-label { font-size: 14px; color: #888; }
.row-value { font-size: 14px; color: #333; font-weight: 500; max-width: 60%; text-align: right; }
.highlight { color: #ff5500; font-size: 16px; font-weight: 700; }
.home-btn { background: #1677ff; color: #fff; border-radius: 12px; height: 50px; font-size: 16px; font-weight: 700; border: none; margin-top: 24px; padding: 0 48px; }
</style>
