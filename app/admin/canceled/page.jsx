"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CanceledOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/orders`)
      .then((res) => res.json())
      .then((data) =>
        setOrders(data.filter((o) => o.status === "delivery canceled"))
      )
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const deleteOrder = async (id) => {
    const res = await fetch(`${backendUrl}/api/orders/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Order deleted!");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } else {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Canceled Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No canceled orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-cyan-50 text-black rounded-lg overflow-hidden">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="py-2 px-4 text-left">SL No</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  {/* Serial Number */}
                  <td className="py-2 px-4 font-semibold">{index + 1}</td>

                  {/* Customer Name */}
                  <td className="py-2 px-4">{order.customer.name}</td>

                  {/* Product List */}
                  <td className="py-2 px-4">
                    {order.cart?.length > 0 ? (
                      order.cart.map((product) => (
                        <div key={product._id}>
                          <span className="font-semibold">{product.name}</span>{" "}
                          ={" "}
                          <span className="text-gray-600">
                            {product.quantity}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No products</span>
                    )}
                  </td>

                  {/* Address */}
                  <td className="py-2 px-4">{order.customer.address}</td>

                  {/* Phone */}
                  <td className="py-2 px-4">{order.customer.phone}</td>

                  {/* Total */}
                  <td className="py-2 px-4 font-medium text-green-700">
                    Tk {order.total}
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-4">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
