'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f0e8dc] border-t border-[#dcd3c5] text-[#1f1f1f]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-light text-[#1f1f1f] mb-3 uppercase tracking-[0.08em]">
              LILA CATERING
            </h3>
            <p className="text-[#4a4742] mb-4">
              Authentic Moroccan cuisine for your special occasions
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif text-[#1f1f1f] mb-3 uppercase tracking-[0.08em]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#4a4742] hover:text-[#1f1f1f] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#4a4742] hover:text-[#1f1f1f] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-[#4a4742] hover:text-[#1f1f1f] transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif text-[#1f1f1f] mb-3 uppercase tracking-[0.08em]">Contact</h4>
            <ul className="space-y-2 text-[#4a4742]">
              <li>Email: info@lilacatering.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Location: Your City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#dcd3c5] mt-8 pt-8 text-center text-[#6c655b] text-sm">
          <p>&copy; {currentYear} Lila Catering. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

