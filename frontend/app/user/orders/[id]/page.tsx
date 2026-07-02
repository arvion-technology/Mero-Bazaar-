"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  FiGrid, FiShoppingBag, FiHeart, FiBell, FiHelpCircle, FiSettings,
  FiTrash2, FiAlertTriangle, FiLogOut, FiUser, FiChevronDown,
  FiMenu, FiX, FiMoreHorizontal, FiAlertCircle,
  FiShare2, FiPhone, FiMail, FiStar, FiArrowLeft,
} from "react-icons/fi";

// Dynamically import Leaflet map to avoid SSR issues
const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%",
      height: "260px",
      background: "#e2e8f0",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#94a3b8",
      fontSize: "13px",
    }}>
      Loading map...
    </div>
  ),
});

const PRIMARY = "#C0392B";

// Kathmandu area coordinates for each order's pickup/dropoff
const LOCATION_COORDS: Record<string, { pickup: [number, number]; dropoff: [number, number] }> = {
  "#1024": { pickup: [27.6892, 85.3348], dropoff: [27.7033, 85.3310] },
  "#1023": { pickup: [27.7147, 85.3106], dropoff: [27.7173, 85.3240] },
  "#1022": { pickup: [27.6790, 85.3490], dropoff: [27.7215, 85.3615] },
  "#1021": { pickup: [27.6892, 85.3348], dropoff: [27.6687, 85.3207] },
  "#1020": { pickup: [27.6935, 85.2817], dropoff: [27.6980, 85.2980] },
  "#1019": { pickup: [27.7100, 85.3175], dropoff: [27.7350, 85.3350] },
  "#1018": { pickup: [27.7060, 85.3165], dropoff: [27.7145, 85.3250] },
  "#1017": { pickup: [27.7040, 85.3120], dropoff: [27.6710, 85.4290] },
  "#1016": { pickup: [27.7180, 85.3450], dropoff: [27.7355, 85.3280] },
  "#1015": { pickup: [27.6735, 85.3145], dropoff: [27.6780, 85.3220] },
  "#1014": { pickup: [27.6935, 85.2817], dropoff: [27.6985, 85.3080] },
  "#1013": { pickup: [27.7350, 85.3150], dropoff: [27.7330, 85.3050] },
  "#1012": { pickup: [27.6892, 85.3348], dropoff: [27.6850, 85.3480] },
  "#1011": { pickup: [27.7055, 85.3090], dropoff: [27.7110, 85.3120] },
  "#1010": { pickup: [27.6735, 85.3145], dropoff: [27.6770, 85.3165] },
};

const ALL_ORDERS = [
  {
    id: "#1024",
    placedOn: "Jun 22, 2025 10:30 AM",
    item: "Laptop Stand",
    category: "Electronics > Accessories",
    description: "Adjustable aluminum laptop stand with ergonomic design. Compatible with all laptops 10\"-17\".",
    image: "https://plus.unsplash.com/premium_photo-1683326528070-4ebec9188ae1?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 850",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 850",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "May 28, 2024 02:30 PM",
    deliveryPartner: "Pathao",
    trackingId: "PA12341234NP",
    vendor: {
      name: "Tech World Nepal",
      rating: 4.5,
      reviewCount: 128,
      phone: "9845678943",
      email: "techworldnepal@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Tech+World+Nepal&background=C0392B&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Tech World Nepal", address: "New Baneshwor, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Maitidevi-32, Kathmandu", address: "Maitidevi-32, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1023",
    placedOn: "Jun 19, 2025 09:15 AM",
    item: "Wireless Keyboard",
    category: "Electronics > Accessories",
    description: "Slim wireless keyboard with silent keys and long battery life. Bluetooth 5.0 connectivity.",
    image: "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8V2lyZWxlc3MlMjBLZXlib2FyZHxlbnwwfHwwfHx8MA%3D%3D",
    itemTotal: "NPR 1,200",
    shippingFee: "NPR 50",
    discount: "NPR 0",
    totalAmount: "NPR 1,250",
    status: "Shipped",
    statusColor: "#6366f1",
    paymentMethod: "Khalti",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "Jun 25, 2025 11:00 AM",
    deliveryPartner: "Pathao",
    trackingId: "PA56785678NP",
    vendor: {
      name: "Gadget Hub Nepal",
      rating: 4.2,
      reviewCount: 89,
      phone: "9812345678",
      email: "gadgethub@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Gadget+Hub+Nepal&background=6366f1&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Gadget Hub Nepal", address: "Thamel, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Lazimpat, Kathmandu", address: "Lazimpat, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1022",
    placedOn: "Jun 15, 2025 02:45 PM",
    item: "USB Hub 7-Port",
    category: "Electronics > Accessories",
    description: "7-port USB 3.0 hub with individual power switches and LED indicators.",
    image: "https://media.istockphoto.com/id/2245857025/photo/usb-3-0-7-port-hub-with-power-buttons-for-device-repairs.webp?a=1&b=1&s=612x612&w=0&k=20&c=XIz8GW9CoMqlgm1kuTLk2Z3EXKFncQCVQxukJvEw6cs=",
    itemTotal: "NPR 650",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 650",
    status: "Processing",
    statusColor: "#f59e0b",
    paymentMethod: "eSewa",
    paymentStatus: "Pending",
    paymentStatusColor: "#f59e0b",
    deliveryOn: "Jun 22, 2025 03:00 PM",
    deliveryPartner: "Pathao",
    trackingId: "PA90129012NP",
    vendor: {
      name: "Digital Store Nepal",
      rating: 4.0,
      reviewCount: 56,
      phone: "9854321098",
      email: "digitalstore@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Digital+Store+Nepal&background=f59e0b&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Digital Store Nepal", address: "Koteshwor, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Boudha, Kathmandu", address: "Boudha, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1021",
    placedOn: "Jun 10, 2025 11:20 AM",
    item: "Monitor Light Bar",
    category: "Electronics > Accessories",
    description: "LED monitor light bar with adjustable brightness and color temperature.",
    image: "https://plus.unsplash.com/premium_photo-1681470644798-dd63dc4a0851?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8TW9uaXRvciUyMExpZ2h0JTIwQmFyfGVufDB8fDB8fHww",
    itemTotal: "NPR 1,450",
    shippingFee: "NPR 0",
    discount: "NPR 50",
    totalAmount: "NPR 1,400",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "Khalti",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "Jun 17, 2025 10:00 AM",
    deliveryPartner: "Pathao",
    trackingId: "PA34563456NP",
    vendor: {
      name: "Tech World Nepal",
      rating: 4.5,
      reviewCount: 128,
      phone: "9845678943",
      email: "techworldnepal@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Tech+World+Nepal&background=C0392B&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Tech World Nepal", address: "New Baneshwor, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Patan, Lalitpur", address: "Patan, Lalitpur", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1020",
    placedOn: "Jun 5, 2025 04:00 PM",
    item: "Mechanical Keyboard",
    category: "Electronics > Accessories",
    description: "RGB mechanical keyboard with hot-swappable switches and customizable lighting.",
    image: "https://plus.unsplash.com/premium_photo-1683543124615-fb42e42c6201?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TWVjaGFuaWNhbCUyMEtleWJvYXJkfGVufDB8fDB8fHww",
    itemTotal: "NPR 2,800",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 2,800",
    status: "Cancelled",
    statusColor: "#ef4444",
    paymentMethod: "eSewa",
    paymentStatus: "Refunded",
    paymentStatusColor: "#ef4444",
    deliveryOn: "—",
    deliveryPartner: "—",
    trackingId: "—",
    vendor: {
      name: "Gaming Gear Nepal",
      rating: 3.8,
      reviewCount: 34,
      phone: "9867890123",
      email: "gaminggear@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Gaming+Gear+Nepal&background=ef4444&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Gaming Gear Nepal", address: "Kalanki, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Kalimati, Kathmandu", address: "Kalimati, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1019",
    placedOn: "May 30, 2025 08:30 AM",
    item: "Webcam HD 1080p",
    category: "Electronics > Accessories",
    description: "Full HD 1080p webcam with built-in microphone and auto-focus.",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 3,200",
    shippingFee: "NPR 0",
    discount: "NPR 100",
    totalAmount: "NPR 3,100",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "Khalti",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "Jun 5, 2025 09:30 AM",
    deliveryPartner: "Pathao",
    trackingId: "PA78907890NP",
    vendor: {
      name: "Camera World Nepal",
      rating: 4.7,
      reviewCount: 210,
      phone: "9801234567",
      email: "cameraworld@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Camera+World+Nepal&background=22c55e&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Camera World Nepal", address: "Durbarmarg, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Maharajgunj, Kathmandu", address: "Maharajgunj, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1018",
    placedOn: "May 24, 2025 01:10 PM",
    item: "Desk Mat XL",
    category: "Electronics > Accessories",
    description: "Extra large desk mat with stitched edges and non-slip rubber base.",
    image: "https://images.unsplash.com/photo-1596347909571-2f249cfdbb0a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fERlc2slMjBNYXQlMjBYTHxlbnwwfHwwfHx8MA%3D%3D",
    itemTotal: "NPR 550",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 550",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "May 30, 2025 02:00 PM",
    deliveryPartner: "Pathao",
    trackingId: "PA12351235NP",
    vendor: {
      name: "Office Supplies Nepal",
      rating: 4.3,
      reviewCount: 76,
      phone: "9810987654",
      email: "officesupplies@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Office+Supplies+Nepal&background=22c55e&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Office Supplies Nepal", address: "Putalisadak, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Naxal, Kathmandu", address: "Naxal, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1017",
    placedOn: "May 18, 2025 03:20 PM",
    item: "GPU RTX 3060",
    category: "Electronics > Components",
    description: "NVIDIA GeForce RTX 3060 12GB GDDR6 graphics card with ray tracing support.",
    image: "https://images.unsplash.com/photo-1727895949000-da3c10a7d562?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEdQVSUyMFJUWCUyMDMwNjB8ZW58MHx8MHx8fDA%3D",
    itemTotal: "NPR 45,000",
    shippingFee: "NPR 200",
    discount: "NPR 500",
    totalAmount: "NPR 44,700",
    status: "Shipped",
    statusColor: "#6366f1",
    paymentMethod: "Khalti",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "May 25, 2025 11:00 AM",
    deliveryPartner: "Pathao",
    trackingId: "PA56795679NP",
    vendor: {
      name: "PC Build Nepal",
      rating: 4.6,
      reviewCount: 156,
      phone: "9845123456",
      email: "pcbuild@gmail.com",
      logo: "https://ui-avatars.com/api/?name=PC+Build+Nepal&background=6366f1&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "PC Build Nepal", address: "New Road, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Bhaktapur, Nepal", address: "Bhaktapur, Nepal", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1016",
    placedOn: "May 12, 2025 10:45 AM",
    item: "LED Desk Lamp",
    category: "Electronics > Accessories",
    description: "Smart LED desk lamp with touch controls and wireless charging base.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 720",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 720",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "May 18, 2025 04:00 PM",
    deliveryPartner: "Pathao",
    trackingId: "PA90139013NP",
    vendor: {
      name: "Smart Home Nepal",
      rating: 4.1,
      reviewCount: 45,
      phone: "9865432109",
      email: "smarthome@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Smart+Home+Nepal&background=22c55e&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Smart Home Nepal", address: "Chabahil, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Gongabu, Kathmandu", address: "Gongabu, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1015",
    placedOn: "May 5, 2025 12:00 PM",
    item: "Headset Wireless",
    category: "Electronics > Audio",
    description: "Over-ear wireless headset with active noise cancellation and 30-hour battery.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 4,500",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 4,500",
    status: "Processing",
    statusColor: "#f59e0b",
    paymentMethod: "Khalti",
    paymentStatus: "Pending",
    paymentStatusColor: "#f59e0b",
    deliveryOn: "May 15, 2025 01:00 PM",
    deliveryPartner: "Pathao",
    trackingId: "PA34573457NP",
    vendor: {
      name: "Audio Zone Nepal",
      rating: 4.4,
      reviewCount: 98,
      phone: "9809876543",
      email: "audiozone@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Audio+Zone+Nepal&background=f59e0b&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Audio Zone Nepal", address: "Jawalakhel, Lalitpur", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Kumaripati, Lalitpur", address: "Kumaripati, Lalitpur", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1014",
    placedOn: "Apr 28, 2025 09:30 AM",
    item: "Mouse Pad Gaming",
    category: "Electronics > Accessories",
    description: "Extended gaming mouse pad with anti-fray stitched edges and water-resistant surface.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 380",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 380",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "May 3, 2025 10:30 AM",
    deliveryPartner: "Pathao",
    trackingId: "PA78917891NP",
    vendor: {
      name: "Gaming Gear Nepal",
      rating: 3.8,
      reviewCount: 34,
      phone: "9867890123",
      email: "gaminggear@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Gaming+Gear+Nepal&background=22c55e&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Gaming Gear Nepal", address: "Kalanki, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Teku, Kathmandu", address: "Teku, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1013",
    placedOn: "Apr 20, 2025 02:15 PM",
    item: "External SSD 1TB",
    category: "Electronics > Storage",
    description: "Portable 1TB external SSD with USB-C 3.2 Gen 2 and read speeds up to 1050MB/s.",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 6,800",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 6,800",
    status: "Cancelled",
    statusColor: "#ef4444",
    paymentMethod: "Khalti",
    paymentStatus: "Refunded",
    paymentStatusColor: "#ef4444",
    deliveryOn: "—",
    deliveryPartner: "—",
    trackingId: "—",
    vendor: {
      name: "Storage Solutions Nepal",
      rating: 4.0,
      reviewCount: 67,
      phone: "9856789012",
      email: "storagesolutions@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Storage+Solutions+Nepal&background=ef4444&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Storage Solutions Nepal", address: "Balaju, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Samakhusi, Kathmandu", address: "Samakhusi, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1012",
    placedOn: "Apr 14, 2025 11:00 AM",
    item: "Router Dual Band",
    category: "Electronics > Networking",
    description: "Dual-band Wi-Fi 6 router with 4 antennas and parental controls.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 3,200",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 3,200",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "Apr 20, 2025 03:00 PM",
    deliveryPartner: "Pathao",
    trackingId: "PA12361236NP",
    vendor: {
      name: "Network Pro Nepal",
      rating: 4.2,
      reviewCount: 82,
      phone: "9843210987",
      email: "networkpro@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Network+Pro+Nepal&background=22c55e&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Network Pro Nepal", address: "Baneshwor, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Tinkune, Kathmandu", address: "Tinkune, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1011",
    placedOn: "Apr 7, 2025 10:00 AM",
    item: "Power Bank 20000mAh",
    category: "Electronics > Accessories",
    description: "20000mAh power bank with 22.5W fast charging and dual USB-C ports.",
    image: "https://images.unsplash.com/photo-1609592424308-646c9a5e2d7c?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 1,800",
    shippingFee: "NPR 0",
    discount: "NPR 0",
    totalAmount: "NPR 1,800",
    status: "Delivery",
    statusColor: "#22c55e",
    paymentMethod: "Khalti",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "Apr 12, 2025 11:30 AM",
    deliveryPartner: "Pathao",
    trackingId: "PA567A567ANP",
    vendor: {
      name: "Mobile Accessories Nepal",
      rating: 4.3,
      reviewCount: 112,
      phone: "9812345670",
      email: "mobileacc@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Mobile+Accessories+Nepal&background=22c55e&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Mobile Accessories Nepal", address: "Mahaboudha, Kathmandu", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Chhetrapati, Kathmandu", address: "Chhetrapati, Kathmandu", province: "Bagmati Province, Nepal" },
    },
  },
  {
    id: "#1010",
    placedOn: "Mar 31, 2025 04:30 PM",
    item: "Microphone Studio",
    category: "Electronics > Audio",
    description: "Professional USB condenser microphone with shock mount and pop filter.",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=60",
    itemTotal: "NPR 5,500",
    shippingFee: "NPR 100",
    discount: "NPR 0",
    totalAmount: "NPR 5,600",
    status: "Shipped",
    statusColor: "#6366f1",
    paymentMethod: "eSewa",
    paymentStatus: "Paid",
    paymentStatusColor: "#22c55e",
    deliveryOn: "Apr 8, 2025 09:00 AM",
    deliveryPartner: "Pathao",
    trackingId: "PA90149014NP",
    vendor: {
      name: "Audio Zone Nepal",
      rating: 4.4,
      reviewCount: 98,
      phone: "9809876543",
      email: "audiozone@gmail.com",
      logo: "https://ui-avatars.com/api/?name=Audio+Zone+Nepal&background=6366f1&color=fff&size=64",
    },
    deliveryRoute: {
      pickup: { label: "Pickup Location (Vendor)", name: "Audio Zone Nepal", address: "Jawalakhel, Lalitpur", province: "Bagmati Province, Nepal" },
      dropoff: { label: "Delivery Location (Customer)", name: "Pulchowk, Lalitpur", address: "Pulchowk, Lalitpur", province: "Bagmati Province, Nepal" },
    },
  },
];

const sidebarItems = [
  { id: "dashboard", icon: FiGrid, label: "Dashboard", href: "/user/dashboard" },
  { id: "orders", icon: FiShoppingBag, label: "My Orders", href: "/user/orders" },
  { id: "wishlist", icon: FiHeart, label: "Wishlist", href: "/user/wishlist" },
  { id: "notification", icon: FiBell, label: "Notifications", href: "/user/notifications" },
  { id: "help", icon: FiHelpCircle, label: "Help & Support", href: "/user/help" },
  { id: "settings", icon: FiSettings, label: "Settings", href: "/user/settings" },
];

function renderStars(rating: number, reviewCount: number) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ display: "flex", gap: 2 }}>
        {Array.from({ length: full }).map((_, i) => (
          <FiStar key={`f${i}`} size={13} color="#f59e0b" fill="#f59e0b" />
        ))}
        {half && <FiStar key="h" size={13} color="#f59e0b" fill="#f59e0b" />}
        {Array.from({ length: empty }).map((_, i) => (
          <FiStar key={`e${i}`} size={13} color="#e2e8f0" />
        ))}
      </span>
      <span style={{ fontSize: 12, color: "#64748b" }}>
        {rating} ({reviewCount})
      </span>
    </span>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifSeen, setNotifSeen] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const notifications: string[] = session
    ? ([
        !session.user?.phone && "Add your phone number",
        !session.user?.address && "Add your address",
      ].filter(Boolean) as string[])
    : [];
  const notificationCount = notifications.length;

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (sidebarOpen) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/user/delete-account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to delete account");
      }
      await signOut({ redirect: false });
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setDeleteError(msg);
      setDeleting(false);
    }
  }

  const o = ALL_ORDERS.find((order) => order.id === `#${orderId}`) || ALL_ORDERS[0];
  const coords = LOCATION_COORDS[o.id] || { pickup: [27.6892, 85.3348] as [number, number], dropoff: [27.7033, 85.3310] as [number, number] };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overflow-x: hidden; max-width: 100vw; }
        .ud-page { min-height: 100vh; min-height: 100dvh; background: #f1f5f9; display: flex; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .ud-sidebar { width: 260px; background: #ffffff; border-right: 1px solid #e8ecf0; display: flex; flex-direction: column; flex-shrink: 0; transition: width 0.3s ease, transform 0.3s ease; position: fixed; height: 100vh; height: 100dvh; left: 0; top: 0; z-index: 100; box-shadow: 2px 0 8px rgba(0,0,0,0.04); }
        .ud-sidebar.collapsed { width: 72px; }
        .ud-sidebar-header { padding: 20px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #f0f2f5; min-height: 72px; overflow: hidden; }
        .ud-sidebar-logo-wrap { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .ud-sidebar-logo-icon { width: 36px; height: 36px; flex-shrink: 0; }
        .ud-sidebar-logo-text { display: flex; flex-direction: column; line-height: 1.1; opacity: 1; transition: opacity 0.2s, width 0.2s; white-space: nowrap; overflow: hidden; }
        .ud-sidebar.collapsed .ud-sidebar-logo-text { opacity: 0; width: 0; }
        .ud-logo-line1 { font-size: 14px; font-weight: 800; color: #C0392B; letter-spacing: -0.3px; }
        .ud-logo-line2 { font-size: 11px; font-weight: 600; color: #888; letter-spacing: 0.5px; text-transform: uppercase; }
        .ud-nav-section { padding: 16px 12px; flex: 1; overflow-y: auto; }
        .ud-nav-label { font-size: 10px; font-weight: 700; color: #b0b8c4; text-transform: uppercase; letter-spacing: 1.2px; padding: 0 12px; margin-bottom: 8px; white-space: nowrap; }
        .ud-sidebar.collapsed .ud-nav-label { display: none; }
        .ud-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; color: #5a6478; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; border: none; background: none; width: 100%; text-align: left; font-family: inherit; text-decoration: none; border-radius: 10px; margin-bottom: 2px; position: relative; white-space: nowrap; }
        .ud-nav-item:hover { background: #f4f6fb; color: #1e293b; }
        .ud-nav-item.active { background: #fff5f5; color: #C0392B; font-weight: 600; }
        .ud-nav-item.active::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 20px; background: #C0392B; border-radius: 0 3px 3px 0; }
        .ud-nav-icon { font-size: 18px; width: 22px; display: flex; justify-content: center; flex-shrink: 0; }
        .ud-nav-text { opacity: 1; transition: opacity 0.2s; }
        .ud-sidebar.collapsed .ud-nav-text { opacity: 0; width: 0; overflow: hidden; }
        .ud-nav-item.danger { color: rgba(239,68,68,0.7); }
        .ud-nav-item.danger:hover { background: rgba(239,68,68,0.06); color: #ef4444; }
        .ud-main-area { flex: 1; margin-left: 260px; display: flex; flex-direction: column; min-height: 100vh; min-height: 100dvh; transition: margin-left 0.3s ease; width: calc(100% - 260px); min-width: 0; }
        .ud-sidebar.collapsed ~ .ud-main-area { margin-left: 72px; width: calc(100% - 72px); }
        .ud-topbar { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 32px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; gap: 16px; }
        .ud-topbar-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
        .ud-toggle-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; flex-shrink: 0; }
        .ud-toggle-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-breadcrumb { font-size: 20px; font-weight: 700; color: #1e293b; letter-spacing: -0.3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ud-topbar-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .ud-icon-btn { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; position: relative; flex-shrink: 0; }
        .ud-icon-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-badge { position: absolute; top: -2px; right: -2px; width: 18px; height: 18px; background: #ef4444; color: #fff; font-size: 10px; font-weight: 700; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }
        .ud-profile-wrap { position: relative; }
        .ud-profile-btn { display: flex; align-items: center; gap: 8px; padding: 5px 10px 5px 5px; border-radius: 40px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .ud-profile-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
        .ud-profile-btn-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #C0392B, #e74c3c); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; overflow: hidden; flex-shrink: 0; }
        .ud-profile-chevron { color: #94a3b8; transition: transform 0.2s; flex-shrink: 0; }
        .ud-profile-chevron.open { transform: rotate(180deg); }
        .ud-profile-dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); min-width: 200px; z-index: 999; overflow: hidden; animation: dropdownIn 0.15s ease; }
        @keyframes dropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .ud-dropdown-header { padding: 14px 16px 12px; border-bottom: 1px solid #f1f5f9; }
        .ud-dropdown-username { font-size: 14px; font-weight: 700; color: #1e293b; }
        .ud-dropdown-email { font-size: 12px; color: #94a3b8; margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ud-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 11px 16px; font-size: 14px; font-weight: 500; color: #475569; cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%; text-align: left; font-family: inherit; text-decoration: none; }
        .ud-dropdown-item:hover { background: #f8fafc; color: #1e293b; }
        .ud-dropdown-item.logout { color: #ef4444; }
        .ud-dropdown-item.logout:hover { background: #fef2f2; color: #dc2626; }
        .ud-dropdown-divider { height: 1px; background: #f1f5f9; }
        .ud-main { flex: 1; padding: 28px 32px; overflow-y: auto; min-width: 0; }
        .od-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .od-back-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; flex-shrink: 0; text-decoration: none; }
        .od-back-btn:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .od-title { font-size: 22px; font-weight: 700; color: #1e293b; letter-spacing: -0.4px; }
        .od-subtitle { font-size: 13px; color: #64748b; margin-top: 2px; }
        .od-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }
        .od-left { display: flex; flex-direction: column; gap: 20px; }
        .od-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .od-product-img { width: 100%; height: 260px; object-fit: fill; display: block; }
        .od-product-body { padding: 20px; }
        .od-product-name { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
        .od-product-cat { font-size: 12px; color: #94a3b8; margin-bottom: 10px; }
        .od-product-desc { font-size: 13px; color: #64748b; line-height: 1.6; }
        .od-delivery-card { padding: 20px; }
        .od-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .od-card-title { font-size: 15px; font-weight: 700; color: #1e293b; }
        .od-status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .od-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .od-info-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 13px; color: #64748b; }
        .od-info-row:not(:last-child) { border-bottom: 1px solid #f8fafc; }
        .od-info-label { color: #94a3b8; }
        .od-info-value { font-weight: 600; color: #1e293b; }
        .od-track-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px; border: none; background: #6366f1; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background 0.2s; }
        .od-track-btn:hover { background: #4f46e5; }
        .od-route-card { padding: 20px; }
        .od-route-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .od-share-btn { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .od-share-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
        .od-route-map { background: #f1f5f9; border-radius: 10px; height: 260px; position: relative; overflow: hidden; margin-bottom: 16px; }
        .od-route-map .leaflet-container { border-radius: 10px; }
        .od-route-labels { display: flex; gap: 12px; }
        .od-route-label-box { flex: 1; background: #fff; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px 12px; }
        .od-route-label-box .label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .od-route-label-box .name { font-size: 12px; font-weight: 600; color: #1e293b; margin-bottom: 2px; }
        .od-route-label-box .addr { font-size: 11px; color: #94a3b8; line-height: 1.4; }
        .od-right { display: flex; flex-direction: column; gap: 20px; }
        .od-summary-card { padding: 20px; }
        .od-summary-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
        .od-summary-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 13px; color: #64748b; }
        .od-summary-row:not(:last-child) { border-bottom: 1px solid #f8fafc; }
        .od-summary-row.total { border-top: 2px solid #f1f5f9; border-bottom: none; padding-top: 14px; margin-top: 4px; }
        .od-summary-row.total .od-summary-val { font-size: 16px; font-weight: 700; color: #C0392B; }
        .od-summary-val { font-weight: 600; color: #1e293b; }
        .od-vendor-card { padding: 20px; }
        .od-vendor-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .od-vendor-logo { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
        .od-vendor-name { font-size: 14px; font-weight: 700; color: #1e293b; }
        .od-vendor-contact { display: flex; flex-direction: column; gap: 6px; }
        .od-vendor-contact-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #64748b; }
        .od-help-card { padding: 20px; }
        .od-help-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 6px; }
        .od-help-desc { font-size: 13px; color: #64748b; line-height: 1.6; margin-bottom: 14px; }
        .od-contact-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; border: 1.5px solid #6366f1; background: #fff; color: #6366f1; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-decoration: none; width: 100%; justify-content: center; }
        .od-contact-btn:hover { background: #6366f1; color: #fff; }
        .ud-backdrop { display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(2px); z-index: 99; }
        .ud-backdrop.active { display: block; }
        .ud-sidebar-close { display: none; position: absolute; top: 18px; right: 16px; width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 8px; cursor: pointer; align-items: center; justify-content: center; color: #64748b; transition: all 0.2s; z-index: 1; }
        .ud-sidebar-close:hover { background: #e2e8f0; color: #1e293b; }
        .ud-hamburger { display: none; width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; flex-shrink: 0; }
        .ud-hamburger:hover { background: #f8fafc; color: #334155; border-color: #cbd5e1; }
        .ud-desktop-toggle { display: flex; }
        @media (max-width: 1023px) { .ud-sidebar { transform: translateX(-100%); width: 280px !important; z-index: 200; } .ud-sidebar.mobile-open { transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.15); } .ud-sidebar.mobile-open .ud-sidebar-close { display: flex; } .ud-hamburger { display: flex; } .ud-desktop-toggle { display: none; } .ud-main-area { margin-left: 0 !important; width: 100% !important; } .ud-main { padding: 20px 20px 32px; } .ud-topbar { padding: 0 20px; } .od-grid { grid-template-columns: 1fr; } }
        @media (max-width: 767px) { .ud-main { padding: 16px; } .ud-topbar { padding: 0 16px; height: 56px; } .ud-breadcrumb { font-size: 18px; } .od-product-img { height: 200px; } .od-route-map { height: 220px; } }
        @media (max-width: 480px) { .ud-main { padding: 12px; } .ud-topbar { padding: 0 12px; } }
        .ud-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .ud-modal { background: #fff; border-radius: 16px; padding: 32px; width: 100%; max-width: 420px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); }
        .ud-modal-icon { width: 56px; height: 56px; border-radius: 14px; background: #fef2f2; display: flex; align-items: center; justify-content: center; color: #ef4444; margin: 0 auto 20px; }
        .ud-modal-title { font-size: 18px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 8px; }
        .ud-modal-body { font-size: 14px; color: #64748b; text-align: center; line-height: 1.6; margin-bottom: 24px; }
        .ud-modal-body strong { color: #ef4444; }
        .ud-modal-error { font-size: 13px; color: #ef4444; background: #fef2f2; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; text-align: center; }
        .ud-modal-actions { display: flex; gap: 12px; }
        .ud-modal-cancel { flex: 1; padding: 11px 0; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #fff; color: #475569; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .ud-modal-cancel:hover { background: #f8fafc; border-color: #cbd5e1; }
        .ud-modal-delete { flex: 1; padding: 11px 0; border-radius: 10px; border: none; background: #ef4444; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .ud-modal-delete:hover:not(:disabled) { background: #dc2626; }
        .ud-modal-delete:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      <div className={`ud-backdrop ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} aria-hidden="true" />

      <div className="ud-page">
        <aside className={`ud-sidebar ${sidebarOpen ? "mobile-open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}>
          <button type="button" className="ud-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><FiX size={18} /></button>
          <div className="ud-sidebar-header">
            <Link href="/" className="ud-sidebar-logo-wrap">
              <svg className="ud-sidebar-logo-icon" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="38" rx="8" fill={PRIMARY} />
                <path d="M10 10 C10 10, 14 8, 19 13 C24 18, 28 10, 28 10 M10 28 C10 28, 14 30, 19 25 C24 20, 28 28, 28 28 M10 10 Q10 19 10 28 M28 10 Q28 19 28 28 M14 19 C14 19 16 22 19 22 C22 22 24 19 24 19" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="19" cy="19" r="3" fill="#fff" opacity="0.9" />
              </svg>
              <div className="ud-sidebar-logo-text"><span className="ud-logo-line1">HamroNepal</span><span className="ud-logo-line2">Bazaar</span></div>
            </Link>
          </div>
          <div className="ud-nav-section">
            <div className="ud-nav-label">Menu</div>
            {sidebarItems.slice(0, 4).map((item) => (
              <Link key={item.id} href={item.href} className={`ud-nav-item ${item.id === "orders" ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
                <span className="ud-nav-icon"><item.icon size={18} /></span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}
            <div className="ud-nav-label" style={{ marginTop: 16 }}>Account</div>
            {sidebarItems.slice(4).map((item) => (
              <Link key={item.id} href={item.href} className="ud-nav-item" onClick={() => setSidebarOpen(false)}>
                <span className="ud-nav-icon"><item.icon size={18} /></span>
                <span className="ud-nav-text">{item.label}</span>
              </Link>
            ))}
            <button type="button" className="ud-nav-item danger" onClick={() => { setShowDeleteModal(true); setSidebarOpen(false); }}>
              <span className="ud-nav-icon"><FiTrash2 size={18} /></span>
              <span className="ud-nav-text">Delete Account</span>
            </button>
          </div>
        </aside>

        <div className="ud-main-area">
          <header className="ud-topbar">
            <div className="ud-topbar-left">
              <button type="button" className="ud-hamburger" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><FiMenu size={20} /></button>
              <button type="button" className="ud-toggle-btn ud-desktop-toggle" onClick={() => setSidebarCollapsed((p) => !p)}><FiMoreHorizontal size={18} /></button>
              <h1 className="ud-breadcrumb">Orders</h1>
            </div>
            <div className="ud-topbar-right">
              <div style={{ position: "relative" }} ref={notifDropdownRef}>
                <button type="button" className="ud-icon-btn" title="Notifications" onClick={() => { setShowNotifDropdown((v) => !v); setNotifSeen(true); }}>
                  <FiBell size={18} />
                  {notificationCount > 0 && !notifSeen && <span className="ud-badge">{notificationCount}</span>}
                </button>
                {showNotifDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: "280px", zIndex: 999, overflow: "hidden", animation: "dropdownIn 0.15s ease" }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "13px", color: "#1e293b" }}>Notifications</div>
                    {notifications.length > 0 ? notifications.map((msg, i) => (
                      <Link key={i} href="/user/settings" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", fontSize: "13px", color: "#475569", borderBottom: i < notifications.length - 1 ? "1px solid #f8fafc" : "none", textDecoration: "none" }} onClick={() => setShowNotifDropdown(false)}>
                        <FiAlertCircle size={15} color="#f59e0b" style={{ flexShrink: 0 }} />{msg}
                      </Link>
                    )) : (
                      <div style={{ padding: "16px", fontSize: "13px", color: "#94a3b8", textAlign: "center" }}>You are all caught up</div>
                    )}
                  </div>
                )}
              </div>
              <div className="ud-profile-wrap" ref={profileDropdownRef}>
                <button type="button" className="ud-profile-btn" onClick={() => setShowProfileDropdown((p) => !p)}>
                  <div className="ud-profile-btn-avatar">{session?.user?.image ? <img src={session.user.image} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : userInitials}</div>
                  <FiChevronDown size={14} className={`ud-profile-chevron ${showProfileDropdown ? "open" : ""}`} />
                </button>
                {showProfileDropdown && (
                  <div className="ud-profile-dropdown">
                    <div className="ud-dropdown-header">
                      <div className="ud-dropdown-username">{session?.user?.name || "User"}</div>
                      <div className="ud-dropdown-email">{session?.user?.email || ""}</div>
                    </div>
                    <Link href="/user/settings" className="ud-dropdown-item" onClick={() => setShowProfileDropdown(false)}><FiUser size={15} /> Profile &amp; Settings</Link>
                    <div className="ud-dropdown-divider" />
                    <button type="button" className="ud-dropdown-item logout" onClick={() => signOut({ callbackUrl: "/" })}><FiLogOut size={15} /> Logout</button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="ud-main">
            <div className="od-header">
              <Link href="/user/orders" className="od-back-btn" aria-label="Back to orders"><FiArrowLeft size={18} /></Link>
              <div>
                <div className="od-title">Orders</div>
                <div className="od-subtitle">Order ID: {o.id} &nbsp;&middot;&nbsp; Placed on: {o.placedOn}</div>
              </div>
            </div>

            <div className="od-grid">
              <div className="od-left">
                <div className="od-card">
                  <img src={o.image} alt={o.item} className="od-product-img" />
                  <div className="od-product-body">
                    <div className="od-product-name">{o.item}</div>
                    <div className="od-product-cat">Category: {o.category}</div>
                    <div className="od-product-desc">{o.description}</div>
                  </div>
                </div>

                <div className="od-card od-delivery-card">
                  <div className="od-card-header">
                    <div className="od-card-title">Delivery information</div>
                    <span className="od-status-pill" style={{ background: o.statusColor + "18", color: o.statusColor }}>
                      <span className="od-status-dot" style={{ background: o.statusColor }} />{o.status}
                    </span>
                  </div>
                  <div className="od-info-row"><span className="od-info-label">Delivery On</span><span className="od-info-value">{o.deliveryOn}</span></div>
                  <div className="od-info-row"><span className="od-info-label">Delivery Partner</span><span className="od-info-value">{o.deliveryPartner}</span></div>
                  <div className="od-info-row">
                    <span className="od-info-label">Tracking ID</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="od-info-value">{o.trackingId}</span>
                      {o.trackingId !== "—" && <Link href={`/track/${o.trackingId}`} className="od-track-btn">Track Order</Link>}
                    </span>
                  </div>
                </div>

                <div className="od-card od-route-card">
                  <div className="od-route-header">
                    <div className="od-card-title">Delivery Route</div>
                    <button type="button" className="od-share-btn"><FiShare2 size={13} /> Share</button>
                  </div>
                  <div className="od-route-map">
                    <DeliveryMap pickup={coords.pickup} dropoff={coords.dropoff} pickupLabel={o.deliveryRoute.pickup.name} dropoffLabel={o.deliveryRoute.dropoff.name} />
                  </div>
                  <div className="od-route-labels">
                    <div className="od-route-label-box">
                      <div className="label">{o.deliveryRoute.pickup.label}</div>
                      <div className="name">{o.deliveryRoute.pickup.name}</div>
                      <div className="addr">{o.deliveryRoute.pickup.address}<br />{o.deliveryRoute.pickup.province}</div>
                    </div>
                    <div className="od-route-label-box">
                      <div className="label">{o.deliveryRoute.dropoff.label}</div>
                      <div className="name">{o.deliveryRoute.dropoff.name}</div>
                      <div className="addr">{o.deliveryRoute.dropoff.address}<br />{o.deliveryRoute.dropoff.province}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="od-right">
                <div className="od-card od-summary-card">
                  <div className="od-summary-title">Order Summary</div>
                  <div className="od-summary-row"><span>Item Total</span><span className="od-summary-val">{o.itemTotal}</span></div>
                  <div className="od-summary-row"><span>Shipping Fee</span><span className="od-summary-val">{o.shippingFee}</span></div>
                  <div className="od-summary-row"><span>Discount</span><span className="od-summary-val">{o.discount}</span></div>
                  <div className="od-summary-row total"><span>Total Amount</span><span className="od-summary-val">{o.totalAmount}</span></div>
                  <div className="od-summary-row" style={{ marginTop: 8, borderBottom: "none" }}>
                    <span>Status</span>
                    <span className="od-status-pill" style={{ background: o.statusColor + "18", color: o.statusColor }}>
                      <span className="od-status-dot" style={{ background: o.statusColor }} />{o.status}
                    </span>
                  </div>
                  <div className="od-summary-row" style={{ borderBottom: "none" }}><span>Payment Method</span><span className="od-summary-val">{o.paymentMethod}</span></div>
                  <div className="od-summary-row" style={{ borderBottom: "none" }}>
                    <span>Payment Status</span>
                    <span className="od-status-pill" style={{ background: o.paymentStatusColor + "18", color: o.paymentStatusColor }}>
                      <span className="od-status-dot" style={{ background: o.paymentStatusColor }} />{o.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="od-card od-vendor-card">
                  <div className="od-card-title" style={{ marginBottom: 14 }}>Vendor information</div>
                  <div className="od-vendor-header">
                    <img src={o.vendor.logo} alt={o.vendor.name} className="od-vendor-logo" />
                    <div>
                      <div className="od-vendor-name">{o.vendor.name}</div>
                      {renderStars(o.vendor.rating, o.vendor.reviewCount)}
                    </div>
                  </div>
                  <div className="od-vendor-contact">
                    <div className="od-vendor-contact-item"><FiPhone size={13} color="#94a3b8" />{o.vendor.phone}</div>
                    <div className="od-vendor-contact-item"><FiMail size={13} color="#94a3b8" />{o.vendor.email}</div>
                  </div>
                </div>

                <div className="od-card od-help-card">
                  <div className="od-help-title">Need Help?</div>
                  <div className="od-help-desc">If you have issues with your order, please contact support.</div>
                  <Link href="/user/help" className="od-contact-btn"><FiHelpCircle size={15} /> Contact Support</Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showDeleteModal && (
        <div className="ud-modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="ud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ud-modal-icon"><FiAlertTriangle size={26} /></div>
            <div className="ud-modal-title">Delete Your Account?</div>
            <div className="ud-modal-body">This action is <strong>permanent and irreversible</strong>. All your orders, wishlist, and personal data will be permanently deleted.</div>
            {deleteError && <div className="ud-modal-error">{deleteError}</div>}
            <div className="ud-modal-actions">
              <button type="button" className="ud-modal-cancel" onClick={() => { setShowDeleteModal(false); setDeleteError(""); }} disabled={deleting}>Cancel</button>
              <button type="button" className="ud-modal-delete" onClick={handleDeleteAccount} disabled={deleting}>
                {deleting ? "Deleting..." : <><FiTrash2 size={15} /> Yes, Delete Account</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}