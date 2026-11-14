'use client';

import React from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen min-w-full bg-black text-white">
        {children}
      </body>
    </html>
  );
}
