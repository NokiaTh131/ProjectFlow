import type { Metadata } from "next";
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
import "./home.css";
import { MantineProvider } from "@mantine/core";
import { ThemeProvider } from "./contexts/ThemeContext";

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
      <body className={`${ubuntu.className} ${ubuntuMono.className}`}>
        <ThemeProvider>
          <MantineProvider>
            {children}
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
