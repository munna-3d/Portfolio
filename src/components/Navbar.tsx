"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Experience", href: "/#experience" },
    { name: "Projects", href: "/#projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-[90] transition-all duration-300 ${
          isScrolled 
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 py-3" 
            : "bg-transparent py-5"
        } px-6 md:px-12 flex items-center justify-between pointer-events-none`}
      >
        <div className="flex-1 pointer-events-auto">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              M
            </div>
            <span className="text-xl font-bold tracking-tighter text-white group-hover:text-pink-400 transition-colors hidden sm:block">
              MUNNA
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center justify-center gap-8 pointer-events-auto bg-black/40 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href || (pathname === '/' && link.href === '/')
                  ? "text-pink-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex justify-end pointer-events-auto items-center gap-6">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white bg-black/50 border border-white/10 rounded-full backdrop-blur-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[85] bg-[#121212]/95 backdrop-blur-2xl flex items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-full text-center"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-3xl font-black tracking-tighter transition-colors ${
                      pathname === link.href
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400"
                        : "text-white hover:text-pink-400"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
