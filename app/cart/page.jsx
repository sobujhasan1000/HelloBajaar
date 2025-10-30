"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Cart() {
  const router = useRouter(); // ✅ add this

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  // Load cart from localStorage
  // useEffect(() => {
  //   const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  //   setCart(savedCart);

  //   const sum = savedCart.reduce(
  //     (acc, item) => acc + item.price * item.quantity,
  //     0
  //   );
  //   setTotal(sum);
  // }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  }, [cart]);

  const updateQuantity = (index, qty) => {
    const newCart = [...cart];
    newCart[index].quantity = qty;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };
  // item remove for cart page
  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    // Dispatch event to notify other components (like Navbar)
    const cartEvent = new CustomEvent("cartUpdated", {
      detail: newCart.length,
    });
    window.dispatchEvent(cartEvent);
  };

  // Calculate delivery charge based on city
  useEffect(() => {
    if (city === "Dhaka") setDeliveryCharge(80);
    else if (city === "Other") setDeliveryCharge(130);
    else setDeliveryCharge(0);
  }, [city]);

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
      // ✅ clear cart and update UI instantly
      localStorage.removeItem("cart");
      setCart([]);
      const cartEvent = new CustomEvent("cartUpdated", { detail: 0 });
      window.dispatchEvent(cartEvent);
      router.push("/"); // redirect to home page
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
          {/* Right Side: Shipping Form */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl p-6 border shadow-sm hover:shadow-md transition text-pink-500">
            <h2 className="text-xl font-semibold mb-4 text-black border-b pb-2">
              🧾 Shipping Information
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
                placeholder="আপনার ঠিকানা"
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
                <option value="Dhaka">ঢাকা</option>
                <option value="Other">ঢাকার বাহিরে</option>
              </select>
            </div>
          </div>
          {/* Left Side: Cart Items */}
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

                  <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(index, parseInt(e.target.value))
                      }
                      className="w-16 border rounded-lg p-1 text-center"
                    />
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

            {/* Total Section */}
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
                অর্ডার কনফার্ম
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="max-w-4xl mx-auto mt-8 px-4">
  //     <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
  //       🛒 Your Shopping Cart
  //     </h1>

  //     {cart.length === 0 ? (
  //       <div className="text-center py-12 bg-gray-50 rounded-xl shadow-sm">
  //         <p className="text-gray-600 text-lg">
  //           Your cart is empty.{" "}
  //           <Link
  //             href="/products"
  //             className="text-green-600 font-semibold underline hover:text-green-700"
  //           >
  //             Shop now
  //           </Link>
  //           .
  //         </p>
  //       </div>
  //     ) : (
  //       <div className="space-y-4">
  //         {cart.map((item, index) => (
  //           <div
  //             key={index}
  //             className="flex flex-col md:flex-row justify-between items-center bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
  //           >
  //             {/* Product Info */}
  //             <div className="flex items-center space-x-4 w-full md:w-auto">
  //               <img
  //                 src={item.image}
  //                 alt={item.name}
  //                 className="w-24 h-24 object-cover rounded-xl border"
  //               />
  //               <div>
  //                 <h2 className="font-semibold text-gray-800 text-lg">
  //                   {item.name}
  //                 </h2>
  //                 <p className="text-gray-600">${item.price.toFixed(2)}</p>
  //               </div>
  //             </div>

  //             {/* Quantity + Remove */}
  //             <div className="flex items-center space-x-3 mt-3 md:mt-0">
  //               <input
  //                 type="number"
  //                 min="1"
  //                 value={item.quantity}
  //                 onChange={(e) =>
  //                   updateQuantity(index, parseInt(e.target.value))
  //                 }
  //                 className="w-16 border border-gray-300 rounded-lg text-center p-1 focus:outline-none focus:ring-2 focus:ring-green-400"
  //               />
  //               <button
  //                 onClick={() => removeItem(index)}
  //                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium"
  //               >
  //                 Remove
  //               </button>
  //             </div>
  //           </div>
  //         ))}

  //         {/* Total Section */}
  //         <div className="mt-8 bg-white p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center">
  //           <h2 className="text-2xl font-bold text-gray-800">
  //             Total: ${total.toFixed(2)}
  //           </h2>

  //           <Link
  //             href="/checkout"
  //             className="mt-4 md:mt-0 bg-green-500 text-white text-lg px-6 py-2 rounded-xl hover:bg-green-600 transition font-semibold"
  //           >
  //             Proceed to Checkout →
  //           </Link>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}
