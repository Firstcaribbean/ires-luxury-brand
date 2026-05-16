"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  getBrandSettings,
  saveBrandSettings,
  type BrandSettings,
} from "@/lib/brand/repository";

export function BrandSettingsPanel() {
  const [brandForm, setBrandForm] = useState<BrandSettings | null>(null);
  const [error, setError] = useState("");
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setError("");
        const nextBrandSettings = await getBrandSettings();
        setBrandForm(nextBrandSettings);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Brand settings could not be loaded.",
        );
      }
    }

    void load();
  }, []);

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
      setIsBrandDialogOpen(false);
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
    <div className="space-y-6">
      {error ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[2rem] border border-[color:var(--color-accent-soft)]/16 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Brand Settings</p>
            <h2 className="mt-3 font-serif text-3xl text-[color:var(--color-ink)]">
              Store identity and contact details
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[color:var(--color-muted)]">
              Keep your logo, WhatsApp number, support details, and brand text
              current from one place.
            </p>
          </div>
          <button
            type="button"
            className="button-gold"
            onClick={() => setIsBrandDialogOpen(true)}
          >
            Edit brand settings
          </button>
        </div>

        {brandForm ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-4">
              <p className="section-kicker">Brand Name</p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                {brandForm.brandName}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-4">
              <p className="section-kicker">Support Email</p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                {brandForm.supportEmail}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-4">
              <p className="section-kicker">Support Phone</p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                {brandForm.supportPhone}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-[color:var(--color-accent-soft)]/14 bg-[color:var(--color-panel)] p-4">
              <p className="section-kicker">WhatsApp</p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                {brandForm.vendorWhatsappNumber}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-[color:var(--color-muted)]">
            Loading brand settings...
          </p>
        )}
      </section>

      {brandForm && isBrandDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(31,26,36,0.42)] px-4 py-10 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[2rem] border border-[color:var(--color-accent-soft)]/18 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Brand Settings</p>
                <h3 className="mt-2 font-serif text-3xl text-[color:var(--color-ink)]">
                  Update logo and brand details
                </h3>
              </div>
              <button
                type="button"
                className="button-ghost"
                onClick={() => setIsBrandDialogOpen(false)}
              >
                Close
              </button>
            </div>
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
