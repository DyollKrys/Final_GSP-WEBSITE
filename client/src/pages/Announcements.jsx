import PublicLayout from "../layouts/PublicLayout";

export default function Announcements() {
  const announcements = [
    {
      title: "Camping Event 2026",
      content:
        "Join our annual camping event this summer.",
    },
    {
      title: "Leadership Seminar",
      content:
        "Leadership seminar registration is now open.",
    },
  ];

  return (
    <PublicLayout>

      <div className="max-w-6xl mx-auto py-20 px-5">

        <h1 className="text-5xl font-bold text-green-900 mb-12">
          Announcements
        </h1>

        <div className="space-y-8">

          {announcements.map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                {item.title}
              </h2>

              <p className="text-gray-700">
                {item.content}
              </p>
            </div>
          ))}

        </div>

      </div>

    </PublicLayout>
  );
}