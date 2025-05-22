// frontend/src/pages/index.js
import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e1013] text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-tight">IA Upscaler</h1>
        <Link
          href="/login"
          className="text-sm text-white border px-4 py-1.5 rounded hover:bg-white hover:text-black transition"
        >
          Log In
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl sm:text-5xl font-bold max-w-3xl leading-tight mb-6">
          Enhance your images with AI precision
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Upscale and sharpen your images in seconds. Just drag and drop, and let AI do the rest.
        </p>
        <Link
          href="/enhance"
          className="bg-white text-black px-6 py-3 rounded text-lg font-medium hover:bg-gray-200 transition"
        >
          Try it now
        </Link>
      </main>

      {/* Examples Section */}
      <section className="bg-[#121417] py-16 px-6">
        <h3 className="text-2xl font-semibold mb-8 text-center">Examples</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-black rounded-lg overflow-hidden border border-gray-700">
            <img src="/examples/example1.jpg" alt="Example 1" className="w-full h-auto" />
          </div>
          <div className="bg-black rounded-lg overflow-hidden border border-gray-700">
            <img src="/examples/example2.jpg" alt="Example 2" className="w-full h-auto" />
          </div>
          <div className="bg-black rounded-lg overflow-hidden border border-gray-700">
            <img src="/examples/example3.jpg" alt="Example 3" className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t border-gray-800">
        © 2025 IA Upscaler. All rights reserved.
      </footer>
    </div>
  );
}