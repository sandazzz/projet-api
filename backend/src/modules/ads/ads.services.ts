import prisma from "@lib/prisma";
import { Prisma, Ad } from "@prisma/client";


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

export async function isAdExist(
  adId: number
): Promise<Ad | null> {
  const ad = await prisma.ad.findUnique({
    where: { id: adId },
  });
  return ad
}

export async function updateAd(
  data: Prisma.AdUpdateInput & { id: number }
) {
  return await prisma.ad.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
    },
  });
}

export async function deleteAd(adId: number) {
  return await prisma.ad.delete({
    where: { id: adId },
  });
}