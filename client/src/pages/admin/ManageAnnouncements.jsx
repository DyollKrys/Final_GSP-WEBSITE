import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'
import { API_BASE_URL } from '../../config/apiBase'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const emptyForm = () => ({
  title: '',
  content: '',
  event_date: todayISO(),
})

export default function ManageAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState(() => emptyForm())
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const res = await axios.get(`${API_BASE_URL}/announcements.php`)
    setAnnouncements(Array.isArray(res.data) ? res.data : [])
  }

  const resetForm = () => {
    setForm(emptyForm())
    setEditingId(null)
  }

  const submitAnnouncement = async (e) => {
    e.preventDefault()

    const payload = {
      title: (form.title ?? '').trim(),
      content: (form.content ?? '').trim(),
      event_date: form.event_date ?? '',
    }

    try {
      if (editingId != null) {
        await axios.put(`${API_BASE_URL}/update_announcement.php`, {
          id: editingId,
          ...payload,
        })
      } else {
        await axios.post(`${API_BASE_URL}/add_announcement.php`, payload)
      }
      resetForm()
      await fetchAnnouncements()
    } catch (err) {
      const data = err.response?.data
      const parts = [
        data?.message,
        data?.detail,
        data?.hint,
      ].filter(Boolean)
      window.alert(parts.join('\n\n') || err.message || 'Could not save announcement.')
    }
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    const d = item.event_date
      ? String(item.event_date).slice(0, 10)
      : todayISO()
    setForm({
      title: item.title,
      content: item.content,
      event_date: d,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteAnnouncement = async (id) => {
    if (!window.confirm('Delete this announcement?')) return
    await axios.delete(`${API_BASE_URL}/delete_announcement.php?id=${id}`)
    if (editingId === id) resetForm()
    fetchAnnouncements()
  }

  const formatDateTime = (value) => {
    if (!value) return '—'
    try {
      return new Date(value).toLocaleString()
    } catch {
      return value
    }
  }

  const formatEventDate = (value) => {
    if (!value) return '—'
    try {
      const d = new Date(String(value).slice(0, 10) + 'T12:00:00')
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return String(value)
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Manage Announcements
      </h1>

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <form onSubmit={submitAnnouncement} className="space-y-5">
          <div>
            <label htmlFor="ann-event-date" className="block text-sm font-medium text-gray-700 mb-1">
              Event date
            </label>
            <input
              id="ann-event-date"
              type="date"
              className="w-full max-w-xs border p-4 rounded-xl"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Title"
            className="w-full border p-4 rounded-xl"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Content"
            className="w-full border p-4 rounded-xl min-h-[160px]"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-green-900 text-white px-6 py-4 rounded-xl hover:bg-green-700"
            >
              {editingId != null ? 'Save changes' : 'Add announcement'}
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
        {announcements.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-sm text-gray-500 mb-1">
                Event date: <span className="font-semibold text-green-900">{formatEventDate(item.event_date)}</span>
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Saved: {formatDateTime(item.created_at)}
              </p>
              <h2 className="text-2xl font-bold text-green-900">{item.title}</h2>
              <p className="mt-3 text-gray-600 line-clamp-6 flex-1 whitespace-pre-wrap">
                {item.content}
              </p>

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
                  onClick={() => deleteAnnouncement(item.id)}
                  className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
