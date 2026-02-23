<template>
  <view class="container">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="!hotel" class="empty">酒店不存在</view>
    <template v-else>
      <!-- 图片轮播 -->
      <swiper v-if="hotel.images?.length" class="swiper" indicator-dots>
        <swiper-item v-for="img in hotel.images" :key="img.id">
          <image :src="baseUrl + img.url" class="swiper-img" mode="aspectFill" />
        </swiper-item>
      </swiper>

      <view class="body">
        <text class="title">{{ hotel.nameZh }}</text>
        <text class="sub">{{ '★'.repeat(hotel.starRating) }}  {{ hotel.address }}</text>
        <text v-if="hotel.description" class="desc">{{ hotel.description }}</text>

        <!-- 设施 -->
        <template v-if="hotel.facilities?.length">
          <text class="section-title">酒店设施</text>
          <view class="chip-row">
            <view v-for="f in hotel.facilities" :key="f.id" class="chip">{{ f.name }}</view>
          </view>
        </template>

        <!-- 标签 -->
        <view v-if="hotel.tags?.length" class="chip-row" style="margin-top:8px">
          <view v-for="t in hotel.tags" :key="t.tag.id" class="chip tag-chip">{{ t.tag.name }}</view>
        </view>

        <!-- 房型 -->
        <text class="section-title">选择房型</text>
        <view v-for="room in hotel.rooms" :key="room.id" class="room-card">
          <view class="room-left">
            <text class="room-name">{{ room.name }}</text>
            <text class="room-info">容纳 {{ room.capacity }} 人 · 剩余 {{ room.quantity }} 间</text>
            <text v-if="room.description" class="room-desc">{{ room.description }}</text>
          </view>
          <view class="room-right">
            <text class="room-price">¥{{ room.price }}</text>
            <text class="room-price-sub">/晚</text>
            <button class="book-btn" @click="goBook(room)">预订</button>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hotelsApi } from '@/api/index'

const baseUrl = 'http://10.0.2.2:3000'
const hotel = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const id = (page.$page?.options ?? page.options ?? {}).id
  if (id) {
    hotel.value = await hotelsApi.getById(id)
  }
  loading.value = false
})

const goBook = (room: any) => {
  uni.navigateTo({
    url: `/pages/booking/index?hotelId=${hotel.value.id}&roomId=${room.id}&roomName=${encodeURIComponent(room.name)}&price=${room.price}`
  })
}
</script>

<style>
.container { background: #f5f5f5; min-height: 100vh; padding-bottom: 20px; }
.loading, .empty { text-align: center; padding: 40px; color: #aaa; }
.swiper { width: 100%; height: 220px; }
.swiper-img { width: 100%; height: 220px; }
.body { padding: 16px; }
.title { font-size: 20px; font-weight: 700; display: block; margin-bottom: 6px; }
.sub { font-size: 14px; color: #888; display: block; margin-bottom: 8px; }
.desc { font-size: 14px; color: #555; line-height: 22px; display: block; margin-bottom: 12px; }
.section-title { font-size: 16px; font-weight: 700; display: block; margin: 16px 0 10px; }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
.chip { background: #f0f0f0; border-radius: 6px; padding: 4px 10px; font-size: 13px; color: #555; }
.tag-chip { background: #e6f0ff; color: #1677ff; }
.room-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 10px; display: flex; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.room-left { flex: 1; }
.room-name { font-size: 15px; font-weight: 700; display: block; margin-bottom: 4px; }
.room-info { font-size: 13px; color: #888; display: block; margin-bottom: 2px; }
.room-desc { font-size: 13px; color: #aaa; display: block; }
.room-right { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; }
.room-price { font-size: 20px; font-weight: 700; color: #ff5500; }
.room-price-sub { font-size: 12px; color: #aaa; }
.book-btn { background: #1677ff; color: #fff; border-radius: 8px; padding: 6px 16px; font-size: 14px; border: none; margin-top: 8px; }
</style>
