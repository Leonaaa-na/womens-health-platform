import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-pink-400">
              HerBloom
            </h2>

            <p className="mt-2 text-sm font-medium text-pink-300">
              Her health. Her journey. Her bloom.
            </p>

            <p className="mt-4 max-w-sm leading-7 text-gray-400">
              Supporting women with accessible health information,
              useful resources, health tools, and support throughout
              their health journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <Link
                to="/"
                className="text-gray-400 transition hover:text-pink-400"
              >
                Home
              </Link>

              <Link
                to="/about"
                className="text-gray-400 transition hover:text-pink-400"
              >
                About
              </Link>

              <Link
                to="/contact"
                className="text-gray-400 transition hover:text-pink-400"
              >
                Contact
              </Link>

              <Link
                to="/login"
                className="text-gray-400 transition hover:text-pink-400"
              >
                Login
              </Link>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold">
              Contact Us
            </h3>

            <div className="mt-4 space-y-3 text-gray-400">
              <p>📧 support@herbloom.com</p>
              <p>📞 +233 00 000 0000</p>
              <p>📍 Ghana</p>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-700"></div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">

          <p>
            ©️ 2026 HerBloom. All rights reserved.
          </p>

          <p>
            Her health. Her journey. Her bloom.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;