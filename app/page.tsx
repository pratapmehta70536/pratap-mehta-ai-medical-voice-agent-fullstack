"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative my-10 flex flex-col items-center justify-center">
      <Navbar />

      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-purple-700 md:text-4xl lg:text-7xl">
          {"🩺 Transform Healthcare With AI Medical Voice Agent"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-6 text-center text-lg text-neutral-600"
        >
          Provide 24/7 intelligent medical support using conversational AI.
          Deliver instant, accurate medical assistance with voice-first
          automation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex justify-center"
        >
          <Link href="/sign-in">
            <button className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105">
              Get Started
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="flex w-full items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="AI Medical Logo"
          width={120}
          height={60}
          className="rounded-lg"
        />
      </div>

      {!user ? (
        <Link href="/sign-in">
          <button className="mb-10 w-28 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-105">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-5">
          <UserButton />
          <Button>Dashboard</Button>
        </div>
      )}
    </nav>
  );
};
