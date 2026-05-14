import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">

      <Navbar />

      <main>
        {children}
      </main>

      <Footer />

    </div>
  );
}