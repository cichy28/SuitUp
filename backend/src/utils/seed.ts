import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Rozpoczynam seedowanie bazy danych...');

  // Czyszczenie istniejących danych
  console.log('🧹 Czyszczenie istniejących danych...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariantImage.deleteMany();
  await prisma.productVariant.deleteMany();
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

  // Tworzenie właściwości produktu zarządzanych przez producenta
  console.log('🎨 Tworzenie właściwości produktu...');
  
  // Style
  const styles = await Promise.all([
    prisma.productStyle.create({
      data: {
        producerId: producerUser.id,
        name: 'Klasyczny',
        description: 'Tradycyjny, ponadczasowy krój',
        imageUrl: `/uploads/${producerUser.id}/styles/classic.jpg`,
        additionalPrice: 0.00,
      },
    }),
    prisma.productStyle.create({
      data: {
        producerId: producerUser.id,
        name: 'Slim fit',
        description: 'Dopasowany, nowoczesny krój',
        imageUrl: `/uploads/${producerUser.id}/styles/slim.jpg`,
        additionalPrice: 50.00,
      },
    }),
    prisma.productStyle.create({
      data: {
        producerId: producerUser.id,
        name: 'Oversize',
        description: 'Luźny, komfortowy krój',
        imageUrl: `/uploads/${producerUser.id}/styles/oversize.jpg`,
        additionalPrice: 30.00,
      },
    }),
    prisma.productStyle.create({
      data: {
        producerId: producerUser.id,
        name: 'Wysoki stan',
        description: 'Podwyższona talia',
        imageUrl: `/uploads/${producerUser.id}/styles/high-waist.jpg`,
        additionalPrice: 25.00,
      },
    }),
  ]);

  // Materiały
  const materials = await Promise.all([
    prisma.productMaterial.create({
      data: {
        producerId: producerUser.id,
        name: 'Wełna 100%',
        description: 'Naturalna wełna najwyższej jakości',
        imageUrl: `/uploads/${producerUser.id}/materials/wool_texture.jpg`,
        additionalPrice: 100.00,
      },
    }),
    prisma.productMaterial.create({
      data: {
        producerId: producerUser.id,
        name: 'Wełna z poliestrem',
        description: 'Mieszanka wełny z poliestrem',
        imageUrl: `/uploads/${producerUser.id}/materials/wool_knit.jpg`,
        additionalPrice: 0.00,
      },
    }),
    prisma.productMaterial.create({
      data: {
        producerId: producerUser.id,
        name: 'Bawełna',
        description: 'Naturalna bawełna organiczna',
        imageUrl: `/uploads/${producerUser.id}/materials/cotton_texture.jpg`,
        additionalPrice: 50.00,
      },
    }),
    prisma.productMaterial.create({
      data: {
        producerId: producerUser.id,
        name: 'Len',
        description: 'Naturalny len wysokiej jakości',
        imageUrl: `/uploads/${producerUser.id}/materials/linen.jpg`,
        additionalPrice: 80.00,
      },
    }),
    prisma.productMaterial.create({
      data: {
        producerId: producerUser.id,
        name: 'Jedwab',
        description: 'Naturalny jedwab premium',
        imageUrl: `/uploads/${producerUser.id}/materials/silk.jpg`,
        additionalPrice: 150.00,
      },
    }),
  ]);

  // Wykończenia
  const finishes = await Promise.all([
    prisma.productFinish.create({
      data: {
        producerId: producerUser.id,
        name: 'Standardowe',
        description: 'Standardowe wykończenie',
        imageUrl: `/uploads/${producerUser.id}/finishes/standard.jpg`,
        additionalPrice: 0.00,
      },
    }),
    prisma.productFinish.create({
      data: {
        producerId: producerUser.id,
        name: 'Premium',
        description: 'Wykończenie premium z dodatkowymi detalami',
        imageUrl: `/uploads/${producerUser.id}/finishes/premium.jpg`,
        additionalPrice: 100.00,
      },
    }),
    prisma.productFinish.create({
      data: {
        producerId: producerUser.id,
        name: 'Guziki złote',
        description: 'Złote guziki premium',
        imageUrl: `/uploads/${producerUser.id}/finishes/gold_buttons.jpg`,
        additionalPrice: 75.00,
      },
    }),
    prisma.productFinish.create({
      data: {
        producerId: producerUser.id,
        name: 'Guziki czarne',
        description: 'Eleganckie czarne guziki',
        imageUrl: `/uploads/${producerUser.id}/finishes/black_buttons.jpg`,
        additionalPrice: 25.00,
      },
    }),
  ]);

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

  // Generowanie wariantów produktu
  console.log('🔄 Generowanie wariantów produktu...');
  
  const products = [jacket, pants, vest, skirt];
  const allVariants = [];

  for (const product of products) {
    // Wybieramy odpowiednie style dla każdego produktu
    let productStyles: any[] = [];
    if (product.category === 'jacket' || product.category === 'vest') {
      productStyles = [styles[0], styles[1], styles[2]]; // Klasyczny, Slim fit, Oversize
    } else if (product.category === 'pants') {
      productStyles = [styles[0], styles[1]]; // Klasyczny, Slim fit
    } else if (product.category === 'skirt') {
      productStyles = [styles[0], styles[3]]; // Klasyczny, Wysoki stan
    }

    // Wybieramy materiały (wszystkie dla każdego produktu)
    const productMaterials = materials.slice(0, 3); // Wełna 100%, Wełna z poliestrem, Bawełna

    // Wybieramy wykończenia
    const productFinishes = finishes.slice(0, 2); // Standardowe, Premium

    // Generujemy warianty
    for (const style of productStyles) {
      for (const material of productMaterials) {
        for (const finish of productFinishes) {
          const price = product.basePrice + style.additionalPrice + material.additionalPrice + finish.additionalPrice;
          
          const variant = await prisma.productVariant.create({
            data: {
              productId: product.id,
              styleId: style.id,
              materialId: material.id,
              finishId: finish.id,
              sku: `${product.category.toUpperCase()}-${style.name.replace(/\s+/g, '')}-${material.name.replace(/\s+/g, '')}-${finish.name.replace(/\s+/g, '')}`,
              price: price,
              isActive: true,
            },
          });
          
          allVariants.push(variant);
        }
      }
    }
  }

  // Dodawanie obrazków do wariantów
  console.log('🖼️ Dodawanie obrazków do wariantów...');
  
  for (const variant of allVariants.slice(0, 6)) { // Dodajemy obrazki tylko do pierwszych 6 wariantów dla przykładu
    const viewTypes = ['front', 'left', 'right'];
    
    for (const viewType of viewTypes) {
      await prisma.productVariantImage.create({
        data: {
          variantId: variant.id,
          imageUrl: `https://example.com/images/variant-${variant.id}-${viewType}.jpg`,
          viewType: viewType,
        },
      });
    }
  }

  // Tworzenie przykładowych zamówień z wariantami
  console.log('📦 Tworzenie przykładowych zamówień...');
  
  // Znajdź pierwszy wariant marynarki
  const jacketVariant = allVariants.find(v => v.productId === jacket.id);
  
  if (jacketVariant) {
    const order1 = await prisma.order.create({
      data: {
        userId: clientUser.id,
        status: 'submitted',
        totalPrice: jacketVariant.price,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order1.id,
        productId: jacket.id,
        variantId: jacketVariant.id,
        quantity: 1,
        price: jacketVariant.price,
      },
    });
  }

  // Znajdź pierwszy wariant spodni
  const pantsVariant = allVariants.find(v => v.productId === pants.id);
  
  if (pantsVariant) {
    const order2 = await prisma.order.create({
      data: {
        userId: clientUser.id,
        status: 'processing',
        totalPrice: pantsVariant.price,
      },
    });

    await prisma.orderItem.create({
      data: {
        orderId: order2.id,
        productId: pants.id,
        variantId: pantsVariant.id,
        quantity: 1,
        price: pantsVariant.price,
      },
    });
  }

  console.log('✅ Seedowanie zakończone pomyślnie!');
  console.log('');
  console.log('📋 Utworzone dane testowe:');
  console.log('👤 Klient: klient@example.com / password123');
  console.log('🏭 Producent: producent@example.com / password123');
  console.log(`🎨 Style: ${styles.length}`);
  console.log(`🧵 Materiały: ${materials.length}`);
  console.log(`✨ Wykończenia: ${finishes.length}`);
  console.log(`📦 Produkty: ${products.length}`);
  console.log(`🔄 Warianty: ${allVariants.length}`);
  console.log(`🖼️ Obrazki wariantów: ${allVariants.slice(0, 6).length * 3}`);
  console.log('🛍️ Zamówienia: 2 przykładowe zamówienia z wariantami');
  console.log('');
  console.log('🔗 Przykładowe URL obrazków:');
  console.log('• Style: https://example.com/images/style-*.jpg');
  console.log('• Materiały: https://example.com/images/material-*.jpg');
  console.log('• Wykończenia: https://example.com/images/finish-*.jpg');
  console.log('• Warianty: https://example.com/images/variant-*-[front|left|right].jpg');
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


export { main };

