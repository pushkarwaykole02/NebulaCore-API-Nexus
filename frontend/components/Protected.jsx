'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Protected({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    } else {
      setAllowed(true);
    }
  }, [router]);
  if (!allowed) return null;
  return children;
}

