import { useState } from 'react'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
  })

  const submit = async (e) => {
    e.preventDefault()

    await axios.post(
      'http://localhost/server/api/register.php',
      form
    )

    alert('Registered Successfully')
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={submit}
        className="border p-10 rounded-lg w-[400px]"
      >
        <h1 className="text-2xl mb-5 font-bold">Register</h1>

        <input
          type="text"
          placeholder="Fullname"
          className="border p-3 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, fullname: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-3"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-green-800 text-white w-full p-3">
          Register
        </button>
      </form>
    </div>
  )
}