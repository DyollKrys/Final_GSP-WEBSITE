export default function Footer() {
  return (
    <footer className="bg-green-950 text-white mt-20">

      <div className="max-w-7xl mx-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <h1 className="text-2xl font-bold mb-4">
            GSP Laoag Council
          </h1>

          <p>
            Girl Scouts of the Philippines –
            Ilocos Norte Laoag Council
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Quick Links
          </h2>

          <div className="space-y-2">
            <a href="/about" className="block hover:underline">
              About
            </a>
            <a href="/shop" className="block hover:underline">
              Shop
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">
            Contact
          </h2>

     
          <p>Email: gsp_inlaoag@yahoo.com</p>
          <p>Brgy 23 P. Paterno St., Laoag</p>
        </div>

      </div>

    </footer>
  );
}