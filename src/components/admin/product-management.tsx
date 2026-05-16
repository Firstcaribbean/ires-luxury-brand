"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { adminStarterProducts } from "@/data/admin-starter-products";
import {
  getBrandSettings,
  saveBrandSettings,
  type BrandSettings,
} from "@/lib/brand/repository";
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
  const [productForm, setProductForm] = useState<ProductFormState>(
    toFormState(createEmptyProduct()),
  );
  const [brandForm, setBrandForm] = useState<BrandSettings | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isImportingCatalog, setIsImportingCatalog] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const [nextProducts, nextBrandSettings] = await Promise.all([
          listProducts(),
          getBrandSettings(),
        ]);
        setProducts(nextProducts);
        setBrandForm(nextBrandSettings);
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
  const existingSlugs = useMemo(
    () => new Set(products.map((product) => product.slug)),
    [products],
  );

  const starterCatalog = useMemo(
    () =>
      adminStarterProducts.map((product) => ({
        ...product,
        alreadyAdded: existingSlugs.has(product.slug),
      })),
    [existingSlugs],
  );

  function handleSelectProduct(product: Perfume) {
    setSelectedProductId(product.id);
    setProductForm(toFormState(product));
  }

  function handleCreateNew() {
    setSelectedProductId(null);
    setProductForm(toFormState(createEmptyProduct()));
  }

  function handleLoadStarterProduct(product: ProductInput) {
    setSelectedProductId(null);
    setProductForm(toFormState(product));
    setError("");
  }

  async function handleImportStarterProduct(product: ProductInput) {
    setIsImportingCatalog(true);
    setError("");

    try {
      await createProduct(product);
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Starter product could not be added.",
      );
    } finally {
      setIsImportingCatalog(false);
    }
  }

  async function handleImportStarterCatalog() {
    const missingProducts = adminStarterProducts.filter(
      (product) => !existingSlugs.has(product.slug),
    );

    if (!missingProducts.length) {
      setError("All starter catalog products are already in your store.");
      return;
    }

    setIsImportingCatalog(true);
    setError("");

    try {
      await Promise.all(missingProducts.map((product) => createProduct(product)));
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Starter catalog could not be imported.",
      );
    } finally {
      setIsImportingCatalog(false);
    }
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
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Product could not be deleted.",
      );
    }
  }

  async function handleSaveBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!brandForm) {
      return;
    }

    setIsSavingBrand(true);
    setError("");

    try {
      const nextSettings = await saveBrandSettings(brandForm);
      setBrandForm(nextSettings);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Brand settings could not be saved.",
      );
    } finally {
      setIsSavingBrand(false);
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
              Starter catalog prices below are editable reference prices based on
              current online listings. Add them in one click, then paste each
              image URL whenever you are ready to publish the final product look.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="button-ghost" onClick={handleCreateNew}>
              New product
            </button>
            <button
              type="button"
              className="button-gold disabled:cursor-not-allowed disabled:opacity-70"
              onClick={() => void handleImportStarterCatalog()}
              disabled={isImportingCatalog}
            >
              {isImportingCatalog ? "Adding catalog..." : "Add starter catalog"}
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="section-kicker">Quick Add Catalog</p>
              <h3 className="mt-2 font-serif text-2xl text-[color:var(--color-ink)]">
                Online-price starter products
              </h3>
            </div>
            <p className="text-sm text-[color:var(--color-muted-soft)]">
              {starterCatalog.filter((product) => product.alreadyAdded).length} of{" "}
              {starterCatalog.length} already added
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {starterCatalog.map((product) => (
              <article
                key={product.slug}
                className="rounded-[1.35rem] border border-[color:var(--color-accent-soft)]/14 bg-white p-4 shadow-sm"
              >
                <p className="section-kicker">{product.fragranceFamily}</p>
                <h4 className="mt-2 font-serif text-xl text-[color:var(--color-ink)]">
                  {product.name}
                </h4>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
                  {product.size}
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-serif text-xl text-[color:var(--color-accent-strong)]">
                    {formatNaira(product.price)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-muted-soft)]">
                    {product.alreadyAdded ? "In store" : "Ready to add"}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleLoadStarterProduct(product)}
                    className="button-ghost"
                  >
                    Load form
                  </button>
                  <button
                    type="button"
                    disabled={product.alreadyAdded || isImportingCatalog}
                    onClick={() => void handleImportStarterProduct(product)}
                    className="button-gold disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {product.alreadyAdded ? "Added" : "Add product"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
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

          <form className="grid gap-4" onSubmit={handleSaveProduct}>
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
      </section>

      {brandForm ? (
        <section className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-[color:var(--color-panel)] p-6 shadow-sm">
          <p className="section-kicker">Brand Settings</p>
          <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
            Update logo and brand details
          </h2>
          <form className="mt-8 grid gap-4" onSubmit={handleSaveBrand}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={brandForm.brandName}
                onChange={(event) =>
                  setBrandForm((current) =>
                    current ? { ...current, brandName: event.target.value } : current,
                  )
                }
                placeholder="Brand name"
                className="input-shell"
              />
              <input
                value={brandForm.logoImageUrl}
                onChange={(event) =>
                  setBrandForm((current) =>
                    current ? { ...current, logoImageUrl: event.target.value } : current,
                  )
                }
                placeholder="Logo image URL"
                className="input-shell"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={brandForm.brandMark}
                onChange={(event) =>
                  setBrandForm((current) =>
                    current ? { ...current, brandMark: event.target.value } : current,
                  )
                }
                placeholder="Logo mark text"
                className="input-shell"
              />
              <input
                value={brandForm.brandScript}
                onChange={(event) =>
                  setBrandForm((current) =>
                    current ? { ...current, brandScript: event.target.value } : current,
                  )
                }
                placeholder="Logo script text"
                className="input-shell"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <input
                value={brandForm.supportEmail}
                onChange={(event) =>
                  setBrandForm((current) =>
                    current ? { ...current, supportEmail: event.target.value } : current,
                  )
                }
                placeholder="Support email"
                className="input-shell"
              />
              <input
                value={brandForm.supportPhone}
                onChange={(event) =>
                  setBrandForm((current) =>
                    current ? { ...current, supportPhone: event.target.value } : current,
                  )
                }
                placeholder="Support phone"
                className="input-shell"
              />
              <input
                value={brandForm.vendorWhatsappNumber}
                onChange={(event) =>
                  setBrandForm((current) =>
                    current
                      ? { ...current, vendorWhatsappNumber: event.target.value }
                      : current,
                  )
                }
                placeholder="Vendor WhatsApp number"
                className="input-shell"
              />
            </div>
            <button
              type="submit"
              disabled={isSavingBrand}
              className="button-gold w-fit disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingBrand ? "Saving brand..." : "Save brand settings"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}
