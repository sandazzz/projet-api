import dotenv from "dotenv";
dotenv.config();

const requiredVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "JWT_SECRET",
];

for (const key of requiredVars) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key} in environment variables.`);
  }
}

export const env = {
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  githubClientId: process.env.GITHUB_CLIENT_ID!,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET!,
  jwtSecret: process.env.JWT_SECRET!,
  cookieSecret: process.env.COOKIE_SECRET || "default_cookie_secret",
  isProd: process.env.NODE_ENV === "production",
};
