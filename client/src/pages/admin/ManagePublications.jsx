import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_BASE_URL } from "../../config/apiBase";
import { withAdminAuth } from "../../utils/auth";
import { publicationCoverSrc, publicationFileHref } from "../../utils/publicationAssets";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm = () => ({
  title: "",
  description: "",
  issue_date: todayISO(),
});

export default function ManagePublications() {
  const [publications, setPublications] = useState([]);
  const [form, setForm] = useState(() => emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [imgFile, setImgFile] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/publications.php`);
      setPublications(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPublications([]);
    }
  };

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setDocFile(null);
    setImgFile(null);
    setFormKey((k) => k + 1);
  };

  const submitPublication = async (e) => {
    e.preventDefault();

    if (editingId == null && !docFile) {
      window.alert("Choose a publication file to upload.");
      return;
    }

    const fd = new FormData();
    fd.append("title", (form.title ?? "").trim());
    fd.append("description", (form.description ?? "").trim());
    fd.append("issue_date", form.issue_date ?? todayISO());
    if (docFile) fd.append("file", docFile);
    if (imgFile) fd.append("image", imgFile);

    try {
      if (editingId != null) {
        fd.append("id", String(editingId));
        await axios.post(`${API_BASE_URL}/update_publication.php`, fd, withAdminAuth());
      } else {
        await axios.post(`${API_BASE_URL}/add_publication.php`, fd, withAdminAuth());
      }
      resetForm();
      await fetchPublications();
    } catch (err) {
      const data = err.response?.data;
      const parts = [data?.message, data?.detail, data?.hint].filter(Boolean);
      window.alert(parts.join("\n\n") || err.message || "Could not save publication.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      issue_date: item.issue_date
        ? String(item.issue_date).slice(0, 10)
        : todayISO(),
    });
    setDocFile(null);
    setImgFile(null);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePublication = async (id) => {
    if (!window.confirm("Delete this publication?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/delete_publication.php?id=${id}`, withAdminAuth());
      if (editingId === id) resetForm();
      await fetchPublications();
    } catch (err) {
      window.alert(err.response?.data?.message || err.message || "Delete failed.");
    }
  };

  const formatIssueDate = (value) => {
    if (!value) return "—";
    try {
      const d = new Date(String(value).slice(0, 10) + "T12:00:00");
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(value);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-green-900 mb-8">Manage Publications</h1>

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <form key={formKey} onSubmit={submitPublication} className="space-y-5">
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-4 rounded-xl"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <div>
            <label htmlFor="pub-issue-date" className="block text-sm font-medium text-gray-700 mb-1">
              Issue date (when this publication is dated)
            </label>
            <input
              id="pub-issue-date"
              type="date"
              className="w-full max-w-xs border p-4 rounded-xl"
              value={form.issue_date}
              onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
              required
            />
          </div>

          <textarea
            placeholder="Description (optional)"
            className="w-full border p-4 rounded-xl min-h-[120px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publication file {editingId == null ? "(required)" : "(optional — leave empty to keep current)"}
            </label>
            <input
              type="file"
              className="w-full border p-4 rounded-xl"
              onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover image (optional — JPG, PNG, GIF, WebP)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
              className="w-full border p-4 rounded-xl"
              onChange={(e) => setImgFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-green-900 text-white px-6 py-4 rounded-xl hover:bg-green-700"
            >
              {editingId != null ? "Save changes" : "Add publication"}
            </button>
            {editingId != null && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 px-6 py-4 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publications.map((item) => {
          const img = publicationCoverSrc(item.image);
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col"
            >
              {img ? (
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  No cover image
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-gray-500 mb-1">
                  Issue date:{" "}
                  <span className="font-semibold text-green-900">{formatIssueDate(item.issue_date)}</span>
                </p>
                <p className="text-xs text-gray-400 mb-2">Saved: {formatDateTime(item.created_at)}</p>
                <h2 className="text-2xl font-bold text-green-900">{item.title}</h2>
                {item.description ? (
                  <p className="mt-3 text-gray-600 line-clamp-5 flex-1 whitespace-pre-wrap">
                    {item.description}
                  </p>
                ) : (
                  <p className="mt-3 text-gray-400 text-sm flex-1">No description</p>
                )}

                <a
                  href={publicationFileHref(item.file)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-blue-600 text-white px-5 py-3 rounded-xl text-center font-semibold hover:bg-blue-700"
                >
                  View publication file
                </a>

                <div className="flex flex-col gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="w-full bg-green-100 text-green-900 py-3 rounded-xl font-semibold hover:bg-green-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePublication(item.id)}
                    className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
