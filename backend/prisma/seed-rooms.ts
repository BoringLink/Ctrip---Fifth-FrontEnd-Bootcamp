import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 生成指定范围内的随机整数
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成指定范围内的随机价格（保留两位小数）
function getRandomPrice(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

async function main() {
  console.log('开始为酒店填充房型数据...');
  
  // 获取所有酒店
  const hotels = await prisma.hotel.findMany();
  
  console.log(`找到 ${hotels.length} 家酒店`);
  
  // 为每家酒店创建两个房型
  let createdRooms = 0;
  
  for (const hotel of hotels) {
    // 创建大床房
    await prisma.hotelRoom.create({
      data: {
        hotelId: hotel.id,
        name: '大床房',
        description: '舒适的大床房，适合单人入住',
        price: getRandomPrice(100, 1000),
        capacity: 1,
        quantity: getRandomInt(0, 20),
      },
    });
    
    // 创建双床房
    await prisma.hotelRoom.create({
      data: {
        hotelId: hotel.id,
        name: '双床房',
        description: '宽敞的双床房，适合双人入住',
        price: getRandomPrice(100, 1000),
        capacity: 2,
        quantity: getRandomInt(0, 20),
      },
    });
    
    createdRooms += 2;
  }
  
  console.log(`成功为 ${hotels.length} 家酒店创建了 ${createdRooms} 个房型`);
  
  // 验证结果
  const totalRooms = await prisma.hotelRoom.count();
  console.log(`当前hotel_rooms表中共有 ${totalRooms} 个房型`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
