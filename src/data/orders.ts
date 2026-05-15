import type { OrderRecord } from "@/lib/orders/types";

export const demoSeedOrders: OrderRecord[] = [
  {
    id: "demo-10425",
    trackingId: "MDP-10425",
    customerName: "Amara Cole",
    phone: "+1 555-101-2400",
    normalizedPhone: "15551012400",
    address: "14 Mercer Crescent, Los Angeles, CA",
    productName: "Nocturne Gold",
    quantity: 1,
    status: "With Delivery Company",
    statusHistory: [
      { status: "Order Received", updatedAt: "2026-05-13T10:20:00.000Z" },
      {
        status: "Dispatched from Store",
        updatedAt: "2026-05-14T08:45:00.000Z",
      },
      {
        status: "With Delivery Company",
        updatedAt: "2026-05-15T09:10:00.000Z",
      },
    ],
    proofImageUrl: null,
    deliveryNote: "",
    orderReceivedConfirmed: false,
    createdAt: "2026-05-13T10:20:00.000Z",
    updatedAt: "2026-05-15T09:10:00.000Z",
  },
  {
    id: "demo-10426",
    trackingId: "MDP-10426",
    customerName: "Julian Hart",
    phone: "+1 555-120-5589",
    normalizedPhone: "15551205589",
    address: "220 Park Lane, Beverly Hills, CA",
    productName: "Velvet Ember",
    quantity: 2,
    status: "Out for Delivery",
    statusHistory: [
      { status: "Order Received", updatedAt: "2026-05-13T14:15:00.000Z" },
      {
        status: "Dispatched from Store",
        updatedAt: "2026-05-14T11:05:00.000Z",
      },
      {
        status: "With Delivery Company",
        updatedAt: "2026-05-15T07:20:00.000Z",
      },
      {
        status: "Out for Delivery",
        updatedAt: "2026-05-15T10:15:00.000Z",
      },
    ],
    proofImageUrl: null,
    deliveryNote: "",
    orderReceivedConfirmed: false,
    createdAt: "2026-05-13T14:15:00.000Z",
    updatedAt: "2026-05-15T10:15:00.000Z",
  },
  {
    id: "demo-10427",
    trackingId: "MDP-10427",
    customerName: "Nadia Stone",
    phone: "+1 555-140-7721",
    normalizedPhone: "15551407721",
    address: "8 Ocean Terrace, Santa Monica, CA",
    productName: "Ivory Bloom",
    quantity: 1,
    status: "Delivered",
    statusHistory: [
      { status: "Order Received", updatedAt: "2026-05-11T09:00:00.000Z" },
      {
        status: "Dispatched from Store",
        updatedAt: "2026-05-12T08:00:00.000Z",
      },
      {
        status: "With Delivery Company",
        updatedAt: "2026-05-13T13:25:00.000Z",
      },
      {
        status: "Out for Delivery",
        updatedAt: "2026-05-14T10:40:00.000Z",
      },
      { status: "Delivered", updatedAt: "2026-05-14T16:50:00.000Z" },
    ],
    proofImageUrl: null,
    deliveryNote: "Customer confirmed safe arrival.",
    orderReceivedConfirmed: true,
    createdAt: "2026-05-11T09:00:00.000Z",
    updatedAt: "2026-05-14T16:50:00.000Z",
  },
];
