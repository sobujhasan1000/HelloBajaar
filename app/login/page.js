// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { toast } from "react-hot-toast"; // optional, if you want nice success/error popups

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(`${backendUrl}/api/auth/login`, {
//         email,
//         password,
//       });

//       // ✅ Store token in cookie (same name your middleware expects)
//       Cookies.set("token", res.data.token, {
//         expires: 1, // 1 day
//         sameSite: "Lax",
//       });

//       // Optional: store role if you need it elsewhere
//       Cookies.set("role", res.data.role, { expires: 1 });

//       // ✅ Show success toast (optional)
//       toast.success("Login successful!");

//       // ✅ Redirect based on role
//       if (res.data.role === "admin") {
//         router.push("/admin/dashboard"); // change to actual dashboard route
//       } else {
//         router.push("/");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error(err.response?.data?.message || "Invalid credentials");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
//       <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

//       <form onSubmit={handleLogin} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full border p-2 rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full border p-2 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       <p className="mt-4 text-center">
//         Don’t have an account?{" "}
//         <a href="/page/register" className="text-green-600 hover:underline">
//           Register
//         </a>
//       </p>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });
      const role = data.role ? data.role.toLowerCase() : "guest";
      // ✅ Save token in cookie
      Cookies.set("token", data.token, {
        expires: 1,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      // ✅ Save role in cookie (always lowercase) and trigger Navbar update
      Cookies.set("role", data.role.toLowerCase(), { expires: 1 });
      window.dispatchEvent(new Event("roleChanged"));

      toast.success("✅ Login successful!");

      // ✅ Redirect based on role
      router.push(data.role.toLowerCase() === "admin" ? "/" : "/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <a href="/register" className="text-green-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
