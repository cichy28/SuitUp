import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam seedowanie bazy danych...');

  // Czyszczenie istniejących danych
  console.log('🧹 Czyszczenie istniejących danych...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productFinish.deleteMany();
  await prisma.productMaterial.deleteMany();
  await prisma.productStyle.deleteMany();
  await prisma.product.deleteMany();
  await prisma.bodyMeasurement.deleteMany();
  await prisma.user.deleteMany();

  // Tworzenie użytkowników testowych
  console.log('👥 Tworzenie użytkowników testowych...');
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const clientUser = await prisma.user.create({
    data: {
      email: 'klient@example.com',
      password: hashedPassword,
      name: 'Anna Kowalska',
      userType: 'client',
    },
  });

  const producerUser = await prisma.user.create({
    data: {
      email: 'producent@example.com',
      password: hashedPassword,
      name: 'Jan Nowak',
      userType: 'producer',
    },
  });

  // Dodawanie wymiarów ciała dla klienta
  console.log('📏 Dodawanie wymiarów ciała...');
  await prisma.bodyMeasurement.create({
    data: {
      userId: clientUser.id,
      height: 170,
      chest: 90,
      waist: 75,
      hips: 95,
      shoulders: 42,
      inseam: 75,
      bodyType: 'hourglass',
    },
  });

  // Tworzenie produktów
  console.log('👗 Tworzenie produktów...');
  
  const jacket = await prisma.product.create({
    data: {
      name: 'Marynarka damska klasyczna',
      description: 'Elegancka marynarka damska w klasycznym kroju, idealna do personalizacji według potrzeb klienta.',
      category: 'jacket',
      basePrice: 599.00,
      sellerId: producerUser.id,
    },
  });

  const pants = await prisma.product.create({
    data: {
      name: 'Spodnie damskie eleganckie',
      description: 'Eleganckie spodnie damskie o dopasowanym kroju, wykonane z wysokiej jakości materiałów.',
      category: 'pants',
      basePrice: 349.00,
      sellerId: producerUser.id,
    },
  });

  const vest = await prisma.product.create({
    data: {
      name: 'Kamizelka damska',
      description: 'Stylowa kamizelka damska, doskonała jako element zestawu lub samodzielna część garderoby.',
      category: 'vest',
      basePrice: 299.00,
      sellerId: producerUser.id,
    },
  });

  const skirt = await prisma.product.create({
    data: {
      name: 'Spódnica ołówkowa',
      description: 'Klasyczna spódnica ołówkowa o dopasowanym kroju, idealna do eleganckich stylizacji.',
      category: 'skirt',
      basePrice: 279.00,
      sellerId: producerUser.id,
    },
  });

  // Dodawanie stylów do produktów
  console.log('🎨 Dodawanie stylów...');
  
  // Style dla marynarki
  await prisma.productStyle.createMany({
    data: [
      { productId: jacket.id, name: 'Klasyczny', additionalPrice: 0.00 },
      { productId: jacket.id, name: 'Slim fit', additionalPrice: 50.00 },
      { productId: jacket.id, name: 'Oversize', additionalPrice: 30.00 },
    ],
  });

  // Style dla spodni
  await prisma.productStyle.createMany({
    data: [
      { productId: pants.id, name: 'Klasyczny', additionalPrice: 0.00 },
      { productId: pants.id, name: 'Slim fit', additionalPrice: 40.00 },
    ],
  });

  // Style dla kamizelki
  await prisma.productStyle.create({
    data: { productId: vest.id, name: 'Klasyczny', additionalPrice: 0.00 },
  });

  // Style dla spódnicy
  await prisma.productStyle.createMany({
    data: [
      { productId: skirt.id, name: 'Klasyczny', additionalPrice: 0.00 },
      { productId: skirt.id, name: 'Wysoki stan', additionalPrice: 25.00 },
    ],
  });

  // Dodawanie materiałów
  console.log('🧵 Dodawanie materiałów...');
  
  const materials = [
    { name: 'Wełna 100%', additionalPrice: 100.00 },
    { name: 'Wełna z poliestrem', additionalPrice: 0.00 },
    { name: 'Bawełna', additionalPrice: 50.00 },
    { name: 'Len', additionalPrice: 80.00 },
    { name: 'Jedwab', additionalPrice: 150.00 },
  ];

  for (const product of [jacket, pants, vest, skirt]) {
    for (const material of materials) {
      await prisma.productMaterial.create({
        data: {
          productId: product.id,
          name: material.name,
          additionalPrice: material.additionalPrice,
        },
      });
    }
  }

  // Dodawanie wykończeń
  console.log('✨ Dodawanie wykończeń...');
  
  const finishes = [
    { name: 'Standardowe', additionalPrice: 0.00 },
    { name: 'Premium', additionalPrice: 100.00 },
  ];

  for (const product of [jacket, pants, vest, skirt]) {
    for (const finish of finishes) {
      await prisma.productFinish.create({
        data: {
          productId: product.id,
          name: finish.name,
          additionalPrice: finish.additionalPrice,
        },
      });
    }
  }

  // Tworzenie przykładowych zamówień
  console.log('📦 Tworzenie przykładowych zamówień...');
  
  const jacketStyle = await prisma.productStyle.findFirst({
    where: { productId: jacket.id, name: 'Slim fit' },
  });
  
  const jacketMaterial = await prisma.productMaterial.findFirst({
    where: { productId: jacket.id, name: 'Wełna 100%' },
  });
  
  const jacketFinish = await prisma.productFinish.findFirst({
    where: { productId: jacket.id, name: 'Premium' },
  });

  const order1 = await prisma.order.create({
    data: {
      userId: clientUser.id,
      status: 'submitted',
      totalPrice: 849.00, // 599 + 50 + 100 + 100
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order1.id,
      productId: jacket.id,
      styleId: jacketStyle?.id,
      materialId: jacketMaterial?.id,
      finishId: jacketFinish?.id,
      quantity: 1,
      price: 849.00,
    },
  });

  const pantsStyle = await prisma.productStyle.findFirst({
    where: { productId: pants.id, name: 'Klasyczny' },
  });
  
  const pantsMaterial = await prisma.productMaterial.findFirst({
    where: { productId: pants.id, name: 'Bawełna' },
  });
  
  const pantsFinish = await prisma.productFinish.findFirst({
    where: { productId: pants.id, name: 'Standardowe' },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: clientUser.id,
      status: 'processing',
      totalPrice: 399.00, // 349 + 0 + 50 + 0
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: order2.id,
      productId: pants.id,
      styleId: pantsStyle?.id,
      materialId: pantsMaterial?.id,
      finishId: pantsFinish?.id,
      quantity: 1,
      price: 399.00,
    },
  });

  console.log('✅ Seedowanie zakończone pomyślnie!');
  console.log('');
  console.log('📋 Utworzone dane testowe:');
  console.log('👤 Klient: klient@example.com / password123');
  console.log('🏭 Producent: producent@example.com / password123');
  console.log('📦 Produkty: 4 (marynarka, spodnie, kamizelka, spódnica)');
  console.log('🛍️ Zamówienia: 2 przykładowe zamówienia');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

