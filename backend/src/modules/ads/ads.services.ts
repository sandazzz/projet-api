import prisma from "@lib/prisma";

export async function createNewAd(
  userId: number,
  title: string,
  description: string,
  image: string
) {
  try {
    const newAd = await prisma.ad.create({
      data: {
        userId: userId,
        title: title,
        description: description,
        imageUrl: image,
      },
    });

    console.log(newAd)
    
    return newAd;
  } catch (error) {
    console.error("Error creating users:", error);
  }
}
