import React, { useEffect, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator, ScrollView, Modal, Alert,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { hotelsApi } from '../api/hotels'
import type { Hotel, RootStackParamList } from '../types'

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>

function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate()+n); return r }
function formatDate(d: Date) { return `${d.getMonth()+1}月${d.getDate()}日` }
function dayLabel(d: Date) {
  const today = new Date(); today.setHours(0,0,0,0)
  const t = new Date(d); t.setHours(0,0,0,0)
  const diff = Math.round((t.getTime()-today.getTime())/86400000)
  if(diff===0) return '今天'
  if(diff===1) return '明天'
  if(diff===2) return '后天'
  return ['日','一','二','三','四','五','六'][d.getDay()]
}
function diffDays(a: Date, b: Date) {
  return Math.round((b.getTime()-a.getTime())/86400000)
}

// 生成日历天数（当月+下月共42天）
function buildCalendar(base: Date) {
  const year = base.getFullYear(), month = base.getMonth()
  const first = new Date(year, month, 1)
  const days: (Date|null)[] = []
  for(let i=0;i<first.getDay();i++) days.push(null)
  const total = new Date(year, month+1, 0).getDate()
  for(let i=1;i<=total;i++) days.push(new Date(year, month, i))
  return days
}

function DatePicker({ checkIn, checkOut, onSelect, onClose }: {
  checkIn: Date, checkOut: Date,
  onSelect: (ci: Date, co: Date) => void,
  onClose: () => void
}) {
  const today = new Date(); today.setHours(0,0,0,0)
  const [selecting, setSelecting] = useState<'in'|'out'>('in')
  const [ci, setCi] = useState(checkIn)
  const [co, setCo] = useState(checkOut)
  const [calMonth, setCalMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const days = buildCalendar(calMonth)
  const WEEK = ['日','一','二','三','四','五','六']

  const onDay = (d: Date) => {
    if(d < today) return
    if(selecting === 'in') {
      setCi(d)
      setCo(addDays(d,1))
      setSelecting('out')
    } else {
      if(d <= ci) { setCi(d); setCo(addDays(d,1)); return }
      setCo(d)
      onSelect(ci, d)
      onClose()
    }
  }

  const isBetween = (d: Date) => d > ci && d < co
  const isCI = (d: Date) => d.toDateString()===ci.toDateString()
  const isCO = (d: Date) => d.toDateString()===co.toDateString()

  return (
    <View style={dp.sheet}>
      <View style={dp.header}>
        <Text style={dp.title}>{selecting==='in'?'选择入住日期':'选择离店日期'}</Text>
        <TouchableOpacity onPress={onClose}><Text style={dp.close}>✕</Text></TouchableOpacity>
      </View>
      <View style={dp.monthNav}>
        <TouchableOpacity onPress={()=>setCalMonth(m=>new Date(m.getFullYear(),m.getMonth()-1,1))}>
          <Text style={dp.navBtn}>‹</Text>
        </TouchableOpacity>
        <Text style={dp.monthLabel}>{calMonth.getFullYear()}年{calMonth.getMonth()+1}月</Text>
        <TouchableOpacity onPress={()=>setCalMonth(m=>new Date(m.getFullYear(),m.getMonth()+1,1))}>
          <Text style={dp.navBtn}>›</Text>
        </TouchableOpacity>
      </View>
      <View style={dp.weekRow}>
        {WEEK.map(w=><Text key={w} style={dp.weekDay}>{w}</Text>)}
      </View>
      <View style={dp.grid}>
        {days.map((d,i)=>{
          if(!d) return <View key={i} style={dp.cell}/>
          const past = d < today
          const ci_ = isCI(d), co_ = isCO(d), between = isBetween(d)
          return (
            <TouchableOpacity key={i} style={[dp.cell, between&&dp.between, (ci_||co_)&&dp.selected]} onPress={()=>onDay(d)} disabled={past}>
              <Text style={[dp.dayText, past&&dp.pastText, (ci_||co_)&&dp.selectedText]}>{d.getDate()}</Text>
              {ci_&&<Text style={dp.label}>入住</Text>}
              {co_&&<Text style={dp.label}>离店</Text>}
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={dp.footer}>
        <Text style={dp.footerText}>{formatDate(ci)} 入住 → {formatDate(co)} 离店，共 {diffDays(ci,co)} 晚</Text>
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>()
  const [keyword, setKeyword] = useState('')
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [showCal, setShowCal] = useState(false)

  const today = new Date(); today.setHours(0,0,0,0)
  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(addDays(today,1))

  useEffect(() => {
    hotelsApi.search({ pageSize: 10 }).then(r => {
      const data = r.data
      const list = Array.isArray(data) ? data : data.hotels ?? data.data ?? []
      setHotels(list)
    }).catch(e => {
      Alert.alert('加载失败', e?.message || '网络错误')
    }).finally(() => setLoading(false))
  }, [])

  const imgUrl = (url: string) =>
    url.startsWith('http') ? url : `http://192.168.1.28:3000${url}`
  const minPrice = (hotel: Hotel) =>
    hotel.rooms?.length ? Math.min(...hotel.rooms.map(r => Number(r.price))) : null
  const mainImage = (hotel: Hotel) =>
    hotel.images?.find(i => i.isMain)?.url ?? hotel.images?.[0]?.url

  return (
    <ScrollView style={styles.container} stickyHeaderIndices={[0]}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索酒店名称或地址"
            placeholderTextColor="#aaa"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={() => navigation.navigate('Search', { keyword })}
            returnKeyType="search"
          />
        </View>

        {/* 可点击日期行 */}
        <TouchableOpacity style={styles.dateRow} onPress={() => setShowCal(true)}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateMain}>{formatDate(checkIn)}</Text>
            <Text style={styles.dateSub}>{dayLabel(checkIn)} 入住</Text>
          </View>
          <View style={styles.nightBadge}>
            <Text style={styles.nightText}>{diffDays(checkIn,checkOut)}晚</Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateMain}>{formatDate(checkOut)}</Text>
            <Text style={styles.dateSub}>{dayLabel(checkOut)} 离店</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchBtn} onPress={() => navigation.navigate('Search', { keyword })}>
          <Text style={styles.searchBtnText}>搜索酒店</Text>
        </TouchableOpacity>

        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Search', {})}>
            <Text style={styles.quickIcon}>🗺️</Text>
            <Text style={styles.quickLabel}>地图找房</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Search', { starRating: 5 })}>
            <Text style={styles.quickIcon}>🔍</Text>
            <Text style={styles.quickLabel}>筛选酒店</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>为你推荐</Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#1677ff" />
      ) : (
        hotels.map(hotel => {
          const img = mainImage(hotel)
          const price = minPrice(hotel)
          return (
            <TouchableOpacity key={hotel.id} style={styles.card} onPress={() => navigation.navigate('HotelDetail', { id: hotel.id })}>
              {img ? (
                <Image source={{ uri: imgUrl(img) }} style={styles.cardImg} />
              ) : (
                <View style={[styles.cardImg, styles.noImg]}><Text style={{ color: '#bbb', fontSize: 13 }}>暂无图片</Text></View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{hotel.nameZh}</Text>
                <Text style={styles.cardStar}>{'★'.repeat(hotel.starRating)}<Text style={styles.cardAddr}>  {hotel.address}</Text></Text>
                <View style={styles.cardBottom}>
                  {price !== null ? (
                    <Text style={styles.cardPrice}>¥<Text style={styles.cardPriceNum}>{price}</Text> 起/晚</Text>
                  ) : <Text style={styles.cardNoPrice}>价格待定</Text>}
                  <View style={styles.bookBtn}><Text style={styles.bookBtnText}>查看</Text></View>
                </View>
              </View>
            </TouchableOpacity>
          )
        })
      )}
      <View style={{ height: 20 }} />

      {/* 日历弹窗 */}
      <Modal visible={showCal} transparent animationType="slide">
        <TouchableOpacity style={{ flex:1, backgroundColor:'rgba(0,0,0,0.4)' }} onPress={() => setShowCal(false)} />
        <DatePicker
          checkIn={checkIn} checkOut={checkOut}
          onSelect={(ci,co) => { setCheckIn(ci); setCheckOut(co) }}
          onClose={() => setShowCal(false)}
        />
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#1677ff', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, marginBottom: 12 },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#333' },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 10 },
  dateBlock: { flex: 1, alignItems: 'center' },
  dateMain: { fontSize: 18, fontWeight: '700', color: '#fff' },
  dateSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  nightBadge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginHorizontal: 8 },
  nightText: { color: '#fff', fontSize: 13 },
  searchBtn: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginBottom: 12 },
  searchBtnText: { color: '#1677ff', fontWeight: '700', fontSize: 16 },
  quickRow: { flexDirection: 'row', justifyContent: 'space-around' },
  quickBtn: { alignItems: 'center' },
  quickIcon: { fontSize: 22 },
  quickLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', margin: 16, marginBottom: 8, color: '#222' },
  card: { backgroundColor: '#fff', borderRadius: 12, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden', elevation: 2, flexDirection: 'row', height: 110 },
  cardImg: { width: 110, height: 110 },
  noImg: { backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#222' },
  cardStar: { fontSize: 13, color: '#f5a623' },
  cardAddr: { fontSize: 12, color: '#999', fontWeight: '400' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: { fontSize: 13, color: '#ff5500' },
  cardPriceNum: { fontSize: 20, fontWeight: '700' },
  cardNoPrice: { fontSize: 13, color: '#aaa' },
  bookBtn: { backgroundColor: '#1677ff', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5 },
  bookBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
})

const dp = StyleSheet.create({
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 16, fontWeight: '700' },
  close: { fontSize: 18, color: '#999' },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 },
  navBtn: { fontSize: 24, color: '#1677ff', paddingHorizontal: 8 },
  monthLabel: { fontSize: 15, fontWeight: '600' },
  weekRow: { flexDirection: 'row', paddingHorizontal: 8, marginBottom: 4 },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12, color: '#999' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  cell: { width: '14.28%', alignItems: 'center', paddingVertical: 6, minHeight: 44 },
  between: { backgroundColor: '#e6f0ff' },
  selected: { backgroundColor: '#1677ff', borderRadius: 8 },
  dayText: { fontSize: 15, color: '#333' },
  pastText: { color: '#ccc' },
  selectedText: { color: '#fff', fontWeight: '700' },
  label: { fontSize: 9, color: '#fff', marginTop: 1 },
  footer: { alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 8 },
  footerText: { fontSize: 14, color: '#555' },
})
