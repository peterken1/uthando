"use client";
import React from "react";
import LoveNoteGenerator from "@/components/LoveNoteGenerator";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { refreshProfile, profile } = useAuth();

  return (
    <main className="min-h-screen bg-pink-50 text-gray-900 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
      <div className="max-w-md mx-auto">


        <LoveNoteGenerator />
      </div>
    </main>
  );
}
