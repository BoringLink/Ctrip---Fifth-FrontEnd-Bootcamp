<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-row">
      <input v-model="keyword" placeholder="搜索酒店名称或地址" confirm-type="search" @confirm="goSearch" class="search-input" />
      <button class="search-btn" @click="goSearch">搜索</button>
    </view>

    <!-- 标签 -->
    <scroll-view scroll-x class="tag-row">
      <view class="tag-list">
        <view
          v-for="tag in tags" :key="tag.id"
          class="tag" @click="goSearchByTag(tag.id)"
        >{{ tag.name }}</view>
      </view>
    </scroll-view>

    <!-- 推荐酒店 -->
    <view class="section-title">推荐酒店</view>
    <view v-if="loading" class="loading">加载中...</view>
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

const BASE_URL = 'http://10.0.2.2:3000'
const baseUrl = BASE_URL
const keyword = ref('')
const tags = ref<any[]>([])
const hotels = ref<any[]>([])
const loading = ref(true)

const mainImage = (hotel: any) =>
  hotel.images?.find((i: any) => i.isMain)?.url ?? hotel.images?.[0]?.url ?? ''

onMounted(async () => {
  tags.value = await hotelsApi.getTags()
  const res = await hotelsApi.search({ pageSize: 10 })
  hotels.value = Array.isArray(res) ? res : res.data ?? []
  loading.value = false
})

const goSearch = () => uni.navigateTo({ url: `/pages/search/index?keyword=${keyword.value}` })
const goSearchByTag = (tagId: string) => uni.navigateTo({ url: `/pages/search/index?tagId=${tagId}` })
const goDetail = (id: string) => uni.navigateTo({ url: `/pages/hotel/index?id=${id}` })
</script>

<style>
.container { background: #f5f5f5; min-height: 100vh; padding-bottom: 20px; }
.search-row { display: flex; padding: 16px; gap: 8px; }
.search-input { flex: 1; background: #fff; border-radius: 8px; padding: 0 12px; height: 40px; font-size: 14px; border: 1px solid #e0e0e0; }
.search-btn { background: #1677ff; color: #fff; border-radius: 8px; padding: 0 16px; height: 40px; font-size: 14px; border: none; }
.tag-row { padding: 0 16px 8px; }
.tag-list { display: flex; flex-direction: row; }
.tag { background: #e6f0ff; color: #1677ff; border-radius: 16px; padding: 4px 14px; margin-right: 8px; font-size: 13px; white-space: nowrap; }
.section-title { font-size: 16px; font-weight: 700; padding: 8px 16px; }
.loading { text-align: center; padding: 40px; color: #aaa; }
.card { background: #fff; border-radius: 12px; margin: 0 16px 12px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.card-img { width: 100%; height: 180px; display: block; }
.no-img { background: #f0f0f0; display: flex; align-items: center; justify-content: center; }
.card-body { padding: 12px; }
.card-title { font-size: 16px; font-weight: 700; display: block; margin-bottom: 4px; }
.card-sub { font-size: 13px; color: #888; display: block; margin-bottom: 4px; }
.card-price { font-size: 15px; color: #ff5500; font-weight: 700; }
</style>
