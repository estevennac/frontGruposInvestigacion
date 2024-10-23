import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GlobalConstant } from 'src/app/core/constant/global-constant';

@Pipe({
  name: 'espeDate'
})
export class EspeDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: any, args?: any): any {
    return this.datePipe.transform(value, GlobalConstant.DATE_FORMAT);
  }
}
