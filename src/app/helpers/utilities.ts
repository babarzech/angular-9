import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
  transform (input: number) {
    return Number(input).toFixed(8).replace(/\.?0+$/, '');
  }
}

@Pipe({name: 'round2'})
export class Round2Pipe implements PipeTransform {
  transform (input: number) {
    return Number(input).toFixed(2).replace(/\.?0+$/, '');
  }
}

@Pipe({name: 'spanwrape'})
export class SpanWrapePipe implements PipeTransform {
    transform (input: number) {
        if (input === undefined) {
          return '';
        }
        const num: string = input.toFixed(8).toString();
        const regex = /^[0-9]{0,}.[0-9]{0,2}/g;
        const result = regex.exec(num)[0];
        return result + '<span>' + num.substr(result.length, num.length) + '</span>';
    }
}


// @Pipe({name: 'Currency'})
// export class CurrencyPipe implements PipeTransform {
//     transform (input: number) {
//       return input;
//      return parseFloat(number).toFixed(20).replace(/0+$/,'');
//     }
// }
