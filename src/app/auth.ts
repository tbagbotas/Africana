import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Admin Login",

      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        if (
          typeof username !== "string" ||
          typeof password !== "string"
        ) {
          return null;
        }

        if (
          username !== process.env.ADMIN_USERNAME ||
          password !== process.env.ADMIN_PASSWORD
        ) {
          return null;
        }

        return {
          id: "admin",
          name: username,
          email: "admin@africana.local",
        };
      },
    }),
  ],

  pages: {
    signIn: "/admin/login",
  },

  secret: process.env.AUTH_SECRET,
});