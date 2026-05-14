import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(
        'http://localhost/server/api/login.php',
        {
          email,
          password,
        }
      )

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      alert('Login successful')

    } catch (err) {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={submit}
        className="border p-10 rounded-lg w-[400px]"
      >
        <h1 className="text-2xl mb-5 font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-green-800 text-white w-full p-3">
          Login
        </button>
      </form>
    </div>
  )
}