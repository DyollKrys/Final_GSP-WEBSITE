import PublicLayout from "../layouts/PublicLayout";

export default function Publications() {
  const publications = [
    {
      title: "GSP Handbook",
      file: "#",
    },
    {
      title: "Annual Report 2026",
      file: "#",
    },
  ];

  return (
    <PublicLayout>

      <div className="max-w-6xl mx-auto py-20 px-5">

        <h1 className="text-5xl font-bold text-green-900 mb-12">
          Publications
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {publications.map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-green-900 mb-5">
                {item.title}
              </h2>

              <a
                href={item.file}
                className="bg-blue-600 text-white px-5 py-3 rounded-xl inline-block"
              >
                Download
              </a>
            </div>
          ))}

        </div>

      </div>

    </PublicLayout>
  );
}