import AdminLayout from '../../layouts/AdminLayout'

export default function Dashboard() {

  const cards = [
    {
      title: 'Total Users',
      value: 120,
    },
    {
      title: 'Orders',
      value: 40,
    },
    {
      title: 'Products',
      value: 18,
    },
    {
      title: 'Registrations',
      value: 75,
    },
  ]

  return (
    <AdminLayout>

      <h1 className="text-5xl font-bold text-green-900 mb-10">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-8 hover:scale-105 transition-all"
          >
            <h2 className="text-gray-500 text-lg">
              {card.title}
            </h2>

            <p className="text-5xl font-bold text-green-900 mt-4">
              {card.value}
            </p>
          </div>
        ))}

      </div>

    </AdminLayout>
  )
}