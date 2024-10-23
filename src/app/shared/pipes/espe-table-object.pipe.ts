import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'espeTableObject'
})
export class EspeTableObjectPipe implements PipeTransform {
  transform(value: any, subProperty: string[]): any {
    let property = value;
    const levels = subProperty.length;
    try {
      for (let i = 0; i < levels; i++) {
        property = property[subProperty[i]];
      }
      return property;
    } catch (e) {
      return null;
    }
  }
}
