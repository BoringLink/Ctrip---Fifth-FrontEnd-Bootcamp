import React, { useState, useRef, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList } from 'react-native'
import { WebView } from 'react-native-webview'
import type WebViewType from 'react-native-webview'
import * as Location from 'expo-location'

const API = 'http://192.168.1.28:3000'

async function fetchPois(lat: number, lng: number): Promise<any[]> {
  try {
    const res = await fetch(`${API}/api/hotels/poi?lat=${lat}&lng=${lng}`)
    return await res.json()
  } catch {
    return []
  }
}

const REGIONS: Record<string, Record<string, { name: string; lat: number; lng: number; zoom: number }[]>> = {
  '北京': {
    '北京市': [
      { name: '全市', lat: 39.9087, lng: 116.3975, zoom: 11 },
      { name: '东城', lat: 39.9284, lng: 116.4162, zoom: 14 },
      { name: '西城', lat: 39.9122, lng: 116.3667, zoom: 14 },
      { name: '朝阳', lat: 39.9215, lng: 116.4866, zoom: 13 },
      { name: '海淀', lat: 39.9601, lng: 116.2977, zoom: 13 },
      { name: '丰台', lat: 39.8585, lng: 116.2867, zoom: 13 },
      { name: '石景山', lat: 39.9146, lng: 116.2219, zoom: 14 },
      { name: '通州', lat: 39.9023, lng: 116.6563, zoom: 13 },
      { name: '顺义', lat: 40.1300, lng: 116.6543, zoom: 13 },
      { name: '大兴', lat: 39.7267, lng: 116.3399, zoom: 13 },
    ],
  },
  '上海': {
    '上海市': [
      { name: '全市', lat: 31.2304, lng: 121.4737, zoom: 11 },
      { name: '黄浦', lat: 31.2231, lng: 121.4816, zoom: 14 },
      { name: '徐汇', lat: 31.1884, lng: 121.4366, zoom: 14 },
      { name: '浦东', lat: 31.2215, lng: 121.5440, zoom: 13 },
      { name: '静安', lat: 31.2279, lng: 121.4484, zoom: 14 },
      { name: '虹口', lat: 31.2646, lng: 121.5053, zoom: 14 },
    ],
  },
  '广东': {
    '广州市': [
      { name: '全市', lat: 23.1291, lng: 113.2644, zoom: 11 },
      { name: '天河', lat: 23.1302, lng: 113.3227, zoom: 13 },
      { name: '越秀', lat: 23.1286, lng: 113.2733, zoom: 14 },
      { name: '海珠', lat: 23.0838, lng: 113.3178, zoom: 13 },
      { name: '番禺', lat: 22.9368, lng: 113.3640, zoom: 13 },
    ],
    '深圳市': [
      { name: '全市', lat: 22.5431, lng: 114.0579, zoom: 11 },
      { name: '南山', lat: 22.5333, lng: 113.9300, zoom: 13 },
      { name: '福田', lat: 22.5415, lng: 114.0553, zoom: 13 },
      { name: '罗湖', lat: 22.5486, lng: 114.1149, zoom: 13 },
      { name: '宝安', lat: 22.5548, lng: 113.8839, zoom: 13 },
    ],
  },
  '浙江': {
    '杭州市': [
      { name: '全市', lat: 30.2741, lng: 120.1551, zoom: 11 },
      { name: '西湖', lat: 30.2590, lng: 120.1300, zoom: 13 },
      { name: '上城', lat: 30.2461, lng: 120.1694, zoom: 13 },
      { name: '拱墅', lat: 30.3192, lng: 120.1415, zoom: 13 },
      { name: '余杭', lat: 30.4194, lng: 120.3020, zoom: 12 },
    ],
  },
  '四川': {
    '成都市': [
      { name: '全市', lat: 30.5728, lng: 104.0668, zoom: 11 },
      { name: '锦江', lat: 30.5576, lng: 104.0800, zoom: 13 },
      { name: '青羊', lat: 30.6667, lng: 104.0500, zoom: 13 },
      { name: '武侯', lat: 30.6417, lng: 104.0431, zoom: 13 },
      { name: '天府新区', lat: 30.3500, lng: 104.0667, zoom: 12 },
    ],
  },
}

const PROVINCES = Object.keys(REGIONS)

function buildHtml(lat: number, lng: number, zoom: number, pois: any[] = []) {
  const poisJson = JSON.stringify(pois)
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.min.css"/>
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css"/>
<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css"/>
<script src="https://cdn.bootcdn.net/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js"></script>
<style>
html,body,#map{margin:0;padding:0;height:100%;width:100%}
.leaflet-div-icon{background:none!important;border:none!important}
.marker-cluster-small,.marker-cluster-medium,.marker-cluster-large{background-color:rgba(232,57,42,0.2)}
.marker-cluster-small div,.marker-cluster-medium div,.marker-cluster-large div{background-color:#e8392a;color:#fff;font-weight:700}
</style>
</head><body>
<div id="map"></div>
<script>
var map = L.map('map',{zoomControl:true}).setView([${lat},${lng}],${zoom});
L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',{subdomains:'1234',attribution:'© 高德地图'}).addTo(map);
var cluster = L.markerClusterGroup({maxClusterRadius:60});
map.addLayer(cluster);
function renderPois(pois){
  cluster.clearLayers();
  pois.forEach(function(p){
    if(!p.location)return;
    var loc=p.location.split(',');
    var plat=parseFloat(loc[1]),plng=parseFloat(loc[0]);
    var rating=p.rating&&!Array.isArray(p.rating)?p.rating:'';
    var price=p.biz_ext&&!Array.isArray(p.biz_ext.lowest_price)&&p.biz_ext.lowest_price?String(p.biz_ext.lowest_price):'';
    var star=p.biz_ext&&!Array.isArray(p.biz_ext.star)&&p.biz_ext.star?parseInt(p.biz_ext.star):0;
    var starStr=star>0?'★'.repeat(star):'';
    var pinSvg='<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.27 0 0 6.27 0 14c0 9.33 14 22 14 22S28 23.33 28 14C28 6.27 21.73 0 14 0z" fill="#e8392a"/><circle cx="14" cy="14" r="5" fill="#fff"/></svg>';
    var icon=L.divIcon({className:'',html:pinSvg,iconAnchor:[14,36]});
    var popup='<div style="min-width:180px"><b style="font-size:14px">'+p.name+'</b>'
      +(starStr?'<br/><span style="color:#f5a623;font-size:13px">'+starStr+'</span>':'')
      +(rating?'<span style="color:#1677ff;font-size:12px;margin-left:6px">⭐'+rating+'分</span>':'')
      +(price?'<br/><span style="color:#ff5500;font-size:18px;font-weight:700">¥'+price+'</span><span style="font-size:12px;color:#999"> 起/晚</span>':'')
      +'<br/><span style="color:#888;font-size:12px">'+(p.address||'')+'</span>'
      +(p.tel?'<br/><span style="font-size:12px">📞 '+p.tel+'</span>':'')
      +'</div>';
    cluster.addLayer(L.marker([plat,plng],{icon:icon}).bindPopup(popup,{maxWidth:220}));
  });
}
renderPois(${poisJson});
map.on('moveend',function(){var c=map.getCenter();window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({lat:c.lat,lng:c.lng}));});
</script></body></html>`
}

type PickerLevel = 'province' | 'city' | 'district'

export default function MapScreen() {
  const [province, setProvince] = useState('北京')
  const [city, setCity] = useState('北京市')
  const [districtIdx, setDistrictIdx] = useState(0)
  const [picker, setPicker] = useState<PickerLevel | null>(null)
  const webRef = useRef<WebViewType>(null)
  const initialHtml = useMemo(() => buildHtml(
    REGIONS['北京']['北京市'][0].lat,
    REGIONS['北京']['北京市'][0].lng,
    REGIONS['北京']['北京市'][0].zoom
  ), [])

  const cities = Object.keys(REGIONS[province] ?? {})
  const districts = REGIONS[province]?.[city] ?? []

  const goTo = async (lat: number, lng: number, zoom: number) => {
    // 先让地图飞到目标位置
    webRef.current?.injectJavaScript(`map.setView([${lat},${lng}],${zoom});true;`)
    // 再拉 POI 更新标记
    const pois = await fetchPois(lat, lng)
    const js = `renderPois(${JSON.stringify(pois)});true;`
    webRef.current?.injectJavaScript(js)
  }

  const selectProvince = (p: string) => {
    const newCity = Object.keys(REGIONS[p])[0]
    const d = REGIONS[p][newCity][0]
    setProvince(p)
    setCity(newCity)
    setDistrictIdx(0)
    goTo(d.lat, d.lng, d.zoom)
    setPicker(null)
  }

  const selectCity = (c: string) => {
    const d = REGIONS[province][c][0]
    setCity(c)
    setDistrictIdx(0)
    goTo(d.lat, d.lng, d.zoom)
    setPicker(null)
  }

  const selectDistrict = (i: number) => {
    setDistrictIdx(i)
    const d = districts[i]
    goTo(d.lat, d.lng, d.zoom)
  }

  const locateMe = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('提示', '需要位置权限才能定位，请在设置中允许')
      return
    }
    // 先尝试 IP 定位（模拟器更可靠），同时并行跑 GPS
    const gpsPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }).catch(() => null)
    const ipPromise = fetch('https://ipapi.co/json/').then(r => r.json()).catch(() => null)
    const ip = await Promise.race([ipPromise, new Promise<null>(r => setTimeout(() => r(null), 3000))])
    if (ip && ip.latitude) {
      goTo(ip.latitude, ip.longitude, 14)
      return
    }
    // IP 失败再等 GPS
    const gps = await Promise.race([gpsPromise, new Promise<null>(r => setTimeout(() => r(null), 5000))])
    if (gps && 'coords' in gps) {
      goTo(gps.coords.latitude, gps.coords.longitude, 15)
      return
    }
    Alert.alert('定位失败', '无法获取位置，已显示当前选中区域')
    const d = districts[districtIdx]
    goTo(d.lat, d.lng, d.zoom)
  }

  return (
    <View style={styles.container}>
      {/* 级联选择栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.locateBtn} onPress={locateMe}>
          <Text style={styles.locateText}>📍 定位</Text>
        </TouchableOpacity>
        <View style={styles.cascade}>
          <TouchableOpacity style={styles.cascadeItem} onPress={() => setPicker('province')}>
            <Text style={styles.cascadeText}>{province}</Text>
            <Text style={styles.cascadeArrow}>▾</Text>
          </TouchableOpacity>
          <Text style={styles.sep}>›</Text>
          <TouchableOpacity style={styles.cascadeItem} onPress={() => setPicker('city')}>
            <Text style={styles.cascadeText}>{city}</Text>
            <Text style={styles.cascadeArrow}>▾</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 区级横向标签 */}
      <View style={styles.districtBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.districtScroll}>
          {districts.map((d, i) => (
            <TouchableOpacity
              key={d.name}
              style={[styles.tab, districtIdx === i && styles.tabActive]}
              onPress={() => selectDistrict(i)}
            >
              <Text style={[styles.tabText, districtIdx === i && styles.tabTextActive]}>{d.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <WebView
        ref={webRef}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: initialHtml, baseUrl: 'https://cdn.bootcdn.net' }}
        javaScriptEnabled
        mixedContentMode="always"
        onLoad={() => {
          const d = REGIONS['北京']['北京市'][0]
          goTo(d.lat, d.lng, d.zoom)
        }}
        onMessage={(e) => {
          try {
            const { lat, lng } = JSON.parse(e.nativeEvent.data)
            fetchPois(lat, lng).then(pois => {
              webRef.current?.injectJavaScript(`renderPois(${JSON.stringify(pois)});true;`)
            })
          } catch {}
        }}
      />

      {/* 省/市选择弹窗 */}
      <Modal visible={picker !== null} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setPicker(null)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{picker === 'province' ? '选择省份' : '选择城市'}</Text>
          <FlatList
            data={picker === 'province' ? PROVINCES : cities}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.sheetItem}
                onPress={() => picker === 'province' ? selectProvince(item) : selectCity(item)}
              >
                <Text style={styles.sheetItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 8, elevation: 3, gap: 8 },
  locateBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#fff3f0', borderWidth: 1, borderColor: '#e8392a' },
  locateText: { fontSize: 13, color: '#e8392a', fontWeight: '600' },
  cascade: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  cascadeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0' },
  cascadeText: { fontSize: 13, color: '#333', fontWeight: '600' },
  cascadeArrow: { fontSize: 11, color: '#999', marginLeft: 2 },
  sep: { fontSize: 14, color: '#ccc', marginHorizontal: 4 },
  districtBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  districtScroll: { paddingHorizontal: 8, paddingVertical: 6, gap: 6 },
  tab: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0' },
  tabActive: { backgroundColor: '#1677ff', borderColor: '#1677ff' },
  tabText: { fontSize: 13, color: '#555' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  map: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '60%', paddingBottom: 20 },
  sheetTitle: { fontSize: 16, fontWeight: '700', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  sheetItem: { paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  sheetItemText: { fontSize: 15, color: '#333' },
})
