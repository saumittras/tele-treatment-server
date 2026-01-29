import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expires_in_accesstoken: process.env
      .JWT_EXPIRES_IN_ACCESTOKEN as SignOptions["expiresIn"],
    expires_in_refresstoken: process.env
      .JWT_EXPIRES_IN_REFRESSTOKEN as SignOptions["expiresIn"],
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};
