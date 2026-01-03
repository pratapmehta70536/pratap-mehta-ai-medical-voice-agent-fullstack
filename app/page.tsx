"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      <Navbar />

      <div className="px-4 py-12 sm:py-16 md:py-24">
        {/* Heading */}
        <h1 className="mx-auto max-w-5xl text-center font-bold text-purple-700 text-2xl sm:text-3xl md:text-5xl lg:text-7xl">
          {"🩺 Transform Healthcare With AI Medical Voice Agent"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.08,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="mx-auto max-w-xl py-6 text-center text-sm sm:text-base md:text-lg text-neutral-600"
        >
          Provide 24/7 intelligent medical support using conversational AI.
          Deliver instant, accurate medical assistance with voice-first
          automation.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="mt-8 flex justify-center"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-green-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
              Get Started
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------------- NAVBAR ---------------- */

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="AI Medical Logo"
        width={110}
        height={50}
        className="rounded-lg"
      />

      {/* Right Section */}
      {!user ? (
        <Link href="/sign-in">
          <button className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm sm:text-base font-semibold text-white shadow-md transition hover:scale-105">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-3 sm:gap-5">
          <UserButton />
          <Link href="/dashboard">
            <Button className="rounded-xl cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-sm sm:text-base">
              Dashboard
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};
