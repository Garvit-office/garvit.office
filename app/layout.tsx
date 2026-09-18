import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Garvit Chawla | Interactive Office",
  description: "An interactive comic-noir portfolio office for Garvit Chawla.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
