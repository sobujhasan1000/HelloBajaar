"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const router = useRouter();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const sum = savedCart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(sum);
  }, []);

  // Calculate delivery charge based on city
  useEffect(() => {
    if (city === "Dhaka") setDeliveryCharge(80);
    else if (city === "Other") setDeliveryCharge(130);
    else setDeliveryCharge(0);
  }, [city]);

  // Auto-fill customer info if user is logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setName(payload.name || "");
        setPhone(payload.phone || "");
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handlePlaceOrder = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!name || !phone || !address || !city) {
      alert("Please fill all customer details!");
      return;
    }

    const orderData = {
      customer: { name, phone, address, city },
      cart,
      total: total + deliveryCharge,
      deliveryCharge,
      date: new Date(),
    };

    try {
      await axios.post(`${backendUrl}/api/orders/create`, orderData);
      alert(`Order placed successfully! Total: ${orderData.total} TK`);
      localStorage.removeItem("cart");
      router.push("/"); // redirect to home page
    } catch (err) {
      console.error(err);
      alert("Error placing order. Please try again.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        🧾 Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 📦 Right Side - Customer Details */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 border rounded-2xl p-5 shadow-sm hover:shadow-md transition  text-pink-500">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Shipping Information
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="আপনার নাম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="tel"
              placeholder="মোবাইল নাম্বার"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="ঠিকানা"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              <option value="">Select City</option>
              <option value="Dhaka">ঢাকার ভেতর</option>
              <option value="Other">ঢাকার বাহিরে</option>
            </select>
          </div>
        </div>
        {/* 🛍️ Left Side - Cart Summary */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition mb-2">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Order Summary
          </h2>

          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-3 border-b last:border-0"
            >
              <div>
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">
                  {item.quantity} × ${item.price}
                </p>
              </div>
              <p className="font-semibold text-gray-700">
                ${item.price * item.quantity}
              </p>
            </div>
          ))}

          <div className="mt-6 space-y-1 text-gray-700">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>${total}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery Charge:</span>
              <span>{deliveryCharge} TK</span>
            </p>
            <hr className="my-2" />
            <h2 className="flex justify-between text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span>{total + deliveryCharge} TK</span>
            </h2>
            <button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-3 rounded-xl transition-all"
            >
              অর্ডার কনফার্ম
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
