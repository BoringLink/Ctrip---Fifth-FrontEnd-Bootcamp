import React, { useEffect, useState } from 'react'
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { hotelsApi } from '../api/hotels'
import type { Hotel, RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Search'>
type Route = RouteProp<RootStackParamList, 'Search'>

const STARS = [0, 3, 4, 5]

export default function SearchScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const [keyword, setKeyword] = useState(route.params?.keyword ?? '')
  const [star, setStar] = useState(0)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    setLoading(true)
    try {
      const r = await hotelsApi.search({
        keyword: keyword || undefined,
        starRating: star || undefined,
        pageSize: 20,
      })
      const data = r.data
      setHotels(Array.isArray(data) ? data : data.hotels ?? data.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search() }, [star])

  const mainImage = (hotel: Hotel) =>
    hotel.images?.find(i => i.isMain)?.url ?? hotel.images?.[0]?.url

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="搜索酒店"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={search}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.btn} onPress={search}>
          <Text style={styles.btnText}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* 星级筛选 */}
      <View style={styles.filterRow}>
        {STARS.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.filterChip, star === s && styles.filterChipActive]}
            onPress={() => setStar(s)}
          >
            <Text style={[styles.filterText, star === s && styles.filterTextActive]}>
              {s === 0 ? '全部' : `${s}星`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={h => h.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>暂无结果</Text>}
          renderItem={({ item: hotel }) => {
            const img = mainImage(hotel)
            return (
              <TouchableOpacity
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
          }}
        />
      )}
    </View>
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
  btn: {
    backgroundColor: '#1677ff', borderRadius: 8,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  filterChip: {
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0',
  },
  filterChipActive: { backgroundColor: '#1677ff', borderColor: '#1677ff' },
  filterText: { fontSize: 13, color: '#555' },
  filterTextActive: { color: '#fff' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60 },
  card: {
    backgroundColor: '#fff', borderRadius: 12,
    marginBottom: 12, overflow: 'hidden', elevation: 2,
  },
  cardImg: { width: '100%', height: 160 },
  noImg: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSub: { fontSize: 13, color: '#888', marginBottom: 4 },
  cardPrice: { fontSize: 15, color: '#f50', fontWeight: '700' },
})
