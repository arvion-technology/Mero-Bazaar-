export type KYCStatus = "Pending" | "Verified" | "Rejected";

export interface KYCRecord {
  id: string;
  name: string;
  initial: string;
  color: string;
  date: string;
  status: KYCStatus;
  appliedOn: string;
  birthdate: string;
  panNumber: string;
  phone: string;
  address: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  avatar?: string;
  rejectionReason?: string;
}

export const kycStats = [
  { label: "Total KYC", value: "1,248", icon: "user", color: "#818cf8", bg: "#eef2ff" },
  { label: "Verified KYC", value: "845", icon: "check", color: "#34d399", bg: "#ecfdf5" },
  { label: "Unverified KYC", value: "236", icon: "user", color: "#fbbf24", bg: "#fffbeb" },
  { label: "Rejected KYC", value: "158", icon: "x", color: "#f87171", bg: "#fef2f2" },
];

export const recentKYCs: KYCRecord[] = [
  { id: "1", name: "Ramesh Adhikari", initial: "R", color: "#818cf8", date: "May 23, 2024 10:00 AM", status: "Pending", appliedOn: "May 23, 2024 10:00 AM", birthdate: "May 15, 1995", panNumber: "AAEPC1235", phone: "9834568799", address: "Kathmandu", bankName: "Nabil Bank Limited", bankAccount: "12356867898764", accountHolder: "Ramesh Adhikari" },
  { id: "2", name: "Sita Shretha", initial: "S", color: "#34d399", date: "May 23, 2024 12:30 PM", status: "Pending", appliedOn: "May 23, 2024 12:30 PM", birthdate: "Jan 12, 1992", panNumber: "SITAPC456", phone: "9812345678", address: "Lalitpur", bankName: "Global IME Bank", bankAccount: "98765432101234", accountHolder: "Sita Shretha" },
  { id: "3", name: "Pinki Shah", initial: "P", color: "#fbbf24", date: "May 22, 2024 01:45 PM", status: "Pending", appliedOn: "May 22, 2024 01:45 PM", birthdate: "Mar 8, 1998", panNumber: "PINKIPC789", phone: "9801234567", address: "Bhaktapur", bankName: "NIC Asia Bank", bankAccount: "45678901234567", accountHolder: "Pinki Shah" },
  { id: "4", name: "Laxmi Rai", initial: "L", color: "#f472b6", date: "May 23, 2024 02:10 PM", status: "Pending", appliedOn: "May 23, 2024 02:10 PM", birthdate: "Jul 22, 1990", panNumber: "LAXMIPC321", phone: "9865432109", address: "Kathmandu", bankName: "Prabhu Bank", bankAccount: "78901234567890", accountHolder: "Laxmi Rai" },
  { id: "5", name: "Sunil Kumar", initial: "S", color: "#818cf8", date: "May 24, 2024 10:30 AM", status: "Pending", appliedOn: "May 24, 2024 10:30 AM", birthdate: "Nov 3, 1994", panNumber: "SUNILPC654", phone: "9845678901", address: "Pokhara", bankName: "Sanima Bank", bankAccount: "01234567890123", accountHolder: "Sunil Kumar" },
  { id: "6", name: "Sita Patel", initial: "S", color: "#818cf8", date: "May 26, 2024 11:30 AM", status: "Pending", appliedOn: "May 26, 2024 11:30 AM", birthdate: "Apr 18, 1996", panNumber: "SITAPC987", phone: "9823456789", address: "Birgunj", bankName: "Nabil Bank Limited", bankAccount: "34567890123456", accountHolder: "Sita Patel" },
  { id: "7", name: "Binod Rai", initial: "B", color: "#818cf8", date: "May 23, 2024 04:50 PM", status: "Pending", appliedOn: "May 23, 2024 04:50 PM", birthdate: "Sep 30, 1993", panNumber: "BINODPC147", phone: "9818765432", address: "Dharan", bankName: "Everest Bank", bankAccount: "67890123456789", accountHolder: "Binod Rai" },
];

export const verifiedKYCs: KYCRecord[] = [
  { id: "v1", name: "Ramesh Adhikari", initial: "R", color: "#818cf8", date: "May 20, 2024 09:00 AM", status: "Verified", appliedOn: "May 18, 2024 10:00 AM", birthdate: "May 15, 1995", panNumber: "AAEPC1235", phone: "9834568799", address: "Kathmandu", bankName: "Nabil Bank Limited", bankAccount: "12356867898764", accountHolder: "Ramesh Adhikari", avatar: "/avatars/ramesh.jpg" },
  { id: "v2", name: "Sita Shretha", initial: "S", color: "#34d399", date: "May 19, 2024 11:30 AM", status: "Verified", appliedOn: "May 17, 2024 12:30 PM", birthdate: "Jan 12, 1992", panNumber: "SITAPC456", phone: "9812345678", address: "Lalitpur", bankName: "Global IME Bank", bankAccount: "98765432101234", accountHolder: "Sita Shretha" },
  { id: "v3", name: "Pinki Shah", initial: "P", color: "#fbbf24", date: "May 18, 2024 02:00 PM", status: "Verified", appliedOn: "May 16, 2024 01:45 PM", birthdate: "Mar 8, 1998", panNumber: "PINKIPC789", phone: "9801234567", address: "Bhaktapur", bankName: "NIC Asia Bank", bankAccount: "45678901234567", accountHolder: "Pinki Shah" },
];

export const rejectedKYCs: KYCRecord[] = [
  { id: "r1", name: "Hari Prasad", initial: "H", color: "#f87171", date: "May 15, 2024 03:00 PM", status: "Rejected", appliedOn: "May 14, 2024 10:00 AM", birthdate: "Dec 5, 1988", panNumber: "HARIPC999", phone: "9854321098", address: "Kathmandu", bankName: "Nabil Bank Limited", bankAccount: "11112222333344", accountHolder: "Hari Prasad", rejectionReason: "Invalid PAN card document provided" },
  { id: "r2", name: "Gita Sharma", initial: "G", color: "#f472b6", date: "May 14, 2024 01:30 PM", status: "Rejected", appliedOn: "May 13, 2024 11:00 AM", birthdate: "Jun 20, 1991", panNumber: "GITAPC888", phone: "9843210987", address: "Pokhara", bankName: "Sanima Bank", bankAccount: "55556666777788", accountHolder: "Gita Sharma", rejectionReason: "Bank account details do not match with PAN card" },
];

export function getKYCById(id: string): KYCRecord | undefined {
  return [...recentKYCs, ...verifiedKYCs, ...rejectedKYCs].find((k) => k.id === id);
}