import { Link } from "react-router-dom";
import gspLogo from "./gsp_logo.jpg";

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white mt-20">

      <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <div className="flex items-start gap-3 mb-4">
            <Link
              to="/"
              className="shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-green-950"
              aria-label="Go to home page"
            >
              <img
                src={gspLogo}
                alt=""
                className="h-12 w-auto rounded-full"
              />
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight text-left">
              GSP Ilocos Norte - Laoag Council
            </h2>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Quick Links
          </h2>

          <nav className="space-y-2">
            <Link to="/" className="block hover:underline">
              Home
            </Link>
            <Link to="/about" className="block hover:underline">
              About
            </Link>
            <Link to="/publications" className="block hover:underline">
              Publications
            </Link>
            <Link to="/forms" className="block hover:underline">
              Forms
            </Link>
            <Link to="/shop" className="block hover:underline">
              Shop
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Contact
          </h2>

          <div className="space-y-2 text-base">
            <p className="flex items-center gap-2">
              <img
                src="/mail.png"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 shrink-0 object-contain"
                aria-hidden
              />
              <span>gsp_inlaoag@yahoo.com</span>
            </p>
            <p className="flex items-center gap-2">
              <img
                src="/location.png"
                alt=""
                width={16}
                height={16}
                className="h-4 w-4 shrink-0 object-contain"
                aria-hidden
              />
              <span>Brgy 23 P. Paterno St., Laoag</span>
            </p>
          </div>
        </div>

      </div>

    </footer>
  );
}