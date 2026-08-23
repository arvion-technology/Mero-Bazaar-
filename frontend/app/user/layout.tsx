import AuthProvider from "@/components/AuthProviders";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
