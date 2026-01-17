"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Zap,
  Share2,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black dark:bg-white rounded-lg flex items-center justify-center p-1 ring-1 ring-white/20 dark:ring-black/20">
              <img
                src="/CoreNoteLogo.svg"
                alt="CoreNote"
                className="w-7 h-7 brightness-0 invert"
              />
            </div>
            <span className="font-semibold text-xl text-gray-900 dark:text-white">
              CoreNote
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-zinc-800 rounded-full text-sm text-gray-600 dark:text-gray-300 mb-6">
              <Sparkles className="w-4 h-4" />
              Your notes, supercharged
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6"
          >
            Write. Think.
            <br />
            <span className="text-gray-400 dark:text-zinc-500">Organize.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            A minimal, powerful workspace for your notes, docs, and thoughts.
            Built for clarity and speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Learn more
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-2xl">
            <div className="bg-gray-100 dark:bg-zinc-900 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center text-sm text-gray-500 dark:text-gray-400">
                CoreNote
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-950 p-8 min-h-[300px]">
              <div className="flex gap-6">
                {/* Sidebar Preview */}
                <div className="w-48 flex-shrink-0 border-r border-gray-100 dark:border-zinc-800 pr-6">
                  <div className="text-xs text-gray-400 dark:text-zinc-500 mb-3 font-medium">
                    WORKSPACE
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded text-sm">
                      <span>📝</span> Getting Started
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                      <span>📚</span> Reading List
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 text-gray-600 dark:text-gray-400 text-sm">
                      <span>💡</span> Project Ideas
                    </div>
                  </div>
                </div>
                {/* Content Preview */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Getting Started
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Welcome to CoreNote! Start typing to create your first
                    note...
                  </p>
                  <div className="text-gray-400 dark:text-zinc-600">
                    Type{" "}
                    <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-sm font-mono">
                      /
                    </span>{" "}
                    for commands...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-6 py-20 bg-gray-50 dark:bg-zinc-900/50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A clean, focused writing experience with powerful features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Instant page loads and real-time sync across all your devices.",
              },
              {
                icon: FileText,
                title: "Rich Editor",
                description:
                  "Headings, code blocks, quotes, lists - format with simple / commands.",
              },
              {
                icon: Share2,
                title: "Nested Pages",
                description:
                  "Organize infinitely with pages inside pages. No folder limits.",
              },
              {
                icon: Lock,
                title: "Private & Secure",
                description:
                  "Your data stays yours. End-to-end security for all your notes.",
              },
              {
                icon: Sparkles,
                title: "Minimal Design",
                description:
                  "Clean interface that gets out of your way. Just you and your thoughts.",
              },
              {
                icon: CheckCircle,
                title: "Free Forever",
                description:
                  "Core features free forever. No trials, no credit card required.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to organize your thoughts?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Join thousands of writers, developers, and thinkers who use CoreNote
            to capture ideas and stay organized.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
          >
            Get Started — It's Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-gray-100 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-7 h-7 bg-black dark:bg-white rounded-md flex items-center justify-center p-0.5 ring-1 ring-white/20 dark:ring-black/20">
              <img
                src="/CoreNoteLogo.svg"
                alt="CoreNote"
                className="w-5 h-5 brightness-0 invert"
              />
            </div>
            <span className="font-medium">CoreNote</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} CoreNote. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
