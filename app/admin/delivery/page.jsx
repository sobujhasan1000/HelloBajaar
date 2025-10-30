"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DeliveredOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.filter((o) => o.status === "delivered")))
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
      <h2 className="text-2xl font-bold mb-4">Delivered Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No delivered orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Address</th>
                <th className="py-2 px-4 text-left">Phone</th>
                <th className="py-2 px-4 text-left">Total</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="py-2 px-4">{order.customer.name}</td>
                  <td className="py-2 px-4">{order.customer.address}</td>
                  <td className="py-2 px-4">{order.customer.phone}</td>
                  <td className="py-2 px-4">Tk {order.total}</td>
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
