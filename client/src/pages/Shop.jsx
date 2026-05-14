import { useEffect, useState } from "react";
import axios from "axios";
import PublicLayout from "../layouts/PublicLayout";

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost/server/api/products.php"
      );

      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PublicLayout>

      {/* HERO */}
      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-24">

        <div className="max-w-7xl mx-auto px-5">

          <h1 className="text-6xl font-bold">
            Official Merchandise
          </h1>

          <p className="text-2xl mt-5 text-green-100">
            Order Girl Scouts products for
            face-to-face pickup payment.
          </p>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto py-20 px-5">

        <div className="flex justify-between items-center mb-12">

          <div>
            <h2 className="text-5xl font-bold text-green-900">
              Shop Products
            </h2>

            <p className="text-gray-500 mt-3">
              Available merchandise and uniforms
            </p>
          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {products.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >

              {/* IMAGE */}
              <div className="overflow-hidden">

                <img
                  src={`http://localhost/server/uploads/${item.image}`}
                  alt={item.name}
                  className="h-72 w-full object-cover hover:scale-110 transition-all duration-500"
                />

              </div>

              {/* CONTENT */}
              <div className="p-6">

                <h2 className="text-2xl font-bold text-green-900">
                  {item.name}
                </h2>

                <p className="text-gray-500 mt-3 line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-5 flex justify-between items-center">

                  <div>

                    <p className="text-gray-400 text-sm">
                      Price
                    </p>

                    <p className="text-3xl font-bold text-green-900">
                      ₱{item.price}
                    </p>

                  </div>

                  <div className="bg-green-100 text-green-900 px-4 py-2 rounded-xl text-sm font-semibold">
                    Stock: {item.stock}
                  </div>

                </div>

                {/* BUTTON */}
                <button className="w-full mt-6 bg-green-900 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 transition-all">

                  Order for Pickup

                </button>

                {/* NOTICE */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-5">

                  <p className="text-sm text-yellow-800">
                    Payment is face-to-face only.
                    Orders will be confirmed by the admin.
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </PublicLayout>
  );
}