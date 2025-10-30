"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ProductCard({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(
    product?.variants?.[0]?.images?.[0] || product?.image || ""
  );
  const router = useRouter();

  if (!product) return null;

  // Function to add to cart
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productToAdd = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      variant: product.variants?.[selectedVariant] || null,
      quantity: 1,
    };

    const existingIndex = cart.findIndex(
      (item) =>
        item.id === productToAdd.id &&
        item.variant?.color === productToAdd.variant?.color
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    const cartEvent = new CustomEvent("cartUpdated", { detail: cart.length });
    window.dispatchEvent(cartEvent);

    toast.success(`${product.name} added to cart!`);
  };

  // Function for "Order Now" — add product and go to cart
  const orderNow = () => {
    addToCart(); // add to cart first
    router.push("/cart"); // then redirect to cart page
  };

  // Function for going to product details
  const handleImageClick = () => {
    router.push(`/products/${product._id}`);
  };

  return (
    <div className="border border-[#0983e7] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col bg-white w-full sm:w-[90%] md:w-[80%] lg:w-[100%] mx-auto">
      <Toaster position="top-right" />

      {/* Main Image */}
      <div
        className="w-full relative rounded-lg overflow-hidden cursor-pointer"
        style={{ aspectRatio: "1/1" }}
        onClick={handleImageClick}
      >
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover rounded-lg transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow mt-4">
        <h2 className="font-semibold text-base sm:text-lg text-gray-800 text-center line-clamp-2">
          {product.name}
        </h2>
        <p className="text-[#f50606] font-extrabold text-lg sm:text-xl text-center mt-1">
          TK {product.price}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col  gap-3 mt-4">
        <button
          onClick={addToCart}
          className="flex-1 bg-[#8bf0ba] px-4 py-2 text-sm sm:text-base hover:bg-[#19995d] hover:text-white transition rounded-lg cursor-pointer font-medium"
        >
          Add to Cart
        </button>
        <button
          onClick={orderNow}
          className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 text-white px-4 py-2 text-sm sm:text-base rounded-lg shadow-md hover:opacity-90 transition-all duration-300 cursor-pointer font-medium"
        >
          Order
        </button>
      </div>
    </div>
  );
}
