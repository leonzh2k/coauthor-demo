import process from "node:process";
import { OAuth2Client } from "google-auth-library";

const GoogleAuthService = () => {
  const extractUserId = async (jwt: string): Promise<string | null> => {};

  return {
    extractUserId,
  };
};

export default GoogleAuthService();
