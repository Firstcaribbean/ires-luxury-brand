"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Perfume } from "@/data/perfumes";
import { formatNaira } from "@/lib/currency";
import {
  createProduct,
  deleteProduct,
  listProducts,
  subscribeToProducts,
  updateProduct,
  type ProductInput,
} from "@/lib/products/repository";

function toCommaString(values: string[]) {
  return values.join(", ");
}

function fromCommaString(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function createEmptyProduct(): ProductInput {
  return {
    slug: "",
    name: "",
    tagline: "",
    description: "",
    story: "",
    fragranceFamily: "",
    price: 0,
    size: "",
    imageUrl: "",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    mood: "",
    heroAccent: "rgba(255, 121, 176, 0.18)",
  };
}

type ProductFormState = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  fragranceFamily: string;
  price: string;
  size: string;
  imageUrl: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  mood: string;
  heroAccent: string;
};

function toFormState(product: ProductInput): ProductFormState {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    story: product.story,
    fragranceFamily: product.fragranceFamily,
    price: product.price ? String(product.price) : "",
    size: product.size,
    imageUrl: product.imageUrl,
    topNotes: toCommaString(product.topNotes),
    heartNotes: toCommaString(product.heartNotes),
    baseNotes: toCommaString(product.baseNotes),
    mood: product.mood,
    heroAccent: product.heroAccent,
  };
}

function toProductInput(form: ProductFormState): ProductInput {
  return {
    id: form.id,
    slug: form.slug,
    name: form.name,
    tagline: form.tagline,
    description: form.description,
    story: form.story,
    fragranceFamily: form.fragranceFamily,
    price: Number(form.price || 0),
    size: form.size,
    imageUrl: form.imageUrl,
    topNotes: fromCommaString(form.topNotes),
    heartNotes: fromCommaString(form.heartNotes),
    baseNotes: fromCommaString(form.baseNotes),
    mood: form.mood,
    heroAccent: form.heroAccent,
  };
}

export function ProductManagement() {
  const [products, setProducts] = useState<Perfume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormState>(
    toFormState(createEmptyProduct()),
  );
  const [isSavingProduct, setIsSavingProduct] = useState(false);

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
            : "Admin product tools could not be loaded.",
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

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? null,
    [products, selectedProductId],
  );

  function handleSelectProduct(product: Perfume) {
    setSelectedProductId(product.id);
    setProductForm(toFormState(product));
    setIsProductDialogOpen(true);
  }

  function handleCreateNew() {
    setSelectedProductId(null);
    setProductForm(toFormState(createEmptyProduct()));
    setError("");
    setIsProductDialogOpen(true);
  }

  async function handleSaveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProduct(true);
    setError("");

    try {
      const payload = toProductInput(productForm);

      if (selectedProductId) {
        await updateProduct(selectedProductId, payload);
      } else {
        const created = await createProduct(payload);
        setSelectedProductId(created.id);
      }
      setIsProductDialogOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Product could not be saved.",
      );
    } finally {
      setIsSavingProduct(false);
    }
  }

  async function handleDeleteProduct(productId: string) {
    setError("");

    try {
      await deleteProduct(productId);
      if (selectedProductId === productId) {
        handleCreateNew();
      }
      setIsProductDialogOpen(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Product could not be deleted.",
      );
    }
  }

  return (
    <div className="space-y-8">
      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Product Management</p>
            <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
              Create, edit, and remove perfumes
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--color-muted)]">
              Your product list now opens editing forms as pop-up panels so the
              dashboard stays clean while you manage the store.
            </p>
          </div>
          <button type="button" className="button-gold" onClick={handleCreateNew}>
            New product
          </button>
        </div>
        <div className="mt-8 space-y-4">
          {isLoading ? (
            <p className="text-[color:var(--color-muted)]">Loading products...</p>
          ) : (
            products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product)}
                className={`w-full rounded-[1.5rem] border p-4 text-left transition ${
                  selectedProductId === product.id
                    ? "border-[color:var(--color-accent-strong)] bg-[color:var(--color-panel)]"
                    : "border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] hover:border-[color:var(--color-accent-soft)]/35"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-2xl text-[color:var(--color-ink)]">
                      {product.name}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                      {product.size}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[color:var(--color-accent-strong)]">
                    {formatNaira(product.price)}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {isProductDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(31,26,36,0.42)] px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[2rem] border border-[color:var(--color-accent-soft)]/18 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Product Form</p>
                <h3 className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">
                  {selectedProduct ? "Edit product" : "Create product"}
                </h3>
              </div>
              <button
                type="button"
                className="button-ghost"
                onClick={() => setIsProductDialogOpen(false)}
              >
                Close
              </button>
            </div>
            <form className="mt-8 grid gap-4" onSubmit={handleSaveProduct}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Product name"
                  className="input-shell"
                />
                <input
                  value={productForm.slug}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, slug: event.target.value }))
                  }
                  placeholder="Slug"
                  className="input-shell"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={productForm.tagline}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, tagline: event.target.value }))
                  }
                  placeholder="Tagline"
                  className="input-shell"
                />
                <input
                  value={productForm.fragranceFamily}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      fragranceFamily: event.target.value,
                    }))
                  }
                  placeholder="Fragrance family"
                  className="input-shell"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  value={productForm.price}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, price: event.target.value }))
                  }
                  placeholder="Price in naira"
                  className="input-shell"
                />
                <input
                  value={productForm.size}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, size: event.target.value }))
                  }
                  placeholder="Size"
                  className="input-shell"
                />
                <input
                  value={productForm.heroAccent}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      heroAccent: event.target.value,
                    }))
                  }
                  placeholder="Hero accent"
                  className="input-shell"
                />
              </div>
              <input
                value={productForm.imageUrl}
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, imageUrl: event.target.value }))
                }
                placeholder="Product image URL"
                className="input-shell"
              />
              <textarea
                rows={3}
                value={productForm.description}
                onChange={(event) =>
                  setProductForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Short description"
                className="input-shell resize-none"
              />
              <textarea
                rows={4}
                value={productForm.story}
                onChange={(event) =>
                  setProductForm((current) => ({ ...current, story: event.target.value }))
                }
                placeholder="Product story"
                className="input-shell resize-none"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={productForm.topNotes}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, topNotes: event.target.value }))
                  }
                  placeholder="Top notes, comma separated"
                  className="input-shell"
                />
                <input
                  value={productForm.heartNotes}
                  onChange={(event) =>
                    setProductForm((current) => ({
                      ...current,
                      heartNotes: event.target.value,
                    }))
                  }
                  placeholder="Heart notes, comma separated"
                  className="input-shell"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={productForm.baseNotes}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, baseNotes: event.target.value }))
                  }
                  placeholder="Base notes, comma separated"
                  className="input-shell"
                />
                <input
                  value={productForm.mood}
                  onChange={(event) =>
                    setProductForm((current) => ({ ...current, mood: event.target.value }))
                  }
                  placeholder="Mood"
                  className="input-shell"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="button-gold disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSavingProduct
                    ? "Saving..."
                    : selectedProduct
                      ? "Update product"
                      : "Create product"}
                </button>
                {selectedProduct ? (
                  <button
                    type="button"
                    onClick={() => void handleDeleteProduct(selectedProduct.id)}
                    className="button-ghost"
                  >
                    Delete product
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}

    </div>
  );
}
