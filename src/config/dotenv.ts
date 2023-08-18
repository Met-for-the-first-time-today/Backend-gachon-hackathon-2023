import "dotenv/config";

export const SECRET_KEY =
  process.env.SECERT_KEY || "Need to set secret key in .env file.";
export const PORT = process.env.PORT || 3000;
