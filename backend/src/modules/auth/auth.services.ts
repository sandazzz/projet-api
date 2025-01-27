import prisma from "@lib/prisma";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  // Recherche de l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return null; // Authentification échouée
  }
  
  return user; // Authentification réussie
}
