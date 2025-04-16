import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    isAdmin: boolean;
    phone?: string;
    address?: string;
  }

  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      phone?: string;
      address?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    id?: string;
    phone?: string;
    address?: string;
  }
}
