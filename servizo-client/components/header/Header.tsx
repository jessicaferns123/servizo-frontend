'use client';

import { useAuth } from "@/context/AuthContext";
import ProviderHeader from "./ProviderHeader";
import UserHeader from "./UserHeader";


export default function Header() {
  const { userType } = useAuth();

  if (userType === "provider") return <ProviderHeader />;
  if (userType === "user") return <UserHeader />;

  return null; // or <DefaultHeader />
}
