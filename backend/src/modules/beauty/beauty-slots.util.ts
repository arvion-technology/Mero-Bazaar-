import { BadRequestException } from '@nestjs/common';
import { WeekDay } from '@prisma/client';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as WeekDay[];
const DEFAULT_MINUTES = 60;
const OPEN = 9 * 60; // 09:00
const CLOSE = 17 * 60; // 17:00

const toStr = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export function buildDefaultSlots(durationMinutes?: number | null) {
  const minutes =
    durationMinutes && durationMinutes >= 15 ? durationMinutes : DEFAULT_MINUTES;
  const data: { day: WeekDay; startTime: string; endTime: string }[] = [];

  for (const day of DAYS)
    for (let s = OPEN; s + minutes <= CLOSE; s += minutes)
      data.push({ day, startTime: toStr(s), endTime: toStr(s + minutes) });

  return data;
}

export function parseDurationMinutes(text?: string | null): number | null {
  if (!text) return null;
  const t = text.toLowerCase();
  const h = t.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hour)/);
  const m = t.match(/(\d+)\s*(?:m|min)/);
  const total =
    (h ? Math.round(parseFloat(h[1]) * 60) : 0) + (m ? parseInt(m[1], 10) : 0);
  if (total > 0) return total;
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function assertValidSlots(
  slots: { day: string; startTime: string; endTime: string }[],
) {
  for (const s of slots) {
    if (toMin(s.endTime) <= toMin(s.startTime)) {
      throw new BadRequestException(
        `Slot ${s.day} ${s.startTime}-${s.endTime}: end must be after start`,
      );
    }
  }
}