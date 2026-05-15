import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import { API_BASE_URL, UPLOADS_BASE_URL } from "../../config/apiBase";
import { withAdminAuth } from "../../utils/auth";

const emptyForm = () => ({
  name: "",
  description: "",
  price: "",
  stock: "",
});

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(() => emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get(`${API_BASE_URL}/products.php`, withAdminAuth());
    const data = res.data;
    setProducts(Array.isArray(data) ? data : []);
  };

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setImageFile(null);
    setFormKey((k) => k + 1);
  };

  const submitProduct = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", (form.name ?? "").trim());
    fd.append("description", (form.description ?? "").trim());
    fd.append("price", String(form.price ?? ""));
    fd.append("stock", String(form.stock ?? ""));
    if (imageFile) {
      fd.append("image", imageFile);
    }

    try {
      if (editingId != null) {
        fd.append("id", String(editingId));
        await axios.post(`${API_BASE_URL}/update_product.php`, fd, withAdminAuth());
      } else {
        await axios.post(`${API_BASE_URL}/add_product.php`, fd, withAdminAuth());
      }
      resetForm();
      await fetchProducts();
    } catch (err) {
      const d = err.response?.data;
      const msg = [d?.message, d?.detail].filter(Boolean).join("\n\n") || err.message;
      window.alert(msg || "Could not save product.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name ?? "",
      description: item.description ?? "",
      price: item.price != null ? String(item.price) : "",
      stock: item.stock != null ? String(item.stock) : "",
    });
    setImageFile(null);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/delete_product.php?id=${id}`, withAdminAuth());
      if (editingId === id) resetForm();
      await fetchProducts();
    } catch (err) {
      const d = err.response?.data;
      window.alert(d?.message || err.message || "Delete failed.");
    }
  };

  const productImageSrc = (item) => {
    if (!item.image || item.image === "na") return null;
    if (/^https?:\/\//i.test(item.image)) return item.image;
    return `${UPLOADS_BASE_URL}/${item.image}`;
  };

  const editingItem = editingId != null ? products.find((p) => p.id === editingId) : null;
  const formThumb = imagePreview || (editingItem ? productImageSrc(editingItem) : null);

  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-green-900 mb-8">Manage Products</h1>

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-10">
        <form key={formKey} onSubmit={submitProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input
            type="text"
            placeholder="Product Name"
            className="border p-4 rounded-xl"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Price"
            className="border p-4 rounded-xl"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            min="0"
            placeholder="Stock"
            className="border p-4 rounded-xl"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product image (optional — JPG, PNG, GIF, WebP)
              {editingId != null ? " — leave empty to keep the current image" : ""}
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
              className="w-full border p-4 rounded-xl"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            {formThumb ? (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={formThumb}
                  alt=""
                  className="h-24 w-24 rounded-lg object-cover border border-gray-200"
                />
                <span className="text-sm text-gray-500">
                  {imagePreview ? "New image preview" : "Current image"}
                </span>
              </div>
            ) : null}
          </div>

          <textarea
            placeholder="Description"
            className="border p-4 rounded-xl md:col-span-2 min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              className="bg-green-900 text-white py-4 px-8 rounded-xl hover:bg-green-700 transition-all"
            >
              {editingId != null ? "Save changes" : "Add product"}
            </button>
            {editingId != null && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 py-4 px-8 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {productImageSrc(item) ? (
              <img
                src={productImageSrc(item)}
                alt={item.name}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                No image
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold text-green-900">{item.name}</h2>

              <p className="text-gray-500 mt-3">{item.description}</p>

              <p className="text-3xl font-bold mt-5">₱{item.price}</p>

              <p className="mt-2">Stock: {item.stock}</p>

              <div className="flex flex-col gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="w-full bg-green-100 text-green-900 py-3 rounded-xl font-semibold hover:bg-green-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteProduct(item.id)}
                  className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
