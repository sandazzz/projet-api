import prisma from '@lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
  console.log('Seeding database...');

  const numberOfUsers = 10;
  const adsPerUser = 3;

  for (let i = 0; i < numberOfUsers; i++) {
    const user = await prisma.user.create({
      data: {
        firstName: faker.person.firstName(), // Utilise faker.person pour les noms
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        passwordHash: faker.internet.password(),
        oauthProvider: faker.helpers.arrayElement([null, faker.company.name()]), // Utilise un tableau pour générer aléatoirement null ou une valeur
        oauthProviderId: faker.helpers.arrayElement([null, faker.string.uuid()]), // Utilise un UUID ou null
      },
    });

    for (let j = 0; j < adsPerUser; j++) {
      await prisma.ad.create({
        data: {
          userId: user.id,
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          imageUrl: faker.helpers.arrayElement([null, faker.image.url()]), // Génère une URL d'image ou null
        },
      });
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
