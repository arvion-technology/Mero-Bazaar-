import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        const res = await fetch("http://localhost:3001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        console.log("LOGIN RESPONSE:", data);

        if (!res.ok || !data?.user) {
          throw new Error(data?.message || "Invalid credentials");
        }

        return {
          id: data.user.id,
          name: data.user.name ?? data.user.email.split("@")[0],
          email: data.user.email,
          role: data.user.role,
          accessToken: data.access_token,
        };
      }
    }),
  ],

  pages: {
    signIn: "/register",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name || user.email?.split("@")[0] || "User";
        token.role = user.role;
        token.accessToken = user.accessToken ?? token.accessToken;
      }
      if (account?.provider !== "credentials" && token.email && !token.role) {
        try {
          const res = await fetch(`http://localhost:3001/api/users/by-email?email=${token.email}`);
          if (res.ok) {
            const data = await res.json();
            token.role = data.role;
            token.id = data.id;
            token.accessToken = data.accessToken;
          }
        } catch {}
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
      session.user.id = (token.id as string) ?? "";
      session.user.name = (token.name as string) ?? "";
      session.user.role = token.role as string | undefined;
      }
      session.accessToken = (token.accessToken as string) || undefined;
      return session;
    },
  },
});