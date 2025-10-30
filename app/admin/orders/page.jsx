"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OrdersPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data.filter((o) => o.status === "pending")))
      .catch((err) => toast.error("Failed to load orders"));
  }, []);

  const confirmOrder = async (id) => {
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
  };

  const deleteOrder = async (id) => {
    const res = await fetch(`${backendUrl}/api/orders/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.error("Order deleted!");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } else {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
      {orders.length === 0 ? (
        <p>No pending orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-cyan-50 text-black  rounded-lg overflow-hidden">
            <thead className="bg-blue-500 ">
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
