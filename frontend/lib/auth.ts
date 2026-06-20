import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import type { OAuthProfile } from "next-auth/jwt";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Facebook({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const res = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok || !data?.user) return null;

        return {
          id: data.user.id,
          name: data.user.name ?? data.user.email.split("@")[0],
          email: data.user.email,
          role: data.user.role,
          accessToken: data.accessToken ?? data.access_token,
        };
      },
    }),
  ],

  pages: {
    signIn: "/register",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
        token.role = user.role;
        token.accessToken = user.accessToken ?? token.accessToken;      
        token.phone = user.phone ?? undefined;
        token.address = user.address ?? undefined;
      }
      if (account && account.provider !== "credentials") {
        const p = profile as OAuthProfile;

        const email = p?.email ?? token.email;
        const name = p?.name ?? token.name;
        const image = p?.picture ?? p?.image ?? token.picture;

        if (email) {
          const cookieStore = await cookies();
          const pendingRole = cookieStore.get("pending_role")?.value;
          const role = pendingRole === "VENDOR" ? "VENDOR" : "USER";
          const res = await fetch(
            "http://localhost:3001/api/user/oauth-sync",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name, image, role }),
            }
          );

          const dbUser = await res.json();

          token.id = dbUser.id;
          token.role = dbUser.role;
          token.phone = dbUser.phone ?? null;       
          token.address = dbUser.address ?? null;
          token.accessToken = dbUser.accessToken ?? dbUser.access_token ?? token.accessToken;
        }

        token.picture = image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.image = token.picture ?? session.user.image;
        session.user.phone = (token.phone as string) ?? null;
        session.user.address = (token.address as string) ?? null;
      }
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});