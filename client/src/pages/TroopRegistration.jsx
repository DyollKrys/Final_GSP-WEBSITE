import { useState } from 'react'
import axios from 'axios'

export default function TroopRegistration() {
  const [form, setForm] = useState({
    troop_name: '',
    age_level: '',
    troop_type: '',
    troop_address: '',
    leader_name: '',
    leader_birthdate: '',
    leader_beneficiary: '',
  })

  const submit = async (e) => {
    e.preventDefault()

    await axios.post(
      'http://localhost/server/api/troop_registration.php',
      form
    )

    alert('Registration Submitted')
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-5 text-green-900">
        Troop Registration Form
      </h1>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          placeholder="Troop Name"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({ ...form, troop_name: e.target.value })
          }
        />

        <select
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({ ...form, age_level: e.target.value })
          }
        >
          <option>Select Age Level</option>
          <option>Twinkler</option>
          <option>Star</option>
          <option>Junior</option>
          <option>Senior</option>
        </select>

        <select
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({ ...form, troop_type: e.target.value })
          }
        >
          <option>Select Type</option>
          <option>School Based</option>
          <option>Community Based</option>
        </select>

        <textarea
          placeholder="Troop Address"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({ ...form, troop_address: e.target.value })
          }
/>

        <input
          type="text"
          placeholder="Leader Name"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({ ...form, leader_name: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({ ...form, leader_birthdate: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Beneficiary"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              leader_beneficiary: e.target.value,
            })
          }
        />

        <button className="bg-green-900 text-white px-5 py-3 rounded">
          Submit Registration
        </button>
      </form>
    </div>
  )
}