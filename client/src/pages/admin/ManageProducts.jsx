import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from '../../layouts/AdminLayout'

export default function ManageProducts() {

  const [products, setProducts] = useState([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const res = await axios.get(
      'http://localhost/server/api/products.php'
    )

    setProducts(res.data)
  }

  const addProduct = async (e) => {
    e.preventDefault()

    await axios.post(
      'http://localhost/server/api/add_product.php',
      form
    )

    fetchProducts()
  }

  const deleteProduct = async (id) => {

    await axios.delete(
      `http://localhost/server/api/delete_product.php?id=${id}`
    )

    fetchProducts()
  }

  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Manage Products
      </h1>

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">

        <form
          onSubmit={addProduct}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          <input
            type="text"
            placeholder="Product Name"
            className="border p-4 rounded-xl"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-4 rounded-xl"
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Stock"
            className="border p-4 rounded-xl"
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="border p-4 rounded-xl"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <button className="bg-green-900 text-white py-4 rounded-xl hover:bg-green-700 transition-all">
            Add Product
          </button>

        </form>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >

            <img
              src={`http://localhost/server/uploads/${item.image}`}
              className="h-64 w-full object-cover"
            />

            <div className="p-6">

              <h2 className="text-2xl font-bold text-green-900">
                {item.name}
              </h2>

              <p className="text-gray-500 mt-3">
                {item.description}
              </p>

              <p className="text-3xl font-bold mt-5">
                ₱{item.price}
              </p>

              <p className="mt-2">
                Stock: {item.stock}
              </p>

              <button
                onClick={() => deleteProduct(item.id)}
                className="w-full bg-red-600 text-white py-3 rounded-xl mt-5 hover:bg-red-700"
              >
                Delete Product
              </button>

            </div>

          </div>
        ))}

      </div>

    </AdminLayout>
  )
}