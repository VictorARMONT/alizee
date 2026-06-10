"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, animate, useMotionValueEvent } from "framer-motion";

const ITEM_H = 50;
const VISIBLE = 5;
const PAD = 2;

const MONTH_LABELS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function daysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function range(start: number, end: number, step = 1): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i += step) arr.push(i);
  return arr;
}

/* ─────────────────────────────────────────
   Single drum column
───────────────────────────────────────── */
interface Item { label: string; value: number }

function DrumColumn({ items, value, onChange, width = "72px" }: {
  items: Item[];
  value: number;
  onChange: (v: number) => void;
  width?: string;
}) {
  const getIdx = (v: number) => {
    const i = items.findIndex(x => x.value === v);
    return i >= 0 ? i : 0;
  };

  const y = useMotionValue(-getIdx(value) * ITEM_H);
  const [centerIdx, setCenterIdx] = useState(getIdx(value));

  // Sync when value changes from outside (e.g. days clamped after month change)
  useEffect(() => {
    const i = getIdx(value);
    animate(y, -i * ITEM_H, { type: "spring", stiffness: 400, damping: 40 });
    setCenterIdx(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, items.length]);

  useMotionValueEvent(y, "change", (latest) => {
    const i = Math.max(0, Math.min(items.length - 1, Math.round(-latest / ITEM_H)));
    if (i !== centerIdx) setCenterIdx(i);
  });

  function snapToIdx(rawY: number, velY = 0) {
    const boost = velY > 500 ? -1 : velY < -500 ? 1 : 0;
    const i = Math.max(0, Math.min(items.length - 1, Math.round(-rawY / ITEM_H) + boost));
    animate(y, -i * ITEM_H, { type: "spring", stiffness: 380, damping: 36 });
    onChange(items[i].value);
    setCenterIdx(i);
  }

  return (
    <div
      className="relative overflow-hidden select-none touch-none"
      style={{ height: ITEM_H * VISIBLE, width }}
    >
      {/* Gradient fade top/bottom */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: "linear-gradient(to bottom, var(--brand-bg) 0%, transparent 26%, transparent 74%, var(--brand-bg) 100%)",
      }} />

      {/* Selection highlight band */}
      <div className="absolute inset-x-0 z-10 pointer-events-none" style={{
        top: PAD * ITEM_H,
        height: ITEM_H,
        background: "rgba(233,30,140,0.07)",
        borderTop: "1px solid rgba(233,30,140,0.35)",
        borderBottom: "1px solid rgba(233,30,140,0.35)",
      }} />

      <motion.div
        drag="y"
        dragMomentum={false}
        dragElastic={0.06}
        style={{ y, paddingTop: PAD * ITEM_H, paddingBottom: PAD * ITEM_H }}
        dragConstraints={{ top: -(items.length - 1) * ITEM_H, bottom: 0 }}
        onDragEnd={(_, info) => snapToIdx(y.get(), info.velocity.y)}
        className="cursor-grab active:cursor-grabbing"
      >
        {items.map((item, i) => {
          const dist = Math.abs(i - centerIdx);
          return (
            <div
              key={item.value}
              onClick={() => dist > 0 && snapToIdx(-i * ITEM_H)}
              style={{
                height: ITEM_H,
                opacity: dist === 0 ? 1 : dist === 1 ? 0.38 : 0.13,
                fontSize: dist === 0 ? "20px" : "17px",
                fontWeight: dist === 0 ? 600 : 400,
                cursor: dist > 0 ? "pointer" : "default",
              }}
              className="flex items-center justify-center text-[var(--brand-fg)] transition-[opacity,font-size] duration-100"
            >
              {item.label}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Date Picker  (DD / MMM / YYYY)
───────────────────────────────────────── */
interface DrumDatePickerProps {
  value: string | null;           // ISO "YYYY-MM-DD"
  onChange: (iso: string) => void;
  yearStart?: number;
  yearEnd?: number;
}

export function DrumDatePicker({
  value,
  onChange,
  yearStart = 1940,
  yearEnd = 2010,
}: DrumDatePickerProps) {
  const parsed = value ? value.split("-").map(Number) : null;
  const [year,  setYear]  = useState(parsed?.[0] ?? 1970);
  const [month, setMonth] = useState(parsed?.[1] ?? 6);
  const [day,   setDay]   = useState(parsed?.[2] ?? 15);

  const maxDay = daysInMonth(month, year);
  const clampedDay = Math.min(day, maxDay);

  // Clamp day when month/year changes
  useEffect(() => {
    if (day !== clampedDay) setDay(clampedDay);
  }, [month, year]);

  // Emit ISO string on any change
  useEffect(() => {
    const d = clampedDay;
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    onChange(iso);
  }, [year, month, clampedDay]);

  const dayItems   = range(1, maxDay).map(d => ({ label: String(d).padStart(2, "0"), value: d }));
  const monthItems = MONTH_LABELS.map((l, i) => ({ label: l, value: i + 1 }));
  const yearItems  = range(yearStart, yearEnd).map(y => ({ label: String(y), value: y }));

  return (
    <div className="flex items-center justify-center gap-1">
      <DrumColumn items={dayItems}   value={clampedDay} onChange={setDay}   width="60px" />
      <Sep />
      <DrumColumn items={monthItems} value={month}      onChange={setMonth} width="62px" />
      <Sep />
      <DrumColumn items={yearItems}  value={year}       onChange={setYear}  width="74px" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Time Picker  (HH : MM)
───────────────────────────────────────── */
interface DrumTimePickerProps {
  value: string | null;           // "HH:MM"
  onChange: (t: string) => void;
}

export function DrumTimePicker({ value, onChange }: DrumTimePickerProps) {
  const parsed = value?.split(":").map(Number);
  const [hour,   setHour]   = useState(parsed?.[0] ?? 12);
  const [minute, setMinute] = useState(parsed?.[1] ?? 0);

  useEffect(() => {
    onChange(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }, [hour, minute]);

  const hourItems   = range(0, 23).map(h => ({ label: String(h).padStart(2, "0"), value: h }));
  const minuteItems = range(0, 59).map(m => ({ label: String(m).padStart(2, "0"), value: m }));

  return (
    <div className="flex items-center justify-center gap-1">
      <DrumColumn items={hourItems}   value={hour}   onChange={setHour}   width="60px" />
      <span className="text-[24px] font-bold text-[var(--brand-fg)] pb-1 select-none">:</span>
      <DrumColumn items={minuteItems} value={minute} onChange={setMinute} width="60px" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Separator glyph
───────────────────────────────────────── */
function Sep() {
  return (
    <span className="text-[18px] text-[var(--brand-fg-muted)] select-none pb-0.5">/</span>
  );
}
