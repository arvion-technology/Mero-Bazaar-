import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import type { OAuthProfile } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

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
          twoFactorEnabled: data.user.twoFactorEnabled ?? false,
          accessToken: data.accessToken ?? data.access_token,
        };
      },
    }),
  ],

  pages: {
    signIn: "/register",
  },

  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name;
        token.picture = session.image ?? token.picture;
        token.phone = session.phone ?? token.phone;
        token.address = session.address ?? token.address;
        token.twoFactorEnabled = session.user?.twoFactorEnabled ?? session.twoFactorEnabled ?? token.twoFactorEnabled;
        return token;
      }
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken ?? token.accessToken;      
        token.phone = user.phone ?? null;
        token.address = user.address ?? null;
        token.provider = "credentials";
        token.twoFactorEnabled = user.twoFactorEnabled ?? false;
      }
      if (account && account.provider !== "credentials") {
        const p = profile as OAuthProfile;

        const email = p?.email ?? token.email;
        const name = p?.name ?? token.name;
        const image = 
          account.provider === "facebook"
            ? (typeof p?.picture === "object" ? p.picture?.data?.url : undefined)
            : (typeof p?.picture === "string" ? p.picture : p?.image) ?? (token.picture as string | undefined);

        if (email) {
          const cookieStore = await cookies();
          const headerList = await headers();
          const pendingRole = cookieStore.get("pending_role")?.value;
          const role = pendingRole === "VENDOR" ? "VENDOR" : "USER";
          const userAgent = headerList.get("user-agent") ?? undefined;
          const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
          const res = await fetch(
            "http://localhost:3001/api/user/oauth-sync",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, name, image, role, userAgent, ipAddress }),
            }
          );

          const dbUser = await res.json();
          if (!res.ok) {
            console.error("oauth-sync failed", account.provider, dbUser);
          } else {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.phone = dbUser.phone ?? null;       
          token.address = dbUser.address ?? null;
          token.picture = dbUser.image ?? image;
          token.provider = account.provider;
          token.accessToken = dbUser.accessToken ?? dbUser.access_token ?? token.accessToken;
          token.twoFactorEnabled = dbUser.twoFactorEnabled ?? false;
        }
      } else {
        console.error(`No email from ${account.provider} profile`, p);
      }
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
        session.user.provider = token.provider as string;
        session.user.twoFactorEnabled =token.twoFactorEnabled as boolean;
      }
      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});