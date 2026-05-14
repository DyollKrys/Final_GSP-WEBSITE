import PublicLayout from "../layouts/PublicLayout";

export default function About() {
  return (
    <PublicLayout>

      <div className="max-w-6xl mx-auto py-20 px-5">

        <h1 className="text-5xl font-bold text-green-900 mb-10">
          About Us
        </h1>

        <div className="bg-white p-10 rounded-3xl shadow-lg">

          <p className="text-lg leading-10 text-gray-700">
            The Girl Scouts of the Philippines –
            Ilocos Norte Laoag Council is dedicated
            to empowering girls through leadership,
            service, and community involvement.
          </p>

        </div>

      </div>

    </PublicLayout>
  );
}