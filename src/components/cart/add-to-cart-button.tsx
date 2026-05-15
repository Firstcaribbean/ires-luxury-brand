"use client";

import { useState } from "react";

import type { Perfume } from "@/data/perfumes";
import { addToCart } from "@/lib/cart/repository";

type AddToCartButtonProps = {
  perfume: Perfume;
  quantity?: number;
  fullWidth?: boolean;
};

export function AddToCartButton({
  perfume,
  quantity = 1,
  fullWidth = false,
}: AddToCartButtonProps) {
  const [message, setMessage] = useState("");

  function handleAddToCart() {
    addToCart({
      productId: perfume.id,
      slug: perfume.slug,
      productName: perfume.name,
      size: perfume.size,
      unitPrice: perfume.price,
      quantity,
    });
    setMessage("Added to cart");
    window.setTimeout(() => setMessage(""), 1600);
  }

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        type="button"
        onClick={handleAddToCart}
        className={`button-gold ${fullWidth ? "w-full" : ""}`}
      >
        Add to cart
      </button>
      {message ? (
        <p className="mt-2 text-sm text-[color:var(--color-accent-strong)]">
          {message}
        </p>
      ) : null}
    </div>
  );
}
