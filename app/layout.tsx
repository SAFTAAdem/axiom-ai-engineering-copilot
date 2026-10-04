import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axiom — AI Software Engineering Copilot",
  description:
    "A governed multi-agent engineering operating system that turns raw requirements into delivery-ready software blueprints.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
