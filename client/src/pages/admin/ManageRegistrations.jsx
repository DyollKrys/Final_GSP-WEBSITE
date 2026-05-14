import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'
import { API_BASE_URL } from '../../config/apiBase'

export default function ManageRegistrations() {

  const [registrations, setRegistrations] = useState([])

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {

    const res = await axios.get(`${API_BASE_URL}/registrations.php`)

    setRegistrations(Array.isArray(res.data) ? res.data : [])
  }
  const approveAndArchive = async (id) => {
    if (
      !window.confirm(
        'Approve this registration? It will be saved to the archive and removed from the pending list.'
      )
    ) {
      return
    }
    try {
      await axios.post(`${API_BASE_URL}/approve_registration.php`, { id })
      await fetchRegistrations()
    } catch (err) {
      const d = err.response?.data
      window.alert(
        [d?.message, d?.detail, d?.hint].filter(Boolean).join('\n\n') ||
          err.message ||
          'Approve failed.'
      )
    }
  }

  const rejectAndDelete = async (id) => {
    if (
      !window.confirm(
        'Reject and permanently delete this registration (and its members)? This cannot be undone.'
      )
    ) {
      return
    }
    try {
      await axios.delete(`${API_BASE_URL}/delete_registration.php?id=${id}`)
      await fetchRegistrations()
    } catch (err) {
      const d = err.response?.data
      window.alert(d?.message || err.message || 'Delete failed.')
    }
  }
  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Manage Registrations
      </h1>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-green-900 text-white">
            <tr>
              <th className="p-5 text-left">Troop</th>
              <th className="p-5 text-left">Age Level</th>
              <th className="p-5 text-left">Leader</th>
              <th className="p-5 text-left">Members</th>
              <th className="p-5 text-left">Status</th>
              <th className="p-5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>

            {registrations.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">

                <td className="p-5">{item.troop_name}</td>
                <td className="p-5">{item.age_level}</td>
                <td className="p-5">{item.leader_name}</td>
                <td className="p-5">{item.member_count ?? 0}</td>
                <td className="p-5">{item.status}</td>

                <td className="p-5 flex gap-3">

                  <button
                    type="button"
                    onClick={() => approveAndArchive(item.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectAndDelete(item.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Reject
                  </button>

                </td>

              </tr>
            ))}

          </tbody>
          </table>

      </div>

    </AdminLayout>
  )
}