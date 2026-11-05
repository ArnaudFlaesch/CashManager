/**
 * Ex: Fri Sep 09 2022 00:00:00 GMT+0200 (heure d’été d’Europe centrale)
 * Returns : Fri Sep 09 2022 02:00:00 GMT+0200 (heure d’été d’Europe centrale)
 */
export function formatDateWithOffsetToUtc(date: Date): Date {
  const utcDate = new Date(date);
  utcDate.setHours(utcDate.getHours() - utcDate.getTimezoneOffset() / 60);
  return utcDate;
}
