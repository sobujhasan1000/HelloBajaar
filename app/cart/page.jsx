"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const [thankYouMessage, setThankYouMessage] = useState(""); // ✅ State for Thank You message

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Calculate total
  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [cart]);

  // Quantity update
  const updateQuantity = (index, qty) => {
    const newCart = [...cart];
    newCart[index].quantity = qty;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Remove item
  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    const cartEvent = new CustomEvent("cartUpdated", {
      detail: newCart.length,
    });
    window.dispatchEvent(cartEvent);
  };

  // Delivery charge logic
  useEffect(() => {
    if (city === "Dhaka") setDeliveryCharge(80);
    else if (city === "Other") setDeliveryCharge(130);
    else setDeliveryCharge(0);
  }, [city]);

  // Form validation
  const validateForm = () => {
    if (!name.trim()) {
      alert("অনুগ্রহ করে নাম লিখুন।");
      return false;
    }
    if (name.length > 30) {
      alert("নাম ৩০ অক্ষরের বেশি হতে পারবে না।");
      return false;
    }

    if (!/^\d{11}$/.test(phone)) {
      alert("মোবাইল নাম্বার অবশ্যই ১১ সংখ্যার হতে হবে।");
      return false;
    }

    if (!address.trim()) {
      alert("অনুগ্রহ করে ঠিকানা লিখুন।");
      return false;
    }
    if (address.length > 100) {
      alert("ঠিকানা ১০০ অক্ষরের বেশি হতে পারবে না।");
      return false;
    }

    if (!city) {
      alert("অনুগ্রহ করে শহর নির্বাচন করুন।");
      return false;
    }

    return true;
  };

  // Phone input: only digits, max 11
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 11) {
      setPhone(digits);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const orderData = {
      customer: { name, phone, address, city },
      cart,
      total: total + deliveryCharge,
      deliveryCharge,
      date: new Date(),
    };

    try {
      await axios.post(`${backendUrl}/api/orders/create`, orderData);

      // ✅ Show Thank You message
      setThankYouMessage(
        `ধন্যবাদ ${name}! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। মোট টাকা: ${orderData.total} TK`
      );

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);
      const cartEvent = new CustomEvent("cartUpdated", { detail: 0 });
      window.dispatchEvent(cartEvent);

      // Clear form
      setName("");
      setPhone("");
      setAddress("");
      setCity("");
    } catch (err) {
      console.error(err);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        🛒 Your Cart & Checkout
      </h1>

      {/* ✅ Thank You Message */}
      {thankYouMessage && (
        <div className="bg-green-100 text-green-800 border border-green-400 p-4 rounded-lg mb-6 text-center font-semibold">
          {thankYouMessage}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            href="/"
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
          >
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-gradient-to-br from-blue-100 via-white to-green-100 rounded-2xl p-6 border shadow-sm hover:shadow-md transition text-pink-500">
            <h2 className="text-xl font-semibold mb-4 text-black border-b pb-2">
              🧾 Shipping Information
            </h2>

            <div className="space-y-4 text-black">
              <input
                type="text"
                placeholder="আপনার নাম"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />

              <input
                type="tel"
                placeholder="মোবাইল নাম্বার (১১ ডিজিট)"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={11}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />

              <input
                type="text"
                placeholder="আপনার ঠিকানা"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={100}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              />

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              >
                <option value="">Select City</option>
                <option value="Dhaka">ঢাকা</option>
                <option value="Other">ঢাকার বাহিরে</option>
              </select>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              🛍️ Your Items
            </h2>

            <div className="space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-center border rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {item.price} TK × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 sm:mt-0">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(index, Math.max(1, item.quantity - 1))
                        }
                        className="bg-black px-3 py-1 text-lg font-bold hover:bg-gray-300 text-white"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-black font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="bg-black px-3 py-1 text-lg font-bold hover:bg-gray-300 text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-1 text-gray-700">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>{total} TK</span>
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
                অর্ডার কনফার্ম করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
