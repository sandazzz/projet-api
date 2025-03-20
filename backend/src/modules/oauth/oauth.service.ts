import prisma from "@lib/prisma";

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
