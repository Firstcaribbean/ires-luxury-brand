"use client";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { siteConfig } from "@/data/site-config";
import { getFirebaseServices } from "@/lib/firebase/client";

export type BrandSettings = {
  brandName: string;
  brandMark: string;
  brandScript: string;
  supportEmail: string;
  supportPhone: string;
  vendorWhatsappNumber: string;
  logoImageUrl: string;
};

const BRAND_SETTINGS_KEY = "ires-luxury-brand-settings";
const BRAND_SETTINGS_DOC = "brand";
const BRAND_UPDATED_EVENT = "ires-luxury-brand-settings-updated";

const defaultBrandSettings: BrandSettings = {
  brandName: siteConfig.brandName,
  brandMark: "IRE'S",
  brandScript: "Luxury Brand",
  supportEmail: siteConfig.supportEmail,
  supportPhone: siteConfig.supportPhone,
  vendorWhatsappNumber: siteConfig.vendorWhatsappNumber,
  logoImageUrl: "",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function emitBrandUpdated() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(BRAND_UPDATED_EVENT));
  }
}

function parseBrandSettings(raw: Record<string, unknown> | null | undefined) {
  return {
    brandName: String(raw?.brandName ?? defaultBrandSettings.brandName),
    brandMark: String(raw?.brandMark ?? defaultBrandSettings.brandMark),
    brandScript: String(raw?.brandScript ?? defaultBrandSettings.brandScript),
    supportEmail: String(raw?.supportEmail ?? defaultBrandSettings.supportEmail),
    supportPhone: String(raw?.supportPhone ?? defaultBrandSettings.supportPhone),
    vendorWhatsappNumber: String(
      raw?.vendorWhatsappNumber ?? defaultBrandSettings.vendorWhatsappNumber,
    ),
    logoImageUrl: String(raw?.logoImageUrl ?? defaultBrandSettings.logoImageUrl),
  } satisfies BrandSettings;
}

function readLocalBrandSettings() {
  if (!isBrowser()) {
    return defaultBrandSettings;
  }

  const stored = window.localStorage.getItem(BRAND_SETTINGS_KEY);

  if (!stored) {
    window.localStorage.setItem(
      BRAND_SETTINGS_KEY,
      JSON.stringify(defaultBrandSettings),
    );
    return defaultBrandSettings;
  }

  try {
    return parseBrandSettings(JSON.parse(stored) as Record<string, unknown>);
  } catch {
    window.localStorage.setItem(
      BRAND_SETTINGS_KEY,
      JSON.stringify(defaultBrandSettings),
    );
    return defaultBrandSettings;
  }
}

function writeLocalBrandSettings(settings: BrandSettings) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(settings));
  emitBrandUpdated();
}

export function subscribeToBrandSettings(listener: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(BRAND_UPDATED_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(BRAND_UPDATED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export async function getBrandSettings() {
  const firebase = getFirebaseServices();

  if (firebase) {
    const snapshot = await getDoc(doc(firebase.db, "settings", BRAND_SETTINGS_DOC));

    if (!snapshot.exists()) {
      await setDoc(
        doc(firebase.db, "settings", BRAND_SETTINGS_DOC),
        defaultBrandSettings,
      );
      return defaultBrandSettings;
    }

    return parseBrandSettings(snapshot.data());
  }

  return readLocalBrandSettings();
}

export async function saveBrandSettings(input: BrandSettings) {
  const nextSettings = parseBrandSettings(input);
  const firebase = getFirebaseServices();

  if (firebase) {
    await setDoc(doc(firebase.db, "settings", BRAND_SETTINGS_DOC), nextSettings);
    emitBrandUpdated();
    return nextSettings;
  }

  writeLocalBrandSettings(nextSettings);
  return nextSettings;
}

export function getDefaultBrandSettings() {
  return defaultBrandSettings;
}
