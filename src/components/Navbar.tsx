import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();

  const handleUserClick = () => {
    navigate("/period-tracker");
  };

  return (
    <nav className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* HerBloom Brand */}
        <Link
          to="/"
          className="text-2xl font-bold text-pink-600"
        >
          HerBloom
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 md:flex">

          <Link
            to="/"
            className="font-medium text-gray-700 transition hover:text-pink-600"
          >
            Home
          </Link>

          <Link
            to="/about"
            className="font-medium text-gray-700 transition hover:text-pink-600"
          >
            About
          </Link>

          <Link
            to="/contact"
            className="font-medium text-gray-700 transition hover:text-pink-600"
          >
            Contact
          </Link>

          {isAuthenticated && user ? (
            <button
              type="button"
              onClick={handleUserClick}
              className="font-semibold text-pink-600 transition hover:text-pink-700"
            >
              {user.firstName}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-700 transition hover:text-pink-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-pink-600 px-5 py-2.5 font-semibold text-white transition hover:bg-pink-700"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;