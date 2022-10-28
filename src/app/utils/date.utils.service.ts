import { Injectable } from '@angular/core';

@Injectable()
export class DateUtilsService {

  /**
   * Ex: Fri Sep 09 2022 00:00:00 GMT+0200 (heure d’été d’Europe centrale)
   * Returns : Fri Sep 09 2022 02:00:00 GMT+0200 (heure d’été d’Europe centrale)
   * @param date
   * @returns
   */
  public formatDateWithOffsetToUtc(date: Date): Date {
    date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
    return date;
  } 
 }