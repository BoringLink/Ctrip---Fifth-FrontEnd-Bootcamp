import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { reservationsApi } from '../api/reservations'
import type { Reservation, RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Confirm'>
type Route = RouteProp<RootStackParamList, 'Confirm'>

const STATUS_LABEL: Record<string, string> = {
  confirmed: '已确认',
  check_in: '已入住',
  check_out: '已退房',
  cancelled: '已取消',
}

export default function ConfirmScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reservationsApi.getById(route.params.reservationId)
      .then(r => setReservation(r.data))
      .finally(() => setLoading(false))
  }, [route.params.reservationId])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />
  if (!reservation) return <Text style={{ margin: 20 }}>预订信息不存在</Text>

  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <Text style={styles.successText}>✓</Text>
      </View>
      <Text style={styles.title}>预订成功！</Text>

      <View style={styles.card}>
        <Row label="预订编号" value={reservation.id.slice(0, 8).toUpperCase()} />
        <Row label="酒店" value={reservation.hotel?.nameZh ?? '-'} />
        <Row label="房型" value={reservation.room?.name ?? '-'} />
        <Row label="入住日期" value={reservation.checkInDate.slice(0, 10)} />
        <Row label="离店日期" value={reservation.checkOutDate.slice(0, 10)} />
        <Row label="联系人" value={reservation.guestName} />
        <Row label="手机号" value={reservation.guestPhone} />
        <Row label="状态" value={STATUS_LABEL[reservation.status] ?? reservation.status} />
        <Row label="总价" value={`¥${reservation.totalPrice}`} highlight />
      </View>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeBtnText}>返回首页</Text>
      </TouchableOpacity>
    </View>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.highlight]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 24, alignItems: 'center' },
  successIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#52c41a', alignItems: 'center', justifyContent: 'center',
    marginTop: 32, marginBottom: 16,
  },
  successText: { color: '#fff', fontSize: 36, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    width: '100%', elevation: 2,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0',
  },
  rowLabel: { fontSize: 14, color: '#888' },
  rowValue: { fontSize: 14, color: '#333', fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  highlight: { color: '#f50', fontSize: 16, fontWeight: '700' },
  homeBtn: {
    marginTop: 24, backgroundColor: '#1677ff', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 48,
  },
  homeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
