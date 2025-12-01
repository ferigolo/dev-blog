import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { UserProvider } from "@/context/user-context";
import getAuthenticatedUser from "@/utils/get-authenticated-user";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Define a URL base para resolver imagens relativas (obrigatório para OG Images)
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),

  title: {
    default: "Dev Blog - Enzo Ferigolo",
    template: "%s | Dev Blog",
  },
  description: "Um blog sobre desenvolvimento, Python, Next.js, Carreira e Ciência da Computação.",

  // Open Graph (Facebook, LinkedIn, Discord)
  openGraph: {
    title: "Dev Enzo Ferigolo",
    description: "Aprendizados sobre tecnologia e carreira.",
    url: "/",
    siteName: "Dev Enzo Ferigolo",
    locale: "pt_BR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthenticatedUser()
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-16`}
      >
        <UserProvider user={user}>
          <Navbar></Navbar>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
