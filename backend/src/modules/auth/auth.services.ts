import prisma from "@lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

// 🔹 Fonction pour générer un JWT
export function generateJWT(userId: number, email: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables.");
  }
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
}

// 🔹 Récupération des infos utilisateur Google
export async function getGoogleUserInfo(accessToken: string) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("🔍 Google API Response Status:", response.status);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("🚨 Google API Error Details:", errorDetails);
      throw new Error("Failed to fetch Google user info");
    }

    const userInfo = await response.json();
    console.log("🔍 Google User Info:", userInfo);
    return userInfo;
  } catch (error) {
    console.error("🚨 Error in fetchGoogleUserInfo:", error);
    throw error;
  }
}

// 🔹 Récupération des infos utilisateur GitHub
export async function getGitHubUserInfo(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user info");
  }
  const user = await response.json();
  const emailResponse = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!emailResponse.ok) {
    throw new Error("Failed to fetch GitHub user emails");
  }
  const emails = await emailResponse.json();
  const primaryEmail =
    emails.find((e: any) => e.primary && e.verified)?.email || "";
  return { ...user, email: primaryEmail };
}

// 🔹 Fonction pour trouver ou créer un utilisateur en base de données
export async function findOrCreateUser(userInfo: {
  email: string;
  name?: string;
}) {
  if (!userInfo.email) throw new Error("No email found from provider");
  let user = await prisma.user.findUnique({ where: { email: userInfo.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userInfo.email,
        firstName: userInfo.name?.split(" ")[0] || "Unknown",
        lastName: userInfo.name?.split(" ")[1] || "Unknown lastname",
        passwordHash: "",
      },
    });
  }
  return user;
}
