import jwt from "jsonwebtoken";
import prisma from "@lib/prisma";

export function generateJWT(userId: number, email: string): string {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || "default_secret",
    { algorithm: "HS256", expiresIn: "1h" }
  );
}

export async function fetchGoogleUserInfo(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.json();
}

export async function fetchGitHubUserInfo(accessToken: string) {
  const response = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user = await response.json();

  // GitHub ne renvoie pas toujours l'email, donc on récupère une liste
  const emailResponse = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const emails = await emailResponse.json();
  const primaryEmail = emails.find((e: any) => e.primary)?.email || "";

  return { ...user, email: primaryEmail };
}

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
        lastName: userInfo.name?.split(" ")[1] || "User",
        passwordHash: "", // OAuth users don't have passwords
      },
    });
  }

  return user;
}
