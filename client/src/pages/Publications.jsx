import { useEffect, useState } from "react";
import axios from "axios";
import PublicLayout from "../layouts/PublicLayout";
import { API_BASE_URL } from "../config/apiBase";
import { publicationCoverSrc, publicationFileHref } from "../utils/publicationAssets";

const PLACEHOLDER_COVER = "/assets/publications/coverpage.jpg";

/** Long readable date for the featured issue (matches announcement-style cards). */
function formatIssueLong(value) {
  if (!value) return null;
  try {
    const d = new Date(String(value).slice(0, 10) + "T12:00:00");
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function formatIssueShort(value) {
  if (!value) return null;
  try {
    const d = new Date(String(value).slice(0, 10) + "T12:00:00");
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

const ARCHIVE_PREVIEW_COUNT = 4;

export default function Publications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllArchive, setShowAllArchive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/publications.php`);
        const data = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const latest = items[0];
  const archive = items.slice(1);
  const archiveHasMore = archive.length > ARCHIVE_PREVIEW_COUNT;
  const archiveToShow =
    showAllArchive || !archiveHasMore ? archive : archive.slice(0, ARCHIVE_PREVIEW_COUNT);

  const latestCover = latest ? publicationCoverSrc(latest.image) : null;
  const latestDocHref = latest ? publicationFileHref(latest.file) : null;
  const latestIssueLabel = latest ? formatIssueLong(latest.issue_date) : null;

  return (
    <PublicLayout>
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

      <div className="flex justify-center -mt-20 relative z-10">
        <div className="bg-white p-3 rounded-full shadow-2xl">
          <img
            src="/assets/publications/gsp_logo.jpg"
            alt="GSP Logo Badge"
            className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover"
          />
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-5 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 items-start">
          {/* LEFT: latest issue — enlarged when an article exists; placeholder keeps layout */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md p-8 md:p-10 text-center">
            {loading ? (
              <div className="py-16 text-gray-500">Loading…</div>
            ) : latest ? (
              <>
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 min-h-[220px] flex items-center justify-center">
                  {latestCover ? (
                    <img
                      src={latestCover}
                      alt=""
                      className="w-auto max-w-full max-h-[min(640px,72vh)] mx-auto rounded-xl shadow-lg object-contain"
                    />
                  ) : (
                    <img
                      src={PLACEHOLDER_COVER}
                      alt=""
                      className="w-auto max-w-full max-h-[min(640px,72vh)] mx-auto rounded-xl shadow-lg object-contain opacity-90"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
                {latestIssueLabel ? (
                  <p className="text-sm font-semibold text-green-800 mb-2 tracking-wide uppercase">
                    {latestIssueLabel}
                  </p>
                ) : null}
                <h2 className="text-4xl md:text-5xl font-bold italic mb-3 text-green-900 leading-tight">
                  {latest.title}
                </h2>
                {latest.description ? (
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed whitespace-pre-wrap">
                    {latest.description}
                  </p>
                ) : (
                  <p className="text-gray-500 mb-6 text-base">
                    Council publication — open the file below to read this issue.
                  </p>
                )}
                <a
                  href={latestDocHref ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-900 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-full transition hover:-translate-y-0.5"
                >
                  Read Now
                </a>
              </>
            ) : (
              <>
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 min-h-[220px] flex items-center justify-center">
                  <img
                    src={PLACEHOLDER_COVER}
                    alt=""
                    className="w-auto max-w-full max-h-[min(520px,60vh)] mx-auto rounded-xl shadow-lg object-contain opacity-80"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold italic mb-3 text-green-900 leading-tight">
                  Latest issue
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  New issues will appear here when the council posts them. Check back soon or contact the office.
                </p>
              </>
            )}
          </div>

          {/* RIGHT: archive list — original row layout */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {!loading && archive.length === 0 ? (
              <p className="text-gray-500 text-sm bg-white rounded-2xl shadow-md p-6">
                {latest
                  ? "No older issues in the archive yet."
                  : "Archive issues will list here once more than one publication is posted."}
              </p>
            ) : null}
            {archiveToShow.map((issue) => {
              const thumb = publicationCoverSrc(issue.image);
              const href = publicationFileHref(issue.file);
              const shortDate = formatIssueShort(issue.issue_date);
              return (
                <div
                  key={issue.id}
                  className="flex items-center gap-4 bg-white rounded-2xl shadow-md p-4 transition hover:translate-x-1"
                >
                  <div className="w-28 md:w-36 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {thumb ? (
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={PLACEHOLDER_COVER}
                        alt=""
                        className="w-full h-full object-cover opacity-70"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    {shortDate ? (
                      <p className="text-xs text-gray-500 mb-1 font-medium">{shortDate}</p>
                    ) : null}
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base line-clamp-2">
                      {issue.title}
                    </h3>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-green-900 hover:text-green-700 transition"
                    >
                      Read →
                    </a>
                  </div>
                </div>
              );
            })}
            {archiveHasMore ? (
              <button
                type="button"
                onClick={() => setShowAllArchive((v) => !v)}
                className="w-full rounded-2xl border-2 border-green-900 bg-white py-3 text-center text-sm font-bold text-green-900 shadow-md transition hover:bg-green-50"
              >
                {showAllArchive ? "Show fewer articles" : "Show all articles"}
              </button>
            ) : null}
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
