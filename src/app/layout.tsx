'use client';

import React, { useState, useEffect } from "react";
import "./globals.css";
import type { Metadata } from "next";

export const metadata = {
  title: "Mesa de Servicio - Frontend",
  description: "Frontend responsivo con modo toggle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen min-w-full bg-black text-white">
        {children}
      </body>
    </html>
  );
}
