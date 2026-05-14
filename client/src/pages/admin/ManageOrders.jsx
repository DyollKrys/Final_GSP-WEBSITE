import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'

export default function ManageOrders() {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {

    const res = await axios.get(
      'http://localhost/server/api/orders.php'
    )

    setOrders(res.data)
  }
  const updateStatus = async (id, status) => {

    await axios.put(
      'http://localhost/server/api/update_order.php',
      {
        id,
        status,
      }
    )

    fetchOrders()
  }

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Manage Orders
      </h1>

      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-green-900 text-white">
            <tr>
              <th className="p-5 text-left">Order ID</th>
              <th className="p-5 text-left">User ID</th>
              <th className="p-5 text-left">Total</th>
              <th className="p-5 text-left">Status</th>
              <th className="p-5 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">

                <td className="p-5">{order.id}</td>
                <td className="p-5">{order.user_id}</td>
                <td className="p-5">₱{order.total}</td>
                <td className="p-5">{order.status}</td>

                <td className="p-5 flex gap-3">

                  <button
                    onClick={() => updateStatus(order.id, 'ready')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                  >
                    Ready
                  </button>

                  <button
                    onClick={() => updateStatus(order.id, 'completed')}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl"
                  >
                    Completed
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