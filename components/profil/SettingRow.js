"use client";

import { useState } from "react";
import Switch from "../ui/Switch";
import { formatRupiahInput, formatTanggalBulan } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function SettingRow({ label, value, displayValue, type = "text", editable = false, isToggle = false, onSave, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize state dengan format angka jika tipenya number
  const [editValue, setEditValue] = useState(() => {
    if (type === "number") return formatRupiahInput(value);
    return value;
  });

  const handleSave = () => {
    setIsEditing(false);
    if (onSave && editValue !== value) {
      onSave(editValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  return (
    <div className="setting-row" data-editable={editable}>
      <span className="setting-label">{label}</span>
      
      {isToggle ? (
        <Switch isOn={value} onToggle={onToggle} ariaLabel={`Toggle ${label}`} />
      ) : isEditing ? (
        <div className="setting-value" style={{ display: "flex", justifyContent: "flex-end" }}>
          {type === "date" ? (
            <Popover open={isEditing} onOpenChange={(open) => {
              if (!open) {
                setEditValue(value);
                setIsEditing(false);
              }
            }}>
              <PopoverTrigger 
                className="inline-edit" 
                style={{ textAlign: "right", minWidth: "120px" }}
              >
                {editValue ? formatTanggalBulan(editValue) : "Pilih Tanggal"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-white/20" align="end">
                <Calendar
                  mode="single"
                  selected={editValue ? new Date(editValue) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      // Format to YYYY-MM-DD
                      const dateStr = date.toLocaleDateString('en-CA'); 
                      setEditValue(dateStr);
                      if (onSave && dateStr !== value) onSave(dateStr);
                      setIsEditing(false);
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <input
                className="inline-edit"
                type={type === "number" ? "text" : type}
                inputMode={type === "number" ? "numeric" : "text"}
                value={editValue}
                onChange={(e) => {
                  if (type === "number") {
                    setEditValue(formatRupiahInput(e.target.value));
                  } else {
                    setEditValue(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                autoFocus
              />
              <button className="edit-setting" type="button" onClick={handleSave}>Simpan</button>
            </>
          )}
        </div>
      ) : (
        <div className="setting-value">
          <span>{displayValue !== undefined ? displayValue : value}</span>
          {editable && (
            <button className="edit-setting" type="button" onClick={() => setIsEditing(true)}>
              Edit →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
