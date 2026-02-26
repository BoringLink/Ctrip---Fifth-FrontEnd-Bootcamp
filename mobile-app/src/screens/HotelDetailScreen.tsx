import React, { useEffect, useState } from 'react'
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Dimensions,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { hotelsApi } from '../api/hotels'
import type { Hotel, RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'HotelDetail'>
type Route = RouteProp<RootStackParamList, 'HotelDetail'>

const { width } = Dimensions.get('window')

export default function HotelDetailScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hotelsApi.getById(route.params.id)
      .then(r => setHotel(r.data))
      .finally(() => setLoading(false))
  }, [route.params.id])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />
  if (!hotel) return <Text style={{ margin: 20 }}>酒店不存在</Text>

  return (
    <ScrollView style={styles.container}>
      {/* 图片轮播（简单横向滚动） */}
      {hotel.images?.length > 0 && (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {hotel.images.map(img => (
            <Image
              key={img.id}
              source={{ uri: `http://10.0.2.2:3000${img.url}` }}
              style={{ width, height: 220 }}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.body}>
        <Text style={styles.title}>{hotel.nameZh}</Text>
        <Text style={styles.sub}>{'★'.repeat(hotel.starRating)}  {hotel.address}</Text>
        {hotel.description ? <Text style={styles.desc}>{hotel.description}</Text> : null}

        {/* 设施 */}
        {hotel.facilities?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>酒店设施</Text>
            <View style={styles.tagWrap}>
              {hotel.facilities.map(f => (
                <View key={f.id} style={styles.chip}>
                  <Text style={styles.chipText}>{f.name}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* 标签 */}
        {hotel.tags?.length > 0 && (
          <View style={styles.tagWrap}>
            {hotel.tags.map(t => (
              <View key={t.tag.id} style={[styles.chip, styles.tagChip]}>
                <Text style={[styles.chipText, { color: '#1677ff' }]}>{t.tag.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 房型 */}
        <Text style={styles.sectionTitle}>选择房型</Text>
        {hotel.rooms?.map(room => (
          <View key={room.id} style={styles.roomCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomInfo}>容纳 {room.capacity} 人 · 剩余 {room.quantity} 间</Text>
              {room.description ? <Text style={styles.roomDesc}>{room.description}</Text> : null}
            </View>
            <View style={styles.roomRight}>
              <Text style={styles.roomPrice}>¥{room.price}</Text>
              <Text style={styles.roomPriceSub}>/晚</Text>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('Booking', {
                  hotelId: hotel.id,
                  roomId: room.id,
                  roomName: room.name,
                  price: Number(room.price),
                })}
              >
                <Text style={styles.bookBtnText}>预订</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  body: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
  sub: { fontSize: 14, color: '#888', marginBottom: 8 },
  desc: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 10 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    backgroundColor: '#f0f0f0', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  tagChip: { backgroundColor: '#e6f0ff' },
  chipText: { fontSize: 13, color: '#555' },
  roomCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, flexDirection: 'row', elevation: 1,
  },
  roomName: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  roomInfo: { fontSize: 13, color: '#888', marginBottom: 2 },
  roomDesc: { fontSize: 13, color: '#aaa' },
  roomRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  roomPrice: { fontSize: 20, fontWeight: '700', color: '#f50' },
  roomPriceSub: { fontSize: 12, color: '#aaa', marginTop: -4 },
  bookBtn: {
    backgroundColor: '#1677ff', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8, marginTop: 8,
  },
  bookBtnText: { color: '#fff', fontWeight: '600' },
})
