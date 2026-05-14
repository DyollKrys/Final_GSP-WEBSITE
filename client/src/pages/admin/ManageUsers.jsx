import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'

export default function ManageUsers() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const res = await axios.get(
      'http://localhost/server/api/users.php'
    )

    setUsers(res.data)
  }

  const deleteUser = async (id) => {

    if (!window.confirm('Delete this user?')) return

    await axios.delete(
      `http://localhost/server/api/users.php?id=${id}`
    )

    fetchUsers()
  }

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Manage Users
      </h1>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-green-900 text-white">
            <tr>
              <th className="p-5 text-left">ID</th>
              <th className="p-5 text-left">Fullname</th>
              <th className="p-5 text-left">Email</th>
              <th className="p-5 text-left">Role</th>
              <th className="p-5 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-5">{user.id}</td>
                <td className="p-5">{user.fullname}</td>
                <td className="p-5">{user.email}</td>
                <td className="p-5">{user.role}</td>

                <td className="p-5">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700"
                  >
                    Delete
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