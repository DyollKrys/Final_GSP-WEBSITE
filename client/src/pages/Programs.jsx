import PublicLayout from "../layouts/PublicLayout";

export default function Programs() {
  const programs = [
    {
      title: "Leadership Training",
      description:
        "Develop leadership and teamwork skills.",
    },
    {
      title: "Community Service",
      description:
        "Participate in outreach and volunteer activities.",
    },
    {
      title: "Outdoor Adventures",
      description:
        "Camping, hiking, and survival activities.",
    },
  ];

  return (
    <PublicLayout>

      <div className="max-w-7xl mx-auto py-20 px-5">

        <h1 className="text-5xl font-bold text-green-900 mb-12">
          Programs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-green-900 mb-5">
                {program.title}
              </h2>

              <p className="text-gray-600">
                {program.description}
              </p>
            </div>
          ))}

        </div>

      </div>

    </PublicLayout>
  );
}