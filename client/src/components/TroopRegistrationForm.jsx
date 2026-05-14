import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config/apiBase'

/** Blank form in `client/public/` — served from site root in dev and production. */
const MEMBERSHIP_FORM_PATH = '/Membership-TROOP-BGY-REG.-BLANK-FORM-1.docx'

function newMemberRow() {
  return {
    key: `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    last_name: '',
    first_name: '',
    middle_initial: '',
    birthdate: '',
    grade: '',
    member_status: 'new',
  }
}

export default function TroopRegistrationForm() {
  const [form, setForm] = useState({
    troop_name: '',
    age_level: '',
    troop_type: '',
    troop_address: '',
    leader_name: '',
    leader_birthdate: '',
    leader_beneficiary: '',
  })

  const [members, setMembers] = useState([])
  const [showAfterSubmitModal, setShowAfterSubmitModal] = useState(false)

  const addMember = () => {
    setMembers((prev) => [...prev, newMemberRow()])
  }

  const removeMember = (key) => {
    setMembers((prev) => prev.filter((m) => m.key !== key))
  }

  const updateMember = (key, field, value) => {
    setMembers((prev) =>
      prev.map((m) => (m.key === key ? { ...m, [field]: value } : m))
    )
  }

  const submit = async (e) => {
    e.preventDefault()

    for (let i = 0; i < members.length; i++) {
      const m = members[i]
      const hasAny =
        m.last_name.trim() ||
        m.first_name.trim() ||
        m.middle_initial.trim() ||
        m.birthdate ||
        m.grade.trim()
      if (!hasAny) continue
      if (
        !m.last_name.trim() ||
        !m.first_name.trim() ||
        !m.birthdate ||
        !m.grade.trim()
      ) {
        window.alert(
          `Member row ${i + 1}: please fill last name, first name, birthdate, and grade (or remove the row).`
        )
        return
      }
    }

    const payloadMembers = members
      .filter(
        (m) =>
          m.last_name.trim() &&
          m.first_name.trim() &&
          m.birthdate &&
          m.grade.trim()
      )
      .map((m) => ({
        last_name: m.last_name.trim(),
        first_name: m.first_name.trim(),
        middle_initial: m.middle_initial.trim(),
        birthdate: m.birthdate,
        grade: m.grade.trim(),
        member_status: m.member_status,
      }))

    try {
      await axios.post(`${API_BASE_URL}/troop_registration.php`, {
        ...form,
        members: payloadMembers,
      })
      setForm({
        troop_name: '',
        age_level: '',
        troop_type: '',
        troop_address: '',
        leader_name: '',
        leader_birthdate: '',
        leader_beneficiary: '',
      })
      setMembers([])
      setShowAfterSubmitModal(true)
    } catch (err) {
      const d = err.response?.data
      window.alert(
        [d?.message, d?.detail, d?.hint].filter(Boolean).join('\n\n') ||
          err.message ||
          'Submission failed.'
      )
    }
  }

  return (
    <>
    <div className="max-w-4xl mx-auto px-5 py-12" id="troop-registration-form">
      <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
        Troop registration
      </h1>
      <p className="text-gray-600 mb-10">
        Enter troop and leader details, then add members using the button below.
      </p>

      <form onSubmit={submit} className="space-y-8">
        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-4">
          <h3 className="text-xl font-semibold text-green-900 border-b border-green-100 pb-2">
            Troop details
          </h3>
          <input
            type="text"
            placeholder="Troop name"
            className="border border-gray-200 rounded-xl p-3 w-full"
            value={form.troop_name}
            onChange={(e) => setForm({ ...form, troop_name: e.target.value })}
            required
          />

          <select
            className="border border-gray-200 rounded-xl p-3 w-full bg-white"
            value={form.age_level}
            onChange={(e) => setForm({ ...form, age_level: e.target.value })}
            required
          >
            <option value="">Select age level</option>
            <option value="Twinkler">Twinkler</option>
            <option value="Star">Star</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>

          <select
            className="border border-gray-200 rounded-xl p-3 w-full bg-white"
            value={form.troop_type}
            onChange={(e) => setForm({ ...form, troop_type: e.target.value })}
            required
          >
            <option value="">Select type</option>
            <option value="School Based">School Based</option>
            <option value="Community Based">Community Based</option>
          </select>

          <textarea
            placeholder="Troop address"
            className="border border-gray-200 rounded-xl p-3 w-full min-h-[100px]"
            value={form.troop_address}
            onChange={(e) => setForm({ ...form, troop_address: e.target.value })}
            rows={3}
          />
        </section>

        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-4">
          <h3 className="text-xl font-semibold text-green-900 border-b border-green-100 pb-2">
            Troop leader
          </h3>
          <input
            type="text"
            placeholder="Leader full name"
            className="border border-gray-200 rounded-xl p-3 w-full"
            value={form.leader_name}
            onChange={(e) => setForm({ ...form, leader_name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm text-gray-600 mb-1">Leader birthdate</label>
            <input
              type="date"
              className="border border-gray-200 rounded-xl p-3 w-full max-w-xs bg-white"
              value={form.leader_birthdate}
              onChange={(e) =>
                setForm({ ...form, leader_birthdate: e.target.value })
              }
            />
          </div>

          <input
            type="text"
            placeholder="Beneficiary"
            className="border border-gray-200 rounded-xl p-3 w-full"
            value={form.leader_beneficiary}
            onChange={(e) =>
              setForm({ ...form, leader_beneficiary: e.target.value })
            }
          />
        </section>

        <section className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-green-100 pb-2">
            <h3 className="text-xl font-semibold text-green-900">
              Members
            </h3>
            <button
              type="button"
              onClick={addMember}
              className="bg-green-100 text-green-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-green-200 transition shrink-0"
            >
              + Add member
            </button>
          </div>

          {members.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No members added yet. Click &quot;Add member&quot; for each scout (last name, first name, M.I., birthdate, grade, status).
            </p>
          ) : (
            <div className="space-y-6">
              {members.map((m, index) => (
                <div
                  key={m.key}
                  className="border border-gray-200 rounded-xl p-4 md:p-5 bg-gray-50/80 space-y-4"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-sm font-semibold text-green-900">
                      Member {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMember(m.key)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 -mt-2">
                    Full name: Last name, First name, Middle initial (optional)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Last name"
                      className="border border-gray-200 rounded-xl p-3 w-full bg-white"
                      value={m.last_name}
                      onChange={(e) =>
                        updateMember(m.key, 'last_name', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="First name"
                      className="border border-gray-200 rounded-xl p-3 w-full bg-white"
                      value={m.first_name}
                      onChange={(e) =>
                        updateMember(m.key, 'first_name', e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="M.I."
                      className="border border-gray-200 rounded-xl p-3 w-full bg-white"
                      maxLength={8}
                      value={m.middle_initial}
                      onChange={(e) =>
                        updateMember(m.key, 'middle_initial', e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Birthdate</label>
                      <input
                        type="date"
                        className="border border-gray-200 rounded-xl p-3 w-full bg-white"
                        value={m.birthdate}
                        onChange={(e) =>
                          updateMember(m.key, 'birthdate', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Grade</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade 5"
                        className="border border-gray-200 rounded-xl p-3 w-full bg-white"
                        value={m.grade}
                        onChange={(e) =>
                          updateMember(m.key, 'grade', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Status</label>
                      <select
                        className="border border-gray-200 rounded-xl p-3 w-full bg-white"
                        value={m.member_status}
                        onChange={(e) =>
                          updateMember(m.key, 'member_status', e.target.value)
                        }
                      >
                        <option value="new">New</option>
                        <option value="re-reg">Re-reg</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <button
          type="submit"
          className="w-full sm:w-auto bg-green-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Submit registration
        </button>
      </form>
    </div>

    {showAfterSubmitModal && (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="after-submit-title"
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8">
          <h2
            id="after-submit-title"
            className="text-xl font-bold text-green-900 mb-3"
          >
            Registration received
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            Your online registration was submitted successfully.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            Please download the membership form below, complete it, and submit it to the
            office for verification.
          </p>
          <a
            href={encodeURI(MEMBERSHIP_FORM_PATH)}
            download="Membership-TROOP-BGY-REG-BLANK-FORM-1.docx"
            className="block w-full text-center bg-green-100 text-green-900 font-semibold py-3 rounded-xl mb-4 hover:bg-green-200 transition"
          >
            Download blank membership form (.docx)
          </a>
          <button
            type="button"
            onClick={() => setShowAfterSubmitModal(false)}
            className="w-full bg-green-900 text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition"
          >
            OK
          </button>
        </div>
      </div>
    )}
    </>
  )
}
