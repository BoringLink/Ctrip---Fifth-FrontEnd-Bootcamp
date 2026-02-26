<template>
  <view class="container">
    <view class="search-row">
      <input v-model="keyword" placeholder="搜索酒店" confirm-type="search" @confirm="search" class="search-input" />
      <button class="search-btn" @click="search">搜索</button>
    </view>

    <!-- 星级筛选 -->
    <view class="filter-row">
      <view
        v-for="s in [0,3,4,5]" :key="s"
        :class="['filter-chip', star === s && 'active']"
        @click="setStar(s)"
      >{{ s === 0 ? '全部' : s + '星' }}</view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
    <view v-else-if="hotels.length === 0" class="empty">暂无结果</view>
    <view v-for="hotel in hotels" :key="hotel.id" class="card" @click="goDetail(hotel.id)">
      <image
        v-if="mainImage(hotel)"
        :src="baseUrl + mainImage(hotel)"
        class="card-img" mode="aspectFill"
      />
      <view v-else class="card-img no-img"><text>暂无图片</text></view>
      <view class="card-body">
        <text class="card-title">{{ hotel.nameZh }}</text>
        <text class="card-sub">{{ '★'.repeat(hotel.starRating) }} {{ hotel.address }}</text>
        <text v-if="hotel.rooms?.[0]" class="card-price">¥{{ hotel.rooms[0].price }} 起/晚</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hotelsApi } from '@/api/index'

const baseUrl = 'http://10.0.2.2:3000'
const keyword = ref('')
const star = ref(0)
const hotels = ref<any[]>([])
const loading = ref(false)

const mainImage = (hotel: any) =>
  hotel.images?.find((i: any) => i.isMain)?.url ?? hotel.images?.[0]?.url ?? ''

const search = async () => {
  loading.value = true
  const res = await hotelsApi.search({
    keyword: keyword.value || undefined,
    starRating: star.value || undefined,
    pageSize: 20,
  })
  hotels.value = Array.isArray(res) ? res : res.data ?? []
  loading.value = false
}

const setStar = (s: number) => { star.value = s; search() }
const goDetail = (id: string) => uni.navigateTo({ url: `/pages/hotel/index?id=${id}` })

onMounted(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1] as any
  const options = page.$page?.options ?? page.options ?? {}
  if (options.keyword) keyword.value = options.keyword
  search()
})
</script>

<style>
.container { background: #f5f5f5; min-height: 100vh; padding-bottom: 20px; }
.search-row { display: flex; padding: 16px; gap: 8px; }
.search-input { flex: 1; background: #fff; border-radius: 8px; padding: 0 12px; height: 40px; font-size: 14px; border: 1px solid #e0e0e0; }
.search-btn { background: #1677ff; color: #fff; border-radius: 8px; padding: 0 16px; height: 40px; font-size: 14px; border: none; }
.filter-row { display: flex; padding: 0 16px 8px; gap: 8px; }
.filter-chip { background: #fff; border: 1px solid #e0e0e0; border-radius: 16px; padding: 4px 14px; font-size: 13px; color: #555; }
.filter-chip.active { background: #1677ff; border-color: #1677ff; color: #fff; }
.loading, .empty { text-align: center; padding: 40px; color: #aaa; }
.card { background: #fff; border-radius: 12px; margin: 0 16px 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.card-img { width: 100%; height: 160px; display: block; }
.no-img { background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
.card-body { padding: 12px; }
.card-title { font-size: 16px; font-weight: 700; display: block; margin-bottom: 4px; }
.card-sub { font-size: 13px; color: #888; display: block; margin-bottom: 4px; }
.card-price { font-size: 15px; color: #ff5500; font-weight: 700; }
</style>
