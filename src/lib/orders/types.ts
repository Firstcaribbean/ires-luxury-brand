export const orderStatuses = [
  "Order Received",
  "Dispatched from Store",
  "With Delivery Company",
  "Out for Delivery",
  "Delivered",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export type OrderStatusEntry = {
  status: OrderStatus;
  updatedAt: string;
};

export type OrderRecord = {
  id: string;
  trackingId: string;
  customerName: string;
  phone: string;
  normalizedPhone: string;
  address: string;
  productId?: string;
  productName: string;
  quantity: number;
  status: OrderStatus;
  statusHistory: OrderStatusEntry[];
  proofImageUrl?: string | null;
  deliveryNote?: string;
  orderReceivedConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BookingInput = {
  customerName: string;
  phone: string;
  address: string;
  productId?: string;
  productName: string;
  quantity: number;
};

export type DeliveryConfirmationInput = {
  trackingId: string;
  note: string;
  file?: File | null;
};

export type AdminSession = {
  email: string;
  mode: "firebase" | "demo";
  signedInAt: string;
};
