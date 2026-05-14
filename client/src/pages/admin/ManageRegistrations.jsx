import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'

export default function ManageRegistrations() {

  const [registrations, setRegistrations] = useState([])

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {

    const res = await axios.get(
      'http://localhost/server/api/registrations.php'
    )

    setRegistrations(res.data)
  }
  const updateStatus = async (id, status) => {

    await axios.put(
      'http://localhost/server/api/update_registration.php',
      {
        id,
        status,
      }
    )

    fetchRegistrations()
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
                <td className="p-5">{item.status}</td>

                <td className="p-5 flex gap-3">

                  <button
                    onClick={() => updateStatus(item.id, 'approved')}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(item.id, 'rejected')}
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