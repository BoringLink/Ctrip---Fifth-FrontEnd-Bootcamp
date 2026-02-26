import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('创建默认商户用户...');
  
  // 检查是否已存在商户用户
  const existingMerchant = await prisma.user.findFirst({
    where: {
      role: 'merchant',
    },
  });
  
  if (existingMerchant) {
    console.log('商户用户已存在:', existingMerchant.email);
    return;
  }
  
  // 创建新的商户用户
  const password = await bcrypt.hash('password123', 10);
  
  const merchant = await prisma.user.create({
    data: {
      email: 'merchant@example.com',
      password,
      name: '默认商户',
      role: 'merchant',
    },
  });
  
  console.log('商户用户创建成功:', merchant);
  console.log('商户ID:', merchant.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
