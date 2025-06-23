import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  public transform(value: string | Date, arg = 'full'): string {
    if (typeof value === 'string') {
      value = new Date(value);
    }
    return arg === 'short' ? value.toLocaleDateString('fr') : value.toLocaleString();
  }
}
