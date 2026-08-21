"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="text-[0.7rem] uppercase tracking-[0.16em] text-mute hover:text-ink"
    >
      Salir
    </button>
  );
}
