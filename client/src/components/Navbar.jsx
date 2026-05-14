import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-green-900 text-white shadow-lg">

      <div className="max-w-7xl mx-auto flex justify-between items-center p-5">

        <h1 className="text-2xl font-bold">
          GSP Laoag Council
        </h1>

        <div className="flex gap-6">

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/programs">Programs</Link>
          <Link to="/announcements">Announcements</Link>
          <Link to="/publications">Publications</Link>
          <Link to="/forms">Forms</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/contact">Contact</Link>

        </div>

        <div className="flex gap-3">

          <Link
            to="/login"
            className="border border-white px-4 py-2 rounded-xl"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-white text-green-900 px-4 py-2 rounded-xl"
          >
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}