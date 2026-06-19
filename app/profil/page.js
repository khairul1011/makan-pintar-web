"use client";

import AppShell from "@/components/layout/AppShell";
import BottomNav from "@/components/layout/BottomNav";
import ProfileHeader from "@/components/profil/ProfileHeader";
import SettingsCard from "@/components/profil/SettingsCard";
import SettingRow from "@/components/profil/SettingRow";
import { useApp } from "@/lib/store";
import { formatRupiah, parsePriceInput, formatTanggalBulan } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProfilPage() {
  const { state, updateSetting, toggleNotification, updateSaldo, signOut } = useApp();

  return (
    <>
      <AppShell>
        <main className="app-page active">
          <ProfileHeader />

          <section className="settings-stack" aria-label="Pengaturan profil">
            <SettingsCard title="💰 Budget & Kiriman">
              <SettingRow 
                label="Total Kiriman" 
                value={formatRupiah(state.totalKiriman)} 
                editable 
                type="number"
                onSave={(val) => updateSetting("totalKiriman", parsePriceInput(val))}
              />
              <SettingRow 
                label="Tanggal Kiriman Berikutnya" 
                value={state.tanggalKiriman} 
                displayValue={formatTanggalBulan(state.tanggalKiriman)}
                type="date"
                editable 
                onSave={(val) => updateSetting("tanggalKiriman", val)}
              />
              <SettingRow 
                label="Saldo Makan Saat Ini" 
                value={formatRupiah(state.saldoMakan)} 
                editable 
                type="number"
                onSave={(val) => updateSaldo(parsePriceInput(val))}
              />
            </SettingsCard>

            <SettingsCard title="🥗 Target Nutrisi">
              <SettingRow 
                label="Target Kalori/hari" 
                value={`${state.targetCalories.toLocaleString("id-ID")} kkal`} 
                editable 
                type="number"
                onSave={(val) => updateSetting("targetCalories", parsePriceInput(val))}
              />
              <SettingRow 
                label="Target Protein/hari" 
                value={`${state.targetProtein}g`} 
                editable 
                type="number"
                onSave={(val) => updateSetting("targetProtein", parsePriceInput(val))}
              />
            </SettingsCard>

            <SettingsCard title="🔔 Notifikasi">
              <SettingRow 
                label="Budget Warning" 
                value={state.notifications.budgetWarning} 
                isToggle 
                onToggle={() => toggleNotification("budgetWarning")}
              />
              <SettingRow 
                label="Log Reminder" 
                value={state.notifications.logReminder} 
                isToggle 
                onToggle={() => toggleNotification("logReminder")}
              />
              <SettingRow 
                label="Kiriman Reminder" 
                value={state.notifications.kirimanReminder} 
                isToggle 
                onToggle={() => toggleNotification("kirimanReminder")}
              />
            </SettingsCard>

            <SettingsCard title="📱 Tentang Aplikasi">
              <SettingRow label="Versi" value="0.1.0 Beta" />
              <div className="setting-row">
                <span className="setting-label">Feedback</span>
                <button className="edit-setting" type="button">Kirim →</button>
              </div>
            </SettingsCard>

            <div className="flex justify-center mt-6 mb-8">
              <Button 
                variant="destructive" 
                onClick={signOut} 
                className="w-full max-w-[200px] rounded-full shadow-[0_4px_15px_rgba(239,68,68,0.2)] dark:shadow-[0_4px_15px_rgba(239,68,68,0.3)]"
              >
                Keluar Akun
              </Button>
            </div>
          </section>
        </main>
      </AppShell>
      <BottomNav />
    </>
  );
}
