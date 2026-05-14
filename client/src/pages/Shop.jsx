import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PublicLayout from "../layouts/PublicLayout";
import { API_BASE_URL } from "../config/apiBase";
import { addToCart } from "../utils/cart";
import { productImageSrc } from "../utils/productImage";

function ProductCard({ item }) {
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState("");

  const src = productImageSrc(item);
  const stock = Number(item.stock) || 0;

  const onAdd = () => {
    setFlash("");
    const res = addToCart(item, qty);
    if (!res.ok) {
      setFlash(res.message || "Could not add");
      return;
    }
    setFlash("Added to cart");
    setTimeout(() => setFlash(""), 2000);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div className="overflow-hidden h-72 bg-gray-100">
        {src ? (
          <img
            src={src}
            alt={item.name}
            className="h-72 w-full object-cover hover:scale-110 transition-all duration-500"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-900">{item.name}</h2>
        <p className="text-gray-500 mt-3 line-clamp-3">{item.description}</p>

        <div className="mt-5 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Price</p>
            <p className="text-3xl font-bold text-green-900">₱{item.price}</p>
          </div>
          <div className="bg-green-100 text-green-900 px-4 py-2 rounded-xl text-sm font-semibold">
            Stock: {stock}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm text-gray-600">Qty</label>
          <input
            type="number"
            min={1}
            max={Math.max(1, stock)}
            value={qty}
            disabled={stock <= 0}
            onChange={(e) => setQty(Math.max(1, Math.min(stock, parseInt(e.target.value, 10) || 1)))}
            className="border border-gray-300 rounded-lg w-20 px-2 py-2"
          />
        </div>

        {flash ? (
          <p
            className={
              flash === "Added to cart"
                ? "mt-2 text-sm text-green-800"
                : "mt-2 text-sm text-red-700"
            }
          >
            {flash}
          </p>
        ) : null}

        <button
          type="button"
          disabled={stock <= 0}
          onClick={onAdd}
          className="w-full mt-4 bg-green-900 text-white py-4 rounded-2xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/getProducts.php`);
        const data = res.data;
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      }
    })();
  }, []);

  return (
    <PublicLayout>
      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-6xl font-bold">Official Merchandise</h1>
          <p className="text-2xl mt-5 text-green-100">
            Add items to your cart, then check out. Payment is face-to-face at pickup.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 items-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 max-w-2xl">
              <p className="text-sm text-yellow-800">
                Orders are reviewed by the council. You will see <strong>pending</strong> until an admin approves or rejects your order.
              </p>
            </div>
            <Link
              to="/cart"
              className="inline-flex items-center bg-white text-green-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-20 px-5">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-5xl font-bold text-green-900">Shop products</h2>
            <p className="text-gray-500 mt-3">Available merchandise and uniforms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
