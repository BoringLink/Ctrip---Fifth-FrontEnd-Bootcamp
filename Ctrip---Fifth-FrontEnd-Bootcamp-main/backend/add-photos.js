const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const KEY = 'e8b4c90bcb5a403e4781b73d1aa90b1b'

async function main() {
  const hotels = await prisma.hotel.findMany({ select: { id: true, nameZh: true } })
  let added = 0
  for (const hotel of hotels) {
    try {
      const url = `https://restapi.amap.com/v3/place/text?key=${KEY}&keywords=${encodeURIComponent(hotel.nameZh)}&types=酒店&extensions=all&offset=1`
      const res = await fetch(url)
      const data = await res.json()
      const poi = data.pois?.[0]
      if (!poi?.photos?.length) continue
      const photos = poi.photos.slice(0, 3)
      await prisma.hotelImage.createMany({
        data: photos.map((p, i) => ({
          hotelId: hotel.id,
          url: p.url,
          isMain: i === 0,
        })),
        skipDuplicates: true,
      })
      added++
      process.stdout.write(`\r${added}/${hotels.length} 已补充图片`)
    } catch {}
    await new Promise(r => setTimeout(r, 100))
  }
  console.log(`\n完成，共 ${added} 家酒店补充了图片`)
}

main().finally(() => prisma.$disconnect())
