"use client";

import { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [variants, setVariants] = useState([
    { color: "", images: [], stock: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  // Upload images to backend
  const uploadImages = async (files) => {
    const uploaded = [];
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${backendUrl}/api/upload/image`, formData);
      uploaded.push(res.data.url);
    }
    return uploaded;
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleFileChange = async (index, files) => {
    const urls = await uploadImages(files);
    handleVariantChange(index, "images", urls);
  };

  const addVariant = () => {
    setVariants([...variants, { color: "", images: [], stock: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/products`, {
        name,
        price,
        description,
        category,
        variants,
      });
      alert("Product added successfully!");
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setVariants([{ color: "", images: [], stock: 0 }]);
    } catch (err) {
      console.error(err);
      alert("Error adding product!");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add New Product
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Variants */}
        {variants.map((v, i) => (
          <div
            key={i}
            className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold text-gray-700 mb-3">
              Variant {i + 1}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Color"
                value={v.color}
                onChange={(e) =>
                  handleVariantChange(i, "color", e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={v.stock}
                onChange={(e) =>
                  handleVariantChange(i, "stock", e.target.value)
                }
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* File Upload */}
            <div className="mt-3">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-gray-50 transition">
                <svg
                  className="w-10 h-10 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V8m0 0L3 12m4-4l4 4m6 4v-8m0 0l4 4m-4-4l-4 4"
                  ></path>
                </svg>
                <span className="text-gray-500">Click or drag images here</span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(i, e.target.files)}
                  className="hidden"
                />
              </label>

              {/* Preview */}
              {v.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {v.images.map((img, idx) => (
                    <image
                      key={idx}
                      src={img}
                      alt={`variant-${i}-img-${idx}`}
                      className="w-24 h-24 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
          >
            Add Variant
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
