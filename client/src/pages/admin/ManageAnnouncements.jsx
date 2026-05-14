import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'

export default function ManageAnnouncements() {

  const [announcements, setAnnouncements] = useState([])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {

    const res = await axios.get(
      'http://localhost/server/api/announcements.php'
    )
    setAnnouncements(res.data)
  }

  const addAnnouncement = async (e) => {
    e.preventDefault()

    await axios.post(
      'http://localhost/server/api/add_announcement.php',
      {
        title,
        content,
      }
    )

    fetchAnnouncements()
  }

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Manage Announcements
      </h1>
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

        <form onSubmit={addAnnouncement} className="space-y-5">

          <input
            type="text"
            placeholder="Announcement Title"
            className="w-full border p-4 rounded-xl"
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Announcement Content"
            className="w-full border p-4 rounded-xl h-40"
            onChange={(e) => setContent(e.target.value)}
          />

          <button className="bg-green-900 text-white px-6 py-4 rounded-xl hover:bg-green-700">
            Publish Announcement
          </button>

        </form>

      </div>
      <div className="space-y-5">

        {announcements.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg p-8"
          >

            <h2 className="text-2xl font-bold text-green-900">
              {item.title}
            </h2>

            <p className="mt-4 text-gray-600">
              {item.content}
            </p>

          </div>
        ))}

      </div>

    </AdminLayout>
  )
}