import PublicLayout from "../layouts/PublicLayout";

export default function Home() {
  return (
    <PublicLayout>

      {/* HERO */}
      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-32">

        <div className="max-w-7xl mx-auto px-5">

          <h1 className="text-6xl font-bold leading-tight">
            Girl Scouts of the Philippines
          </h1>

          <p className="text-2xl mt-5">
            Ilocos Norte – Laoag Council
          </p>

          <button className="bg-white text-green-900 px-8 py-4 rounded-2xl mt-10 text-xl font-semibold">
            Explore More
          </button>

        </div>

      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto py-20 px-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="bg-white p-10 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-900 mb-5">
              Programs
            </h2>

            <p>
              Discover leadership and youth programs.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-900 mb-5">
              Registration
            </h2>

            <p>
              Register your troop online quickly.
            </p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-900 mb-5">
              Shop
            </h2>

            <p>
              Order official merchandise for pickup.
            </p>
          </div>

        </div>

      </section>

    </PublicLayout>
  );
}