const { PrismaClient } = require('@prisma/client')
const https = require('https')

const prisma = new PrismaClient()
const AMAP_KEY = 'e8b4c90bcb5a403e4781b73d1aa90b1b'

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

async function fetchHotels(city, lat, lng) {
  const url = `https://restapi.amap.com/v3/place/around?key=${AMAP_KEY}&location=${lng},${lat}&keywords=酒店&radius=5000&offset=25&output=json&extensions=all`
  const data = await httpGet(url)
  return data.pois || []
}

async function main() {
  // 清空旧数据
  await prisma.hotelImage.deleteMany()
  await prisma.hotelFacility.deleteMany()
  await prisma.hotelRoom.deleteMany()
  await prisma.hotelTag.deleteMany()
  await prisma.hotel.deleteMany()
  await prisma.user.deleteMany()
  console.log('清空旧数据完成')

  // 创建管理员和商户
  const bcrypt = require('bcrypt')
  const hash = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: { email: 'admin@test.com', name: 'Admin', password: hash, role: 'admin' }
  })
  const merchant = await prisma.user.create({
    data: { email: 'merchant@test.com', name: 'Merchant', password: hash, role: 'merchant' }
  })
  console.log('管理员创建完成')

  // 从高德获取北京酒店
  const cities = [
    { name: '北京', lat: 39.9087, lng: 116.3975 },
    { name: '上海', lat: 31.2304, lng: 121.4737 },
    { name: '广州', lat: 23.1291, lng: 113.2644 },
  ]

  for (const city of cities) {
    console.log(`获取${city.name}酒店数据...`)
    const pois = await fetchHotels(city.name, city.lat, city.lng)
    console.log(`获取到 ${pois.length} 条`)

    for (const p of pois) {
      if (!p.location || !p.name) continue
      const [lngStr, latStr] = p.location.split(',')
      const star = p.biz_ext && !Array.isArray(p.biz_ext.star) ? parseInt(p.biz_ext.star) || 3 : 3
      const price = p.biz_ext && !Array.isArray(p.biz_ext.lowest_price) && p.biz_ext.lowest_price
        ? parseInt(p.biz_ext.lowest_price) : 200 + Math.floor(Math.random() * 500)
      const rating = p.rating && !Array.isArray(p.rating) ? parseFloat(p.rating) : null

      try {
        await prisma.hotel.create({
          data: {
            nameZh: p.name,
            nameEn: p.name,
            address: p.address || city.name,
            starRating: Math.min(5, Math.max(1, star)),
            description: `${p.name}，位于${p.address || city.name}`,
            openingDate: new Date('2015-01-01'),
            status: 'approved',
            latitude: parseFloat(latStr),
            longitude: parseFloat(lngStr),
            merchantId: merchant.id,
            rooms: {
              create: [
                { name: '标准间', price: price, capacity: 2, quantity: 10 },
                { name: '大床房', price: Math.round(price * 1.3), capacity: 2, quantity: 8 },
              ]
            }
          }
        })
      } catch (e) {
        console.error('插入失败:', p.name, e.message)
      }
    }
  }

  const total = await prisma.hotel.count()
  console.log(`\n共插入 ${total} 家酒店`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
