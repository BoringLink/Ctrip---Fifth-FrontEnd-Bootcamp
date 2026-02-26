import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('开始导入客人数据...');

  // 读取客人数据
  const guestDataPath = path.join(__dirname, '../../guest_data.json');
  const guestData = JSON.parse(fs.readFileSync(guestDataPath, 'utf8'));

  console.log(`找到 ${guestData.length} 条客人数据`);

  // 导入客人数据
  let createdGuests = 0;

  for (const guest of guestData) {
    try {
      await prisma.guest.create({
        data: {
          name: guest.name,
          idType: guest.id_type as any,
          idNumber: guest.id_number,
          phone: guest.phone,
        },
      });
      createdGuests++;
    } catch (error) {
      console.error(`导入客人 ${guest.name} 失败:`, error);
    }
  }

  console.log(`成功导入 ${createdGuests} 个客人`);

  // 验证结果
  const totalGuests = await prisma.guest.count();
  console.log(`当前guests表中共有 ${totalGuests} 个客人`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
