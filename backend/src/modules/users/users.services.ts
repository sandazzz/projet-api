import prisma from "@lib/prisma";
import { Prisma, User } from "@prisma/client";

export async function createNewUsers(
  userData: Prisma.UserCreateInput
): Promise<User> {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new Error(`Email ${userData.email}} is already in use.`);
    }

    const newUser = await prisma.user.create({
      data: userData,
    });
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
