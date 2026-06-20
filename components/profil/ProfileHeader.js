"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { getDailyBudget, getMode } from "@/lib/utils";
import { MODE_CONFIG } from "@/lib/constants";
import { createClient } from "@/lib/supabase";

export default function ProfileHeader() {
  const { state, user, updateSetting } = useApp();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const supabase = createClient();

  const budgetHarian = getDailyBudget(state.saldoMakan, state.hariKeKiriman);
  const mode = getMode(budgetHarian, MODE_CONFIG);

  const username = user?.email ? user.email.split('@')[0] : "User";
  const initial = username.substring(0, 2).toUpperCase();

  const handleUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      if (!file.type.startsWith("image/")) {
        alert("Mohon pilih file gambar (JPG/PNG)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar maksimal 2MB");
        return;
      }

      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        await updateSetting("avatarUrl", data.publicUrl);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Gagal mengunggah foto profil.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <header className="profile-header">
      <div className="avatar-wrap">
        {state.avatarUrl ? (
          <img src={state.avatarUrl} alt="Avatar" className="avatar-img" />
        ) : (
          <div className="avatar" aria-hidden="true">{initial}</div>
        )}
        
        <button 
          type="button"
          className="avatar-cam-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "⏳" : "📷"}
        </button>

        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </div>

      <div>
        <h2 className="page-title">{username}</h2>
        <span className="page-subtitle">Mahasiswa · Mode {mode.label} {mode.emoji}</span>
      </div>
    </header>
  );
}
