import React, { useEffect, useState } from 'react'
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image, Modal,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { hotelsApi } from '../api/hotels'
import type { Hotel, RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Search'>
type Route = RouteProp<RootStackParamList, 'Search'>

const SORT_OPTIONS = ['综合排序', '低价优先', '高星优先']
const STARS = [0, 3, 4, 5]

export default function SearchScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const [keyword, setKeyword] = useState(route.params?.keyword ?? '')
  const [star, setStar] = useState(route.params?.starRating ?? 0)
  const [sort, setSort] = useState(0)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const search = async () => {
    setLoading(true)
    try {
      const r = await hotelsApi.search({ keyword: keyword || undefined, starRating: star || undefined, pageSize: 20 })
      const data = r.data
      let list: Hotel[] = Array.isArray(data) ? data : data.hotels ?? data.data ?? []
      if (sort === 1) list = [...list].sort((a, b) => minPrice(a) - minPrice(b))
      if (sort === 2) list = [...list].sort((a, b) => b.starRating - a.starRating)
      setHotels(list)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search() }, [star, sort])

  const minPrice = (hotel: Hotel) =>
    hotel.rooms?.length ? Math.min(...hotel.rooms.map(r => Number(r.price))) : 99999

  const mainImage = (hotel: Hotel) =>
    hotel.images?.find(i => i.isMain)?.url ?? hotel.images?.[0]?.url

  const imgUrl = (url: string) =>
    url.startsWith('http') ? url : `http://192.168.1.28:3000${url}`

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchRow}>
        <View style={styles.inputWrap}>
          <Text style={{ fontSize: 14, marginRight: 6 }}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="搜索酒店"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={search}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={search}>
          <Text style={styles.btnText}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* 筛选栏 */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterItem} onPress={() => setShowFilter(true)}>
          <Text style={[styles.filterText, star > 0 && styles.filterActive]}>
            {star > 0 ? `${star}星` : '星级'} ▾
          </Text>
        </TouchableOpacity>
        {SORT_OPTIONS.map((s, i) => (
          <TouchableOpacity key={i} style={styles.filterItem} onPress={() => setSort(i)}>
            <Text style={[styles.filterText, sort === i && styles.filterActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 列表 */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1677ff" />
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={h => h.id}
          contentContainerStyle={{ padding: 12 }}
          ListEmptyComponent={<Text style={styles.empty}>暂无结果</Text>}
          renderItem={({ item: hotel }) => {
            const img = mainImage(hotel)
            const price = hotel.rooms?.length ? Math.min(...hotel.rooms.map(r => Number(r.price))) : null
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('HotelDetail', { id: hotel.id })}
              >
                {img ? (
                  <Image source={{ uri: imgUrl(img) }} style={styles.cardImg} />
                ) : (
                  <View style={[styles.cardImg, styles.noImg]}>
                    <Text style={{ color: '#bbb', fontSize: 12 }}>暂无图片</Text>
                  </View>
                )}
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{hotel.nameZh}</Text>
                  <Text style={styles.cardStar}>{'★'.repeat(hotel.starRating)}</Text>
                  <Text style={styles.cardAddr} numberOfLines={1}>{hotel.address}</Text>
                  <View style={styles.cardBottom}>
                    {price !== null ? (
                      <Text style={styles.cardPrice}>¥<Text style={styles.cardPriceNum}>{price}</Text><Text style={styles.cardPriceUnit}> 起/晚</Text></Text>
                    ) : <Text style={styles.cardNoPrice}>价格待定</Text>}
                    <View style={styles.bookBtn}><Text style={styles.bookBtnText}>订</Text></View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          }}
        />
      )}

      {/* 星级筛选弹窗 */}
      <Modal visible={showFilter} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilter(false)} />
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>选择星级</Text>
          <View style={styles.starRow}>
            {STARS.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.starChip, star === s && styles.starChipActive]}
                onPress={() => { setStar(s); setShowFilter(false) }}
              >
                <Text style={[styles.starChipText, star === s && styles.starChipTextActive]}>
                  {s === 0 ? '全部' : `${s}星`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#fff', elevation: 2 },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 10,
  },
  input: { flex: 1, paddingVertical: 8, fontSize: 14 },
  btn: { backgroundColor: '#1677ff', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
  filterBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  filterItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  filterText: { fontSize: 13, color: '#555' },
  filterActive: { color: '#1677ff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 60 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, marginBottom: 10,
    overflow: 'hidden', elevation: 2, flexDirection: 'row', height: 120,
  },
  cardImg: { width: 120, height: 120 },
  noImg: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#222' },
  cardStar: { fontSize: 12, color: '#f5a623' },
  cardAddr: { fontSize: 12, color: '#999' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: { fontSize: 12, color: '#ff5500' },
  cardPriceNum: { fontSize: 20, fontWeight: '700' },
  cardPriceUnit: { fontSize: 11 },
  cardNoPrice: { fontSize: 12, color: '#aaa' },
  bookBtn: { backgroundColor: '#1677ff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  bookBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16, color: '#222' },
  starRow: { flexDirection: 'row', gap: 12, paddingBottom: 20 },
  starChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  starChipActive: { backgroundColor: '#1677ff', borderColor: '#1677ff' },
  starChipText: { fontSize: 14, color: '#555' },
  starChipTextActive: { color: '#fff', fontWeight: '600' },
})
