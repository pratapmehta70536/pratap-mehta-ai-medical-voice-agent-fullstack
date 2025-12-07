"use client";

import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="relative my-10 flex flex-col items-center justify-center">
      <Navbar />
      
      
      
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-purple-700 md:text-4xl lg:text-7xl dark:text-slate-950">
          {"🩺Transform  Healthcare  With  AI  Medical  Voice  Agent"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: "easeInOut" }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <br />
        <br />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Provide 24/7 intellignet medical support using conversational AI. Deliver instant, accurate medical assistance, triage symptoms, deliver empathetic care with voice-first automation.<span className="text-red-500 text-2xl">Practically tested</span> AI based <span className="text-red-500 text-2xl">user choice medical platform.</span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex items-center justify-center"
        >
          <button className="px-8 py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl">
            Get Started
          </button>
        </motion.div>
        
        
      </div>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between  px-4 ">
      <div className="flex items-center gap-2">
       <img src="/logo.png" alt="AI Medical Logo" className="w-30 h-25 rounded-lg"/>
      </div>
      
      <div className="flex items-center gap-2"></div>
      <button className="w-28 rounded-xl px-6 py-3 mb-10 font-semibold bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md hover:scale-105 transition-all duration-300">
        Login
      </button>
    </nav>
  );
};
