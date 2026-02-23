<template>
  <view class="container">
    <view class="card">
      <text class="room-name">{{ roomName }}</text>
      <text class="price">¥{{ price }} / 晚</text>
    </view>

    <view class="form">
      <text class="label">入住日期</text>
      <picker mode="date" :value="checkIn" :start="today" @change="e => checkIn = e.detail.value">
        <view class="picker-row">
          <text>{{ checkIn }}</text>
          <text class="arrow">›</text>
        </view>
      </picker>

      <text class="label">离店日期</text>
      <picker mode="date" :value="checkOut" :start="checkIn" @change="e => checkOut = e.detail.value">
        <view class="picker-row">
          <text>{{ checkOut }}</text>
          <text class="arrow">›</text>
        </view>
      </picker>

      <text class="label">联系人姓名</text>
      <input v-model="guestName" placeholder="请输入姓名" class="input" />

      <text class="label">手机号</text>
      <input v-model="guestPhone" placeholder="请输入手机号" type="number" class="input" />

      <text class="label">邮箱</text>
      <input v-model="guestEmail" placeholder="请输入邮箱" class="input" />
    </view>

    <view class="total-row">
      <text class="total-label">{{ nights }} 晚合计</text>
      <text class="total-price">¥{{ total }}</text>
    </view>

    <button class="submit-btn" :loading="loading" @click="submit">确认预订</button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { reservationsApi } from '@/api/index'

const hotelId = ref('')
const roomId = ref('')
const roomName = ref('')
const price = ref(0)

const today = new Date().toISOString().slice(0, 10)
const checkIn = ref(today)
const checkOut = ref(new Date(Date.now() + 86400000).toISOString().slice(0, 10))
const guestName = ref('')
const guestPhone = ref('')
const guestEmail = ref('')
const loading = ref(false)

const nights = computed(() =>
  Math.max(1, Math.round((new Date(checkOut.value).getTime() - new Date(checkIn.value).getTime()) / 86400000))
)
const total = computed(() => price.value * nights.value)

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const opts = page.$page?.options ?? page.options ?? {}
  hotelId.value = opts.hotelId ?? ''
  roomId.value = opts.roomId ?? ''
  roomName.value = decodeURIComponent(opts.roomName ?? '')
  price.value = Number(opts.price ?? 0)
})

const submit = async () => {
  if (!guestName.value || !guestPhone.value || !guestEmail.value) {
    uni.showToast({ title: '请填写完整联系人信息', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const res = await reservationsApi.create({
      hotelId: hotelId.value,
      roomId: roomId.value,
      checkInDate: new Date(checkIn.value).toISOString(),
      checkOutDate: new Date(checkOut.value).toISOString(),
      guestName: guestName.value,
      guestPhone: guestPhone.value,
      guestEmail: guestEmail.value,
      totalPrice: total.value,
    })
    uni.redirectTo({ url: `/pages/confirm/index?id=${res.id}` })
  } catch (e: any) {
    uni.showToast({ title: e?.data?.message ?? '预订失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style>
.container { background: #f5f5f5; min-height: 100vh; padding: 16px 16px 40px; }
.card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.room-name { font-size: 16px; font-weight: 700; display: block; margin-bottom: 4px; }
.price { font-size: 14px; color: #ff5500; }
.form { background: #fff; border-radius: 12px; padding: 16px; }
.label { font-size: 14px; color: #555; display: block; margin-top: 12px; margin-bottom: 6px; }
.input { background: #f5f5f5; border-radius: 8px; padding: 10px 12px; font-size: 14px; border: 1px solid #e0e0e0; }
.picker-row { background: #f5f5f5; border-radius: 8px; padding: 10px 12px; border: 1px solid #e0e0e0; display: flex; justify-content: space-between; }
.arrow { color: #aaa; }
.total-row { display: flex; justify-content: space-between; align-items: center; background: #fff; border-radius: 12px; padding: 16px; margin-top: 16px; }
.total-label { font-size: 15px; color: #555; }
.total-price { font-size: 22px; font-weight: 700; color: #ff5500; }
.submit-btn { background: #1677ff; color: #fff; border-radius: 12px; height: 50px; font-size: 16px; font-weight: 700; border: none; margin-top: 16px; }
</style>
