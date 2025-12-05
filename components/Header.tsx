"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { usePathname } from 'next/navigation';
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isOpen &&
        !target.closest("#mobile-menu") &&
        !target.closest('button[aria-controls="mobile-menu"]')
      ) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Prevent body scrolling when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [handleClickOutside, handleEscape, isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex justify-between h-16 sm:h-18 md:h-20 items-center w-full">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex-shrink-0 w-[55px] sm:w-[62px] md:w-[70px] h-10 sm:h-[45px] md:h-[50px] relative">
              <Image
                src="/logo2.png"
                alt="Global Games Logo"
                fill
                priority     
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-extrabold text-black bg-clip-text hidden sm:block transition-all duration-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600">
              Global Games
            </span>
          </Link>

          <nav className="hidden xl:flex items-center ml-auto">
            <ul className="flex flex-wrap space-x-4 lg:space-x-6 items-center">
              {[
                { href: "/", label: "Home" },
                { href: "/games", label: "Games" },
                { href: "/top-games", label: "Top Games" },
                { href: "/blogs", label: "Blogs" },
                { href: "/faq", label: "FAQ" },
                { href: "/developer", label: "Developer" },
                { href: "/affiliate", label: "Affiliate" },
                { href: "/about", label: "About Us" },
                { href: "/contact-us", label: "Contact Us" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative px-3 py-2.5 text-[16px] font-medium transition-colors duration-200 group flex items-center ${
                      pathname === href 
                        ? 'text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <span className="relative">
                      {label}
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full ${
                        pathname === href ? 'w-full' : ''
                      }`}></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="xl:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMenu}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-16 left-0 right-0 z-[999999] bg-white shadow-lg overflow-hidden"
            id="mobile-menu"
          >
            <motion.div 
              className="px-2 pt-2 pb-4 space-y-1 sm:px-3 "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {[
              { href: "/", label: "Home" },
              { href: "/games", label: "Games" },
              { href: "/blogs", label: "Blogs" },
              { href: "/top-games", label: "Top Games" },
              { href: "/faq", label: "FAQ" },
              { href: "/developer", label: "Developer" },
              { href: "/affiliate", label: "Affiliate" },
              { href: "/about", label: "About Us" },
              { href: "/contact-us", label: "Contact Us" },
              ].map(({ href, label }, index) => (
                <motion.div
                  key={href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={href}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
