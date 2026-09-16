import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },

        adminLogin: {
          label: "Admin Login",
          type: "text",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email)
          .trim()
          .toLowerCase();

        const password = String(credentials.password);

        const isAdminLogin =
          String(credentials.adminLogin || "false") === "true";

        await connectDB();

        const user = await User.findOne({ email }).lean();

        if (!user) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatches) {
          return null;
        }

        /*
         * Admin login can only be performed by an admin.
         */
        if (isAdminLogin && user.role !== "admin") {
          return null;
        }

        /*
         * Normal student login cannot be used by an admin.
         */
        if (!isAdminLogin && user.role !== "student") {
          return null;
        }

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const user = session.user as typeof session.user & {
          id: string;
          role?: string;
        };

        user.id = String(token.id);
        user.role = typeof token.role === "string" ? token.role : "";
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
};