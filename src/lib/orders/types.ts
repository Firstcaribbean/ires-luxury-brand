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

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  size: string;
};

export type OrderRecord = {
  id: string;
  trackingId: string;
  customerName: string;
  phone: string;
  normalizedPhone: string;
  address: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory: OrderStatusEntry[];
  deliveryNote?: string;
  orderReceivedConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BookingInput = {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
};

export type DeliveryConfirmationInput = {
  trackingId: string;
  note: string;
};

export type AdminSession = {
  email: string;
  mode: "firebase" | "demo";
  signedInAt: string;
};
