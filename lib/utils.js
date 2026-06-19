import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format Rupiah Indonesia
 * @param {number} value
 * @returns {string}
 */
export function formatRupiah(value) {
  if (value === null || value === undefined) return "Rp 0";
  const formattedNumber = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(value);
  return `Rp ${formattedNumber}`;
}

/**
 * Format input teks ke angka dengan pemisah ribuan (titik) secara real-time
 * @param {string|number} value
 * @returns {string}
 */
export function formatRupiahInput(value) {
  const numericVal = String(value).replace(/[^\d]/g, "");
  if (!numericVal) return "";
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(numericVal);
}

/**
 * Hitung budget harian
 * @param {number} saldo
 * @param {number} hari
 * @returns {number}
 */
export function getDailyBudget(saldo, hari) {
  if (hari <= 0) return saldo;
  return Math.round(saldo / hari);
}

/**
 * Tentukan mode berdasarkan budget harian
 * @param {number} budgetHarian
 * @param {object} modeConfig
 * @returns {object}
 */
export function getMode(budgetHarian, modeConfig) {
  if (budgetHarian > 50000) return modeConfig.santai;
  if (budgetHarian < 20000) return modeConfig.survival;
  return modeConfig.hitung;
}

/**
 * Parse input harga, hapus non-digit
 * @param {string|number} value
 * @returns {number}
 */
export function parsePriceInput(value) {
  return Number(String(value).replace(/[^\d]/g, ""));
}

/**
 * Format tanggal YYYY-MM-DD ke "DD Bulan" (contoh: "30 Juni")
 * @param {string} dateString
 * @returns {string}
 */
export function formatTanggalBulan(dateString) {
  if (!dateString || !dateString.includes("-")) return dateString;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  });
}

/**
 * Hitung sisa hari dari hari ini ke tanggal target
 * @param {string} targetDateString (Format YYYY-MM-DD)
 * @returns {number}
 */
export function calculateDaysRemaining(targetDateString) {
  if (!targetDateString) return 0;
  
  const targetDate = new Date(targetDateString);
  const today = new Date();
  
  // Set jam ke 00:00:00 untuk akurasi hari
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}

