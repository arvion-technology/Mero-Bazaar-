"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

export type CartItem = {
  id: string;
  listingId: string;
  name: string;
  description?: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
};

export type DeliveryInfo = {
  firstName: string;
  region: string;
  phone: string;
  city: string;
  address: string;
};

type FoodCartContextType = {
  items: CartItem[];
  selectedIds: string[];
  deliveryInfo: DeliveryInfo;
  paymentMethod: "esewa" | "khalti" | "connectips" | null;
  selectedItems: CartItem[];
  selectedCount: number;
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  deleteSelected: () => void;
  setDeliveryInfo: (info: Partial<DeliveryInfo>) => void;
  setPaymentMethod: (method: "esewa" | "khalti" | "connectips") => void;
  clearCart: () => void;
};

const DELIVERY_FEE = 40;
const PLATFORM_FEE = 10;

const defaultDelivery: DeliveryInfo = {
  firstName: "",
  region: "",
  phone: "",
  city: "",
  address: "",
};

const FoodCartContext = createContext<FoodCartContextType | null>(null);

export function FoodCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deliveryInfo, setDeliveryInfoState] = useState<DeliveryInfo>(defaultDelivery);
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "khalti" | "connectips" | null>(null);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i));
      }
      return [...prev, item];
    });
    setSelectedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, [removeItem]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(items.map((i) => i.id));
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const deleteSelected = useCallback(() => {
    setItems((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
    setSelectedIds([]);
  }, [selectedIds]);

  const setDeliveryInfo = useCallback((info: Partial<DeliveryInfo>) => {
    setDeliveryInfoState((prev) => ({ ...prev, ...info }));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedIds([]);
    setDeliveryInfoState(defaultDelivery);
    setPaymentMethod(null);
  }, []);

  const selectedItems = useMemo(() => items.filter((i) => selectedIds.includes(i.id)), [items, selectedIds]);
  const selectedCount = selectedItems.length;
  const itemTotal = useMemo(() => selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0), [selectedItems]);
  const deliveryFee = useMemo(() => (selectedCount > 0 ? DELIVERY_FEE : 0), [selectedCount]);
  const platformFee = useMemo(() => (selectedCount > 0 ? PLATFORM_FEE : 0), [selectedCount]);
  const totalAmount = useMemo(() => itemTotal + deliveryFee + platformFee, [itemTotal, deliveryFee, platformFee]);

  const value = useMemo(
    () => ({
      items, selectedIds, deliveryInfo, paymentMethod,
      selectedItems, selectedCount, itemTotal, deliveryFee, platformFee, totalAmount,
      addItem, removeItem, updateQuantity, toggleSelect, selectAll, deselectAll, deleteSelected,
      setDeliveryInfo, setPaymentMethod, clearCart,
    }),
    [items, selectedIds, deliveryInfo, paymentMethod, selectedItems, selectedCount, itemTotal, deliveryFee, platformFee, totalAmount, addItem, removeItem, updateQuantity, toggleSelect, selectAll, deselectAll, deleteSelected, setDeliveryInfo, setPaymentMethod, clearCart]
  );

  return <FoodCartContext.Provider value={value}>{children}</FoodCartContext.Provider>;
}

export function useFoodCart() {
  const ctx = useContext(FoodCartContext);
  if (!ctx) throw new Error("useFoodCart must be used inside FoodCartProvider");
  return ctx;
}