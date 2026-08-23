export type CheckoutQueue = {
  orderIds: string[];
  paymentMethod: "esewa" | "khalti";
};

const KEY = "mb_checkout_queue";

export function saveCheckoutQueue(queue: CheckoutQueue) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(queue));
}

export function getCheckoutQueue(): CheckoutQueue | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CheckoutQueue;
  } catch {
    return null;
  }
}

export function clearCheckoutQueue() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function hasMoreInQueue(): boolean {
  const q = getCheckoutQueue();
  return !!q && q.orderIds.length > 0;
}

export function popNextOrder(): { orderId: string; paymentMethod: "esewa" | "khalti" } | null {
  const queue = getCheckoutQueue();
  if (!queue || queue.orderIds.length === 0) {
    clearCheckoutQueue();
    return null;
  }
  const [orderId, ...rest] = queue.orderIds;
  if (rest.length === 0) {
    clearCheckoutQueue();
  } else {
    saveCheckoutQueue({ ...queue, orderIds: rest });
  }
  return { orderId, paymentMethod: queue.paymentMethod };
}