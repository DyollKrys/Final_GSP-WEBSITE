import PublicLayout from "../layouts/PublicLayout";

const latestIssue = {
  cover: "/assets/publications/coverpage.jpg",
  title: "Latest Issue 2026",
  description: "Discover the newest stories, achievements, and council highlights.",
  link: "https://online.fliphtml5.com/mhuzo/snwd/",
};

const archiveIssues = [
  {
    id: 1,
    cover: "/assets/publications/cover2.jpg",
    title: "January - June 2025",
    link: "https://online.fliphtml5.com/mhuzo/January-to-June-2025/",
  },
  {
    id: 2,
    cover: "/assets/publications/cover3.jpg",
    title: "RCM Special Issue",
    link: "https://online.fliphtml5.com/mhuzo/RCM-special-issue/",
  },
  {
    id: 3,
    cover: "/assets/publications/cover4.jpg",
    title: "Issue 2021",
    link: "https://online.fliphtml5.com/mhuzo/January-June-issue-2021/",
  },
  {
    id: 4,
    cover: "/assets/publications/cover5.jpg",
    title: "Issue 2022",
    link: "https://online.fliphtml5.com/mhuzo/January-June-issue-2022/",
  },
];

export default function Publications() {
  return (
    <PublicLayout>

      {/* ── HERO HEADER ── */}
      <header className="bg-green-900 text-white px-5 md:px-20 pt-12 pb-36 relative">
        <div className="max-w-5xl mx-auto text-center mt-10">
          <h1 className="text-6xl md:text-8xl font-medium italic tracking-tight leading-none">
            JJG-AWENG
          </h1>
          <p className="text-lg md:text-xl mt-4 font-light opacity-90">
            Official Publication of GSP Ilocos Norte-Laoag
          </p>
        </div>
      </header>

      {/* ── FLOATING LOGO BADGE ── */}
      <div className="flex justify-center -mt-20 relative z-10">
        <div className="bg-white p-3 rounded-full shadow-2xl">
          <img
            src="/assets/publications/gsp_logo.jpg"
            alt="GSP Logo Badge"
            className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover"
          />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-5xl mx-auto px-5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 items-start">

          {/* LEFT: LATEST ISSUE */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-8 text-center">
            <img
              src={latestIssue.cover}
              alt="Latest Issue Cover"
              className="w-auto max-w-full max-h-[500px] mx-auto mb-6 rounded-xl shadow-lg object-contain"
            />
            <h2 className="text-3xl font-bold italic mb-3 text-green-900">
              {latestIssue.title}
            </h2>
            <p className="text-gray-600 mb-5">{latestIssue.description}</p>
            <a
              href={latestIssue.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-900 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-full transition hover:-translate-y-0.5"
            >
              Read Now
            </a>
          </div>

          {/* RIGHT: ARCHIVE */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {archiveIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-4 transition hover:translate-x-1"
              >
                <img
                  src={issue.cover}
                  alt={issue.title}
                  className="w-28 md:w-36 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">
                    {issue.title}
                  </h3>
                  <a
                    href={issue.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-green-900 hover:text-green-700 transition"
                  >
                    Read →
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

    </PublicLayout>
  );
}