import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    accessToken?: string;
    phone?: string | null;
    address?: string | null;
    twoFactorEnabled?: boolean;
    provider?: string;
    oauthImage?: string;
    dbUser?: {
      id: string;
      name?: string;
      role: string;
      phone?: string | null;
      address?: string | null;
      image?: string;
      accessToken?: string;
      access_token?: string;
      twoFactorEnabled?: boolean;
    };
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string | null;
      address?: string | null;
      role?: string;
      provider?: string;
      twoFactorEnabled?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    accessToken?: string;
    email?: string;
    name?: string;
    picture?: string;
    phone?: string | null;
    address?: string | null;
    provider?: string;
    twoFactorEnabled?: boolean;
  }

  type OAuthProfile = {
    email?: string;
    name?: string;
    image?: string;
    picture?: string | { data?: { url?: string } };
    phone?: string | null;
    address?: string | null;
  };
}