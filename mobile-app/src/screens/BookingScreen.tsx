import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, Platform,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RouteProp } from '@react-navigation/native'
import { reservationsApi } from '../api/reservations'
import type { RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Booking'>
type Route = RouteProp<RootStackParamList, 'Booking'>

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function fmt(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function BookingScreen() {
  const navigation = useNavigation<Nav>()
  const route = useRoute<Route>()
  const { hotelId, roomId, roomName, price } = route.params

  const today = new Date()
  const [checkIn, setCheckIn] = useState(fmt(today))
  const [checkOut, setCheckOut] = useState(fmt(addDays(today, 1)))
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
  )
  const total = price * nights

  const submit = async () => {
    if (!name || !phone || !email) {
      Alert.alert('提示', '请填写完整联系人信息')
      return
    }
    setLoading(true)
    try {
      const r = await reservationsApi.create({
        hotelId, roomId,
        checkInDate: new Date(checkIn).toISOString(),
        checkOutDate: new Date(checkOut).toISOString(),
        guestName: name, guestPhone: phone, guestEmail: email,
        totalPrice: total,
      })
      navigation.replace('Confirm', { reservationId: r.data.id })
    } catch (e: any) {
      Alert.alert('预订失败', e.response?.data?.message ?? '请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.card}>
        <Text style={styles.roomName}>{roomName}</Text>
        <Text style={styles.price}>¥{price} / 晚</Text>
      </View>

      <Text style={styles.label}>入住日期</Text>
      <TextInput
        style={styles.input}
        value={checkIn}
        onChangeText={setCheckIn}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>离店日期</Text>
      <TextInput
        style={styles.input}
        value={checkOut}
        onChangeText={setCheckOut}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>联系人姓名</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="请输入姓名" />

      <Text style={styles.label}>手机号</Text>
      <TextInput
        style={styles.input} value={phone} onChangeText={setPhone}
        placeholder="请输入手机号" keyboardType="phone-pad"
      />

      <Text style={styles.label}>邮箱</Text>
      <TextInput
        style={styles.input} value={email} onChangeText={setEmail}
        placeholder="请输入邮箱" keyboardType="email-address" autoCapitalize="none"
      />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{nights} 晚合计</Text>
        <Text style={styles.totalPrice}>¥{total}</Text>
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? '提交中...' : '确认预订'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 16, elevation: 1,
  },
  roomName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  price: { fontSize: 14, color: '#f50' },
  label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: '#e0e0e0',
  },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 20, marginBottom: 16,
    backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 1,
  },
  totalLabel: { fontSize: 15, color: '#555' },
  totalPrice: { fontSize: 22, fontWeight: '700', color: '#f50' },
  submitBtn: {
    backgroundColor: '#1677ff', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
