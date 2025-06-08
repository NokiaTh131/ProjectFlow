import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./home.css";
import { MantineProvider } from "@mantine/core";

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

const ubuntuMono = Ubuntu_Mono({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProjectFlow",
  keywords: ["Next.js", "React", "Project Management", "App", "ProjectFlow"],
  description: "A web application for managing projects",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ubuntu.className} ${ubuntuMono.className} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
