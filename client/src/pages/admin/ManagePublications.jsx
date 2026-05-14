import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'

export default function ManagePublications() {

  const [publications, setPublications] = useState([])

  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {

    const res = await axios.get(
      'http://localhost/server/api/publications.php'
    )

    setPublications(res.data)
  }
  const uploadPublication = async (e) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append('title', title)
    formData.append('file', e.target.file.files[0])

    await axios.post(
      'http://localhost/server/api/add_publication.php',
      formData
    )

    fetchPublications()
  }

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Manage Publications
      </h1>
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

        <form onSubmit={uploadPublication} className="space-y-5">

          <input
            type="text"
            placeholder="Publication Title"
            className="w-full border p-4 rounded-xl"
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            name="file"
            className="w-full border p-4 rounded-xl"
          />

          <button className="bg-green-900 text-white px-6 py-4 rounded-xl hover:bg-green-700">
            Upload Publication
          </button>

        </form>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {publications.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg p-8"
          >

            <h2 className="text-2xl font-bold text-green-900">
              {item.title}
            </h2>

            <a
              href={`http://localhost/server/uploads/${item.file}`}
              target="_blank"
              className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              View Publication
            </a>

          </div>
        ))}

      </div>

    </AdminLayout>
  )
}