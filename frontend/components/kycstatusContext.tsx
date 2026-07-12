"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface KycStatusContextValue {
  kycStatus: string | null;
  kycRejectionReason: string | null;
  loading: boolean;
}

const KycStatusContext = createContext<KycStatusContextValue>({
  kycStatus: null,
  kycRejectionReason: null,
  loading: true,
});

export function KycStatusProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [kycRejectionReason, setKycRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }
    fetch("/api/vendor-kyc/me", {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then(async (r) => {
        if (r.status === 404) {
          setKycStatus("NOT_STARTED");
          return;
        }
        const d = await r.json();
        setKycStatus(d.status ?? null);
        setKycRejectionReason(d.rejectionReason ?? null);
      })
      .catch(() => setKycStatus(null))
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  return (
    <KycStatusContext.Provider value={{ kycStatus, kycRejectionReason, loading }}>
      {children}
    </KycStatusContext.Provider>
  );
}

export function useKycStatus() {
  return useContext(KycStatusContext);
}