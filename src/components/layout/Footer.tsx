import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-foreground text-white dark:bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-2xl font-bold">
              GOAT<span className="text-accent"> Movers</span>
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Professional moving services you can trust. Local and
              long-distance moves with care and precision.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#services" className="hover:text-white transition-colors">Local Moving</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Long Distance</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Packing & Unpacking</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Storage Solutions</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>(380) 524-0846</li>
              <li>info@goatmovers.com</li>
              <li>123 Moving St, New York, NY</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} GOAT Movers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
