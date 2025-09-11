// Helpers de fecha seguros en UTC (evitan desfases por zona horaria)

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** "YYYY-MM-DD" -> milisegundos UTC (00:00)  */
export const ymdToMillisUTC = (ymd?: string): number | null => {
  if (!ymd) return null;
  const m = DATE_RE.exec(ymd.trim());
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  return Date.UTC(y, mo - 1, d);
};

/** "YYYY-MM-DD" -> Date en UTC (00:00). Útil para RNDateTimePicker min/max */
export const ymdToUTCDate = (ymd?: string): Date | undefined => {
  const ms = ymdToMillisUTC(ymd);
  return ms === null ? undefined : new Date(ms);
};

/** Date -> "YYYY-MM-DD" usando *getUTC* (sin afectar por timezone local) */
export const formatYMDUTC = (d: Date): string => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

/** "YYYY-MM-DD" -> "DD/MM/YYYY" (solo transforma texto, sin crear Date) */
export const formatDDMMYYYY = (ymd: string): string => {
  const m = DATE_RE.exec(ymd);
  if (!m) return "";
  const [, y, mo, d] = m;
  return `${d}/${mo}/${y}`;
};
