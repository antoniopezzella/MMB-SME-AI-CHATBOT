import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PipelineAI — Visual Data Pipeline Builder",
  description: "Build, connect, and run data pipelines visually with drag-and-drop nodes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[var(--canvas-bg)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
