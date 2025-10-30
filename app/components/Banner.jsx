"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1498603911539-01ce6c9ad8f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTk2fHxwcm9kdWN0fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1610395219791-21b0353e43cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTkxfHxwcm9kdWN0fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
];

export default function Banner() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;
    const speed = 1;

    const interval = setInterval(() => {
      if (!scrollContainer) return;
      scrollContainer.scrollLeft += speed;
      scrollAmount += speed;

      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
        scrollAmount = 0;
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gray-100 py-6">
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide"
      >
        {[...images, ...images].map((src, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-64 h-40 md:w-80 md:h-48 lg:w-96 lg:h-56 relative rounded-xl overflow-hidden shadow-md"
          >
            <Image
              src={src}
              alt={`banner-${idx}`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
