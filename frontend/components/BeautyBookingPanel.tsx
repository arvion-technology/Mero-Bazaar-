"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FiCalendar, FiClock } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL;
const slotsUrl = (listingId: string, date: string) =>
  `${API}/api/beauty/slots/listing-id/${listingId}?date=${date}`;
const APPOINTMENTS_URL = `${API}/api/beauty/appointments`;

type Slot = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

const todayNepal = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" });

const weekdayOf = (date: string) =>
  WEEKDAYS[new Date(`${date}T00:00:00.000Z`).getUTCDay()];

const errMsg = (data: unknown, fallback: string) => {
  const m = (data as { message?: string | string[] })?.message;
  return Array.isArray(m) ? m.join(", ") : (m ?? fallback);
};

export default function BeautyBookingPanel({
  listingId,
  defaultName = "",
}: {
  listingId: string;
  defaultName?: string;
}) {
  const { data: session } = useSession();
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState<string | null>(null);
  // null = user hasn't typed yet, so we show the session name
  const [typedName, setTypedName] = useState<string | null>(null);
  const name = typedName ?? defaultName;
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Slots are derived from (date, refresh) so no setState runs synchronously
  // inside the effect: it only sets state in the fetch callbacks.
  const [refresh, setRefresh] = useState(0);
  const [slotsState, setSlotsState] = useState<{
    key: string;
    slots: Slot[];
  } | null>(null);

  const key = date ? `${date}|${refresh}` : "";
  const loadingSlots = !!date && slotsState?.key !== key;
  const slots: Slot[] =
    date && slotsState?.key === key ? slotsState.slots : [];

  useEffect(() => {
    if (!date) return;
    let cancelled = false;

    fetch(slotsUrl(listingId, date))
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(errMsg(data, "Failed to load slots"));
        return data as Slot[];
      })
      .then((list) => {
        if (cancelled) return;
        const day = weekdayOf(date);
        setSlotsState({ key, slots: list.filter((s) => s.day === day) });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setSlotsState({ key, slots: [] });
        toast.error(e instanceof Error ? e.message : "Failed to load slots");
      });

    return () => {
      cancelled = true;
    };
  }, [date, key, listingId]);

  const submit = async () => {
    if (!session?.accessToken) {
      toast.error("Please log in to book");
      return;
    }
    if (!date || !slotId || !name.trim()) {
      toast.error("Choose a date, a time slot and enter your name");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(APPOINTMENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          listingId,
          slotId,
          date,
          customerName: name.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(errMsg(data, "Booking failed"));

      toast.success("Booking requested. The provider will confirm it.");
      setNotes("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSlotId(null);
      setRefresh((n) => n + 1); // refetch: slot may have just been taken
      setSubmitting(false);
    }
  };

  return (
    <div
      id="booking"
      className="bg-white rounded-xl border border-[#e5e7eb] py-[18px] px-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
    >
      <p className="text-xs font-bold text-[#9ca3af] uppercase tracking-[0.5px] mt-0 mb-3">
        Book an appointment
      </p>

      <label className="block text-xs font-semibold text-[#374151] mb-1">
        Date
      </label>
      <input
        type="date"
        min={todayNepal()}
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setSlotId(null);
        }}
        className="w-full py-2 px-2.5 mb-3 rounded-lg border border-[#e0e4f0] text-[13px] text-[#333] bg-[#f9fafb] outline-none font-[inherit] focus:border-[#e11d48]"
      />

      {date && (
        <div className="mb-3">
          <label className="block text-xs font-semibold text-[#374151] mb-1.5">
            Time slot
          </label>
          {loadingSlots ? (
            <p className="text-xs text-[#9ca3af]">Loading slots…</p>
          ) : slots.length === 0 ? (
            <p className="text-xs text-[#9ca3af]">
              No slots on this day. Try another date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((s) => {
                const selected = slotId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={s.isBooked}
                    onClick={() => setSlotId(s.id)}
                    className={`inline-flex items-center gap-1 py-1.5 px-3 rounded-md border text-xs font-semibold transition-colors duration-150 font-[inherit] ${
                      s.isBooked
                        ? "bg-[#f3f4f6] text-[#9ca3af] border-[#e5e7eb] line-through cursor-not-allowed"
                        : selected
                          ? "bg-[#e11d48] text-white border-[#e11d48] cursor-pointer"
                          : "bg-white text-[#374151] border-[#e5e7eb] cursor-pointer hover:border-[#e11d48] hover:bg-[#fff1f2]"
                    }`}
                  >
                    <FiClock size={11} />
                    {s.startTime} – {s.endTime}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <label className="block text-xs font-semibold text-[#374151] mb-1">
        Your name
      </label>
      <input
        value={name}
        onChange={(e) => setTypedName(e.target.value)}
        placeholder="Full name"
        className="w-full py-2 px-2.5 mb-3 rounded-lg border border-[#e0e4f0] text-[13px] text-[#333] bg-[#f9fafb] outline-none font-[inherit] focus:border-[#e11d48]"
      />

      <label className="block text-xs font-semibold text-[#374151] mb-1">
        Notes (optional)
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full py-2 px-2.5 mb-3 rounded-lg border border-[#e0e4f0] text-[13px] text-[#333] bg-[#f9fafb] outline-none font-[inherit] resize-none focus:border-[#e11d48]"
      />

      <button
        type="button"
        onClick={submit}
        disabled={submitting || !slotId}
        className="w-full flex items-center justify-center gap-[7px] p-[11px] bg-[#e11d48] text-white text-sm font-extrabold border-none rounded-[9px] cursor-pointer font-[inherit] transition-colors duration-150 hover:bg-[#be123c] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiCalendar size={15} />
        {submitting ? "Booking…" : "Confirm booking"}
      </button>
    </div>
  );
}