"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { CheckCircle, ShieldCheck, Truck, RefreshCcw } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const res = await axios.get(`${backendUrl}/api/products/${id}`);
        setProduct(res.data);

        const allImages = res.data?.variants?.flatMap((v) => v.images) || [];
        setImageList(allImages);
        if (allImages.length > 0) setSelectedImage(allImages[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // Auto change image every 3s
  useEffect(() => {
    if (imageList.length > 1) {
      const interval = setInterval(() => {
        setImageIndex((prev) => {
          const nextIndex = (prev + 1) % imageList.length;
          setSelectedImage(imageList[nextIndex]);
          return nextIndex;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [imageList]);

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  const handleOrder = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      quantity: 1,
    };
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/cart";
  };

  const handleThumbnailClick = (img, index) => {
    setSelectedImage(img);
    setImageIndex(index);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 bg-gray-50">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left: Sticky Image Gallery */}
        <div className="space-y-5 md:sticky md:top-20">
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg group">
            {selectedImage ? (
              <Image
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {imageList.map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`Image ${i + 1}`}
                width={90}
                height={90}
                onClick={() => handleThumbnailClick(img, i)}
                className={`rounded-xl object-cover cursor-pointer border-2 transition ${
                  selectedImage === img
                    ? "border-blue-600"
                    : "border-transparent hover:border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900">
            {product.name}
          </h1>

          <p className="text-2xl text-red-500 font-semibold mb-5">
            ৳ {product.price}
          </p>

          {/* ✅ Product Description (Improved) */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 border-l-4 border-blue-600 pl-3">
              📝 Product Description
            </h2>
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <div
                className={`text-gray-700 leading-relaxed text-[15px] sm:text-base transition-all duration-300 prose prose-blue max-w-none ${
                  showFullDescription
                    ? "max-h-none"
                    : "max-h-[150px] overflow-hidden"
                }`}
              >
                <div className="whitespace-pre-line">
                  {product.description ||
                    "Experience premium quality and unmatched reliability with our latest product line — crafted for everyday use and long-lasting performance."}
                </div>
              </div>

              {product.description && product.description.length > 200 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-blue-600 mt-3 font-medium hover:underline"
                >
                  {showFullDescription ? "Show Less ▲" : "Read More ▼"}
                </button>
              )}
            </div>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
              <div className="bg-gradient-to-br from-green-50 to-white shadow-sm rounded-xl py-3 hover:shadow-md transition">
                <CheckCircle className="mx-auto text-green-500 w-6 h-6 mb-1" />
                <p className="text-sm font-medium text-gray-700">
                  Quality Checked
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white shadow-sm rounded-xl py-3 hover:shadow-md transition">
                <ShieldCheck className="mx-auto text-blue-500 w-6 h-6 mb-1" />
                <p className="text-sm font-medium text-gray-700">
                  Genuine Product
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-white shadow-sm rounded-xl py-3 hover:shadow-md transition col-span-2 sm:col-span-1">
                <Truck className="mx-auto text-orange-500 w-6 h-6 mb-1" />
                <p className="text-sm font-medium text-gray-700">
                  Fast Delivery
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Order Button (Desktop aligned left, Mobile Floating) */}
          <div className="hidden md:flex justify-start">
            <button
              onClick={handleOrder}
              className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-3 rounded-full shadow-md hover:opacity-90 transition-all duration-300"
            >
              🛒 অর্ডার করুন
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Floating Buy Button (Mobile Only) */}
      <div className="fixed bottom-3 left-0 right-0 md:hidden flex justify-center">
        <button
          onClick={handleOrder}
          className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-10 py-3 rounded-full shadow-lg animate-bounce hover:animate-none"
        >
          🛍️ এখনই অর্ডার করুন
        </button>
      </div>

      {/* ✅ Trust Section */}
      <div className="mt-16 grid sm:grid-cols-3 gap-5">
        <div className="flex flex-col items-center text-center p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <Truck className="text-blue-500 w-8 h-8 mb-2" />
          <p className="font-semibold text-gray-800">Fast Home Delivery</p>
          <p className="text-gray-500 text-sm">
            We deliver products across Bangladesh quickly & safely.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <ShieldCheck className="text-green-500 w-8 h-8 mb-2" />
          <p className="font-semibold text-gray-800">Secure Payment</p>
          <p className="text-gray-500 text-sm">
            100% secure and trusted online transaction process.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-5 bg-white rounded-xl shadow-sm border hover:shadow-md transition">
          <RefreshCcw className="text-orange-500 w-8 h-8 mb-2" />
          <p className="font-semibold text-gray-800">Easy Return Policy</p>
          <p className="text-gray-500 text-sm">
            Return within 7 days if you’re not satisfied.
          </p>
        </div>
      </div>

      {/* ✅ Company Info */}
      <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-3xl shadow-inner text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Why Choose <span className="text-blue-600">HelloBajar</span>?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          We deliver authentic, high-quality products at fair prices. Our
          support team ensures customer satisfaction and seamless shopping. With
          fast delivery, secure payment, and reliable after-sale service —{" "}
          <span className="font-semibold text-blue-700">HelloBajar</span> is
          your trusted online shopping partner.
        </p>
      </div>
    </div>
  );
}
