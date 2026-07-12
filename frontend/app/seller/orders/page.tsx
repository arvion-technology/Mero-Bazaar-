"use client";

import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

const SUCCESS = "#10b981";
const WARNING = "#f59e0b";
const DANGER = "#ef4444";

const recentOrders = [
  { id: "#1024", customer: "Sita Sharma", email: "sita@email.com", amount: "NPR 500", status: "Completed", statusColor: SUCCESS },
  { id: "#1023", customer: "Hari Bahadur", email: "hari@email.com", amount: "NPR 500", status: "Processing", statusColor: WARNING },
  { id: "#1022", customer: "Anis Kumar", email: "anis@email.com", amount: "NPR 2,100", status: "Completed", statusColor: SUCCESS },
  { id: "#1021", customer: "Ramesh Thapa", email: "ramesh@email.com", amount: "NPR 850", status: "Pending", statusColor: DANGER },
  { id: "#1020", customer: "Priya Sharma", email: "priya@email.com", amount: "NPR 1,200", status: "Completed", statusColor: SUCCESS },
];

export default function SellerOrdersPage() {
  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <h3 className="dash-card-title">Orders</h3>
      </div>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td><span className="dash-order-id">{order.id}</span></td>
                <td>
                  <div className="dash-customer-name">{order.customer}</div>
                  <div className="dash-customer-email">{order.email}</div>
                </td>
                <td><span className="dash-amount">{order.amount}</span></td>
                <td>
                  <span className="dash-status" style={{ background: order.statusColor + "12", color: order.statusColor }}>
                    <span className="dash-status-dot" style={{ background: order.statusColor }} />
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}