import React, { useEffect, useState } from 'react'
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ScrollView, Image, ActivityIndicator,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { hotelsApi } from '../api/hotels'
import type { Hotel, HotelTag, RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>

export default function HomeScreen() {
  const navigation = useNavigation<Nav>()
  const [keyword, setKeyword] = useState('')
  const [tags, setTags] = useState<HotelTag[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hotelsApi.getTags().then(r => setTags(r.data))
    hotelsApi.search({ pageSize: 10 }).then(r => {
      const data = r.data
      setHotels(Array.isArray(data) ? data : data.hotels ?? data.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const mainImage = (hotel: Hotel) =>
    hotel.images?.find(i => i.isMain)?.url ?? hotel.images?.[0]?.url

  return (
    <ScrollView style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="搜索酒店名称或地址"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={() => navigation.navigate('Search', { keyword })}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate('Search', { keyword })}
        >
          <Text style={styles.searchBtnText}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* 标签 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagRow}>
        {tags.map(tag => (
          <TouchableOpacity
            key={tag.id}
            style={styles.tag}
            onPress={() => navigation.navigate('Search', { tagId: tag.id })}
          >
            <Text style={styles.tagText}>{tag.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 推荐酒店 */}
      <Text style={styles.sectionTitle}>推荐酒店</Text>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        hotels.map(hotel => {
          const img = mainImage(hotel)
          return (
            <TouchableOpacity
              key={hotel.id}
              style={styles.card}
              onPress={() => navigation.navigate('HotelDetail', { id: hotel.id })}
            >
              {img ? (
                <Image source={{ uri: `http://10.0.2.2:3000${img}` }} style={styles.cardImg} />
              ) : (
                <View style={[styles.cardImg, styles.noImg]}>
                  <Text style={{ color: '#aaa' }}>暂无图片</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{hotel.nameZh}</Text>
                <Text style={styles.cardSub}>{'★'.repeat(hotel.starRating)} {hotel.address}</Text>
                {hotel.rooms?.[0] && (
                  <Text style={styles.cardPrice}>¥{hotel.rooms[0].price} 起/晚</Text>
                )}
              </View>
            </TouchableOpacity>
          )
        })
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchRow: { flexDirection: 'row', margin: 16, gap: 8 },
  input: {
    flex: 1, backgroundColor: '#fff', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14,
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  searchBtn: {
    backgroundColor: '#1677ff', borderRadius: 8,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  tagRow: { paddingHorizontal: 16, marginBottom: 8 },
  tag: {
    backgroundColor: '#e6f0ff', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 6, marginRight: 8,
  },
  tagText: { color: '#1677ff', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16,
    marginBottom: 12, overflow: 'hidden', elevation: 2,
  },
  cardImg: { width: '100%', height: 180 },
  noImg: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardPrice: { fontSize: 15, color: '#f50', fontWeight: '700' },
})
