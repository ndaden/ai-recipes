import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Recipes",
  description: "Generate recipes from your ingredients with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>AI Recipes</title>
        <meta
          name="description"
          content="Find recipes from your ingredients using AI"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
