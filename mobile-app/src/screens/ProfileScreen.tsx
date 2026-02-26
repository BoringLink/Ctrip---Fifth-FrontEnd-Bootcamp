import React, { useEffect, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, Image,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuth } from '../context/AuthContext'
import http from '../api/http'
import type { Reservation, RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList>

const STATUS_LABEL: Record<string, string> = {
  confirmed: '已确认',
  check_in: '已入住',
  check_out: '已退房',
  cancelled: '已取消',
}
const STATUS_COLOR: Record<string, string> = {
  confirmed: '#1677ff',
  check_in: '#52c41a',
  check_out: '#999',
  cancelled: '#ff4d4f',
}

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>()
  const { user, logout } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    http.get('/api/reservations/my').then(r => {
      const data = r.data
      setReservations(Array.isArray(data) ? data : data.reservations ?? [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出吗？', [
      { text: '取消', style: 'cancel' },
      { text: '退出', style: 'destructive', onPress: async () => { await logout() } },
    ])
  }

  if (!user) {
    return (
      <View style={s.center}>
        <Text style={s.guestIcon}>👤</Text>
        <Text style={s.guestTitle}>未登录</Text>
        <Text style={s.guestSub}>登录后可查看预订记录</Text>
        <TouchableOpacity style={s.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={s.loginBtnText}>去登录</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={s.container}>
      {/* 用户信息卡 */}
      <View style={s.userCard}>
        <View style={s.avatar}><Text style={s.avatarText}>{user.name[0]?.toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.userName}>{user.name}</Text>
          <Text style={s.userEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutText}>退出</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.sectionTitle}>我的预订</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1677ff" />
      ) : reservations.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>暂无预订记录</Text>
        </View>
      ) : (
        reservations.map(r => (
          <TouchableOpacity key={r.id} style={s.card} onPress={() => navigation.navigate('Confirm', { reservationId: r.id })}>
            <View style={s.cardTop}>
              <Text style={s.hotelName} numberOfLines={1}>{r.hotel?.nameZh}</Text>
              <View style={[s.badge, { backgroundColor: STATUS_COLOR[r.status] + '20' }]}>
                <Text style={[s.badgeText, { color: STATUS_COLOR[r.status] }]}>{STATUS_LABEL[r.status]}</Text>
              </View>
            </View>
            <Text style={s.roomName}>{r.room?.name}</Text>
            <Text style={s.dates}>{r.checkInDate?.slice(0, 10)} → {r.checkOutDate?.slice(0, 10)}</Text>
            <Text style={s.price}>¥{r.totalPrice}</Text>
          </TouchableOpacity>
        ))
      )}
      <View style={{ height: 30 }} />
    </ScrollView>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' },
  guestIcon: { fontSize: 60, marginBottom: 12 },
  guestTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
  guestSub: { fontSize: 14, color: '#999', marginTop: 6, marginBottom: 24 },
  loginBtn: { backgroundColor: '#1677ff', borderRadius: 10, paddingHorizontal: 40, paddingVertical: 12 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  userCard: { backgroundColor: '#1677ff', padding: 20, flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  userName: { fontSize: 17, fontWeight: '700', color: '#fff' },
  userEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  logoutText: { color: '#fff', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', margin: 16, marginBottom: 8, color: '#222' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#bbb', fontSize: 15 },
  card: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginBottom: 10, padding: 14, elevation: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  hotelName: { fontSize: 15, fontWeight: '700', color: '#222', flex: 1, marginRight: 8 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  roomName: { fontSize: 13, color: '#666', marginBottom: 4 },
  dates: { fontSize: 13, color: '#999', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '700', color: '#ff5500' },
})
