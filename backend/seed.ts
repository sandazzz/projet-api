import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Création de 2 utilisateurs
  const user1 = await prisma.user.create({
    data: {
      firstName: "Alice",
      lastName: "Dupont",
      email: "alice@example.com",
      passwordHash: "hashedpassword1", // À remplacer par un vrai hash en production
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: "Bob",
      lastName: "Martin",
      email: "bob@example.com",
      passwordHash: "hashedpassword2", // À remplacer par un vrai hash en production
    },
  });

  console.log("✅ Users created");

  // Création de 8 annonces
  const ads = await prisma.ad.createMany({
    data: [
      {
        userId: user1.id,
        title: "Vélo de route en bon état",
        description: "Un vélo de route en excellent état, peu utilisé.",
        imageUrl: "https://source.unsplash.com/400x300/?bike",
      },
      {
        userId: user1.id,
        title: "Ordinateur portable ASUS",
        description:
          "PC ASUS 16Go RAM, SSD 512Go, parfait pour le télétravail.",
        imageUrl: "https://source.unsplash.com/400x300/?laptop",
      },
      {
        userId: user1.id,
        title: "Table en bois massif",
        description: "Table en chêne, idéale pour une salle à manger.",
        imageUrl: "https://source.unsplash.com/400x300/?table",
      },
      {
        userId: user1.id,
        title: "Smartphone Samsung Galaxy",
        description: "Samsung Galaxy S22, écran AMOLED, état neuf.",
        imageUrl: "https://source.unsplash.com/400x300/?smartphone",
      },
      {
        userId: user2.id,
        title: "Chaise ergonomique",
        description: "Chaise de bureau ergonomique avec soutien lombaire.",
        imageUrl: "https://source.unsplash.com/400x300/?chair",
      },
      {
        userId: user2.id,
        title: "Montre connectée Fitbit",
        description: "Fitbit Charge 5, suivi sportif et fréquence cardiaque.",
        imageUrl: "https://source.unsplash.com/400x300/?watch",
      },
      {
        userId: user2.id,
        title: "Console PlayStation 5",
        description: "PS5 avec deux manettes et trois jeux inclus.",
        imageUrl: "https://source.unsplash.com/400x300/?playstation",
      },
      {
        userId: user2.id,
        title: "Appareil photo Canon",
        description: "Canon EOS 90D, idéal pour la photo et la vidéo.",
        imageUrl: "https://source.unsplash.com/400x300/?camera",
      },
    ],
  });

  console.log("✅ 8 Ads created");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
