import { Pipe, PipeTransform } from '@angular/core';

/**
 * Iterable Pipe
 *
 * It accepts Objects and [Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
 *
 * Example:
 *
 *  <div *ngFor="let keyValuePair of someObject | mapToIterable">
 *    key {{keyValuePair.key}} and value {{keyValuePair.value}}
 *  </div>
 *
 */

@Pipe({
  name: 'mapToIterable'
})
export class MapToIterablePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let result = [];
    if(value.entries) {
      value.forEach((key, value) => {
        result.push({key, value});
      });
    } else {
      for(let key in value) {
        if(value.hasOwnProperty(key)) {
          result.push({key, value: value[key]});
        }
      }
    }
    return result;
  }

}
