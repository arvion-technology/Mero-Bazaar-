"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function toBareFilename(value: string): string {
  // handles both a full URL and an already-bare filename
  const withoutQuery = value.split("?")[0];
  return withoutQuery.substring(withoutQuery.lastIndexOf("/") + 1);
}

export default function KycDocumentImage({ filename, alt }: { filename: string; alt: string }) {
  const { data: session } = useSession();
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.accessToken || !filename) return;
    let objectUrl: string;
    const bareName = toBareFilename(filename);

    fetch(`/api/vendor-kyc/admin/document/${bareName}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((r) => r.blob())
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => setSrc(null));

    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [session?.accessToken, filename]);

  if (!src) return <div style={{ width: 200, height: 140, background: "#f1f1f1", borderRadius: 8 }} />;
  return <img src={src} alt={alt} style={{ width: 200, height: 140, objectFit: "cover", borderRadius: 8 }} />;
}