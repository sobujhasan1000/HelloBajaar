// app/components/Footer.jsx
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-5 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">Hello Bajar</h2>
          <p className="text-sm">
            Best quality products at the best price. We deliver across
            Bangladesh.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/cart" className="hover:text-white">
                Cart
              </a>
            </li>
            <li>
              <a href="/checkout" className="hover:text-white">
                Checkout
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">📍 Dhaka, Bangladesh</p>
          <p className="text-sm"> and</p>
          <p className="text-sm">📍 Natore, Bangladesh</p>
          <p className="text-sm">📞 +880 01849-666237</p>
          <p className="text-sm">✉ hellobajar@gmail.com</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/HelloBajaar"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-700 hover:bg-blue-600 rounded-full"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-700 hover:bg-pink-600 rounded-full"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-700 hover:bg-blue-400 rounded-full"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-700 hover:bg-blue-700 rounded-full"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-5">
        © {new Date().getFullYear()} YourShop. All rights reserved.
      </div>
    </footer>
  );
}
