import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline Component Demo",
  description: "Demo of the timeline component using Next.js and shadcn",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
