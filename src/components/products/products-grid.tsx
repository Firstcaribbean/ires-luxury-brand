"use client";

import { useEffect, useState } from "react";

import { PerfumeCard } from "@/components/products/perfume-card";
import type { Perfume } from "@/data/perfumes";
import {
  listProducts,
  subscribeToProducts,
} from "@/lib/products/repository";

export function ProductsGrid() {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const nextProducts = await listProducts();
        setProducts(nextProducts);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Products could not be loaded.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void load();
    return subscribeToProducts(() => {
      void load();
    });
  }, []);

  if (isLoading) {
    return <p className="text-[color:var(--color-muted)]">Loading collection...</p>;
  }

  if (error) {
    return (
      <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/15 bg-white p-8 text-[color:var(--color-muted)] shadow-sm">
        No products have been added yet.
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {products.map((perfume) => (
        <PerfumeCard key={perfume.id} perfume={perfume} />
      ))}
    </div>
  );
}
