"use client";
import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    category: "",
  });
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ✅ Fetch all products
  useEffect(() => {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${backend}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ✅ Handle update
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const { product } = await res.json();
        setProducts(products.map((p) => (p._id === id ? product : p)));
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🛍️ Admin Dashboard
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-indigo-600 text-white text-left">
            <tr>
              <th className="py-3 px-4">SL No</th>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Product Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, index) => (
              <tr key={p._id} className="border-b hover:bg-gray-100 transition">
                {/* ✅ Serial Number */}
                <td className="py-3 px-4 text-gray-700 font-medium">
                  {index + 1}
                </td>

                {/* ✅ Product Image */}
                <td className="py-3 px-4">
                  <Image
                    src={p.variants?.[0]?.images?.[0] || "/no-image.png"}
                    alt={p.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-md border"
                    sizes="(max-width: 768px) 100vw, 64px"
                  />
                </td>

                {/* ✅ Product Name */}
                <td className="py-3 px-4">
                  {editingId === p._id ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    <span className="font-medium text-gray-800">{p.name}</span>
                  )}
                </td>

                {/* ✅ Category (Editable Dropdown) */}
                <td className="py-3 px-4">
                  {editingId === p._id ? (
                    <select
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    >
                      <option value="">Select Category</option>
                      <option value="electronics">Electronics</option>
                      <option value="home">Home</option>
                      <option value="beauty">Beauty</option>
                      <option value="health">Health</option>
                      <option value="fashion">Fashion</option>
                    </select>
                  ) : (
                    <span className="text-gray-700 capitalize">
                      {p.category || "—"}
                    </span>
                  )}
                </td>

                {/* ✅ Price */}
                <td className="py-3 px-4">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    <span className="text-gray-700">${p.price}</span>
                  )}
                </td>

                {/* ✅ Actions */}
                <td className="py-3 px-4 flex justify-center gap-3">
                  {editingId === p._id ? (
                    <button
                      onClick={() => handleUpdate(p._id)}
                      className="bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(p._id);
                        setEditData({
                          name: p.name,
                          price: p.price,
                          category: p.category || "",
                        });
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
