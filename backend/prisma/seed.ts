import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('开始导入数据...');

  // 1. 创建默认商户用户
  console.log('创建默认商户用户...');
  const defaultMerchant = await prisma.user.upsert({
    where: { email: 'merchant@example.com' },
    update: {},
    create: {
      email: 'merchant@example.com',
      password: 'password123',
      name: '默认商户',
      role: 'merchant',
    },
  });
  console.log('默认商户用户创建完成');

  // 2. 导入标签数据
  console.log('导入标签数据...');
  const tagDataPath = path.join(__dirname, '../../tag_data.json');
  const tagData = JSON.parse(fs.readFileSync(tagDataPath, 'utf8'));
  
  const tags = await Promise.all(
    tagData.map(async (tag: any) => {
      return await prisma.hotelTag.create({
        data: {
          name: tag.name,
          description: tag.description,
        },
      });
    })
  );
  console.log(`成功导入 ${tags.length} 个标签`);

  // 3. 导入酒店数据
  console.log('导入酒店数据...');
  const hotelDataPath = path.join(__dirname, '../../hotels_export.csv');
  const hotelData = fs.readFileSync(hotelDataPath, 'utf8')
    .split('\n')
    .filter((line, index) => index > 0 && line.trim() !== '');

  const hotels = await Promise.all(
    hotelData.map(async (line) => {
      // 使用正则表达式解析CSV，处理包含逗号的字段
      const regex = /(?:"([^"]*(?:""[^"]*)*)")|([^,]+)/g;
      const matches: string[] = [];
      let match;
      while ((match = regex.exec(line)) !== null) {
        matches.push(match[1] || match[2]);
      }
      
      const [id, nameZh, nameEn, address, starRating, openingDate, description, status, rejectionReason] = matches;
      
      return await prisma.hotel.create({
        data: {
          id,
          nameZh: nameZh.trim(),
          nameEn: nameEn.trim(),
          address: address.trim(),
          starRating: parseInt(starRating.trim()),
          openingDate: new Date(openingDate.trim()),
          description: description.trim(),
          status: status as any,
          rejectionReason: rejectionReason.trim() || null,
          merchantId: defaultMerchant.id,
        },
      });
    })
  );
  console.log(`成功导入 ${hotels.length} 个酒店`);

  // 3. 导入图片数据
  console.log('导入图片数据...');
  const imageDataPath = path.join(__dirname, '../../hotel_image.txt');
  const imageData = fs.readFileSync(imageDataPath, 'utf8')
    .split('\n')
    .filter((line) => line.trim() !== '');

  // 确保每个酒店至少有一个主图
  const mainImageMap = new Map<string, boolean>();
  hotels.forEach(hotel => {
    mainImageMap.set(hotel.id, false);
  });

  const images = await Promise.all(
    imageData.map(async (line, index) => {
      const hotelIndex = index % hotels.length;
      const hotelId = hotels[hotelIndex].id;
      const url = line.trim().replace(/^\d+\.\s*/, ''); // 移除行号
      
      // 为每个酒店的第一张图片设置为主图
      const isMain = !mainImageMap.get(hotelId);
      if (isMain) {
        mainImageMap.set(hotelId, true);
      }
      
      return await prisma.hotelImage.create({
        data: {
          hotelId,
          url,
          isMain,
        },
      });
    })
  );
  console.log(`成功导入 ${images.length} 张图片`);

  // 4. 为酒店随机关联1-5个标签
  console.log('为酒店分配标签...');
  await Promise.all(
    hotels.map(async (hotel) => {
      // 随机选择1-5个标签
      const tagCount = Math.floor(Math.random() * 5) + 1;
      const shuffledTags = [...tags].sort(() => Math.random() - 0.5);
      const selectedTags = shuffledTags.slice(0, tagCount);
      
      await Promise.all(
        selectedTags.map(async (tag) => {
          await prisma.hotelTagRelation.create({
            data: {
              hotelId: hotel.id,
              tagId: tag.id,
            },
          });
        })
      );
    })
  );
  console.log('标签分配完成');

  console.log('数据导入完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
