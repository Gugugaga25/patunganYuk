import React from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ProfileForm from "./profile-form";
import { getProfileData } from "@/src/lib/user-services";

export default async function ProfilePage() {
  const userData = await getProfileData();
  const totalPatungan = userData?.patungan?.length || 0;

  // Kirim data yang sudah jadi ke komponen Client
  return <ProfileForm initialData={userData} totalPatungan={totalPatungan} />;
}
