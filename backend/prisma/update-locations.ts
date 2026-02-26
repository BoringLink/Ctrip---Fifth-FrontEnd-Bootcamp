import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始更新酒店地理位置...');
  
  // 执行SQL更新操作
  await prisma.$executeRaw`
    UPDATE hotels 
    SET location = ST_SetSRID(ST_MakePoint(
      116.4074 + (random() - 0.5) * 10, -- 经度范围：111.4074 到 121.4074
      39.9042 + (random() - 0.5) * 10  -- 纬度范围：34.9042 到 44.9042
    ), 4326)
    WHERE location IS NULL
  `;
  
  console.log('酒店地理位置更新完成！');
  
  // 验证更新结果
  const result = await prisma.$queryRaw`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN location IS NOT NULL THEN 1 END) as with_location
    FROM hotels
  `;
  
  // 使用 any 类型来避免 TypeScript 错误
  const data = result[0] as any;
  console.log(`总酒店数: ${data.total}`);
  console.log(`已设置地理位置的酒店数: ${data.with_location}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
