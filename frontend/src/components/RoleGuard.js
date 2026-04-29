"use client";

import { useAuthStore } from "@/store/authStore";

export default function RoleGuard({ allow, children }) {
  const { role } = useAuthStore();

  if (!allow.includes(role)) return null;

  return children;
}