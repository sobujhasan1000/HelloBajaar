"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OrdersPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/orders`);
        const data = await res.json();
        setOrders(data.filter((o) => o.status === "pending"));
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        // ✅ Loading ends only after fetch success or failure
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl]);

  // ✅ Confirm order
  const confirmOrder = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      });

      if (res.ok) {
        toast.success("Order confirmed!");
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } else {
        toast.error("Failed to confirm order");
      }
    } catch {
      toast.error("Error confirming order");
    }
  };

  // ✅ Delete order
  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/api/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.error("Order deleted!");
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } else {
        toast.error("Failed to delete order");
      }
    } catch {
      toast.error("Error deleting order");
    }
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-cyan-50 text-black rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
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
                  className="border-b hover:bg-blue-100 transition"
                >
                  <td className="py-2 px-4 font-semibold">{index + 1}</td>
                  <td className="py-2 px-4">{order.customer.name}</td>
                  <td className="py-2 px-4">
                    {order.cart.map((product) => (
                      <div key={product._id}>
                        {product.name} = {product.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4">{order.customer.address}</td>
                  <td className="py-2 px-4">{order.customer.phone}</td>
                  <td className="py-2 px-4 font-medium text-green-700">
                    Tk {order.total}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => confirmOrder(order._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Confirm
                    </button>
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
