"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface ListingFormData {
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  city: string;
  area: string;
  ward: string;
  address: string;
  latitude: string;
  longitude: string;
  monthlyRentMin: string;
  monthlyRentMax: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  availableFrom: string;
  amenities: Record<string, boolean>;
  ownerType: "owner" | "agent";
  noBroker: boolean;
  landmarks: string[];
  houseRules: string[];
  photos: { id: string; preview: string; file: File }[];
}

export const AMENITIES_LIST = [
  { id: "furnished", label: "Furnished" },
  { id: "parking", label: "Parking Available" },
  { id: "wifi", label: "Wifi Available" },
  { id: "water", label: "Water Included" },
  { id: "electricity", label: "Electricity Included" },
  { id: "pet", label: "Pet friendly" },
];

const STORAGE_KEY = "rentRealEstateListingForm";

const defaultFormData: ListingFormData = {
  title: "",
  description: "",
  propertyType: "",
  listingType: "",
  city: "",
  area: "",
  ward: "",
  address: "",
  latitude: "",
  longitude: "",
  monthlyRentMin: "",
  monthlyRentMax: "",
  bedrooms: "",
  bathrooms: "",
  sqft: "",
  availableFrom: "",
  amenities: {
    furnished: false,
    parking: false,
    wifi: false,
    water: false,
    electricity: false,
    pet: false,
  },
  ownerType: "owner",
  noBroker: false,
  landmarks: [],
  houseRules: [],
  photos: [],
};

type Updater =
  | Partial<ListingFormData>
  | ((prev: ListingFormData) => Partial<ListingFormData>);

interface ListingFormContextValue {
  formData: ListingFormData;
  updateForm: (patch: Updater) => void;
  resetForm: () => void;
}

const ListingFormContext = createContext<ListingFormContextValue | null>(null);

function toPersistable(data: ListingFormData) {
  const { photos, ...rest } = data;
  return rest;
}

export function ListingFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ListingFormData>(defaultFormData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {
        // ignore corrupt draft
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toPersistable(formData)));
    } catch (err) {
      console.warn("[ListingFormContext] Could not persist draft:", err);
    }
  }, [formData, hydrated]);

  const updateForm = (patch: Updater) => {
    setFormData((prev) => ({
      ...prev,
      ...(typeof patch === "function" ? patch(prev) : patch),
    }));
  };

  const resetForm = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setFormData(defaultFormData);
  };

  return (
    <ListingFormContext.Provider value={{ formData, updateForm, resetForm }}>
      {children}
    </ListingFormContext.Provider>
  );
}

export function useListingForm() {
  const ctx = useContext(ListingFormContext);
  if (!ctx) {
    throw new Error("useListingForm must be used within a ListingFormProvider");
  }
  return ctx;
}