import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    accessToken?: string;
    phone?: string | null;n
    address?: string | null;
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