import { Pairs, Pair } from '../models/market';
import { AppSettings } from '../config/config';

export class CommonJs {
    // tslint:disable-next-line: max-line-length
    public static formatNumberComma(number: any) {
        if (number.toString().indexOf(',') > -1) {
            return number.toString().replace(',', '');
        } else {
            return number;
        }
    }
    public static checkTriggerCondition(order):string {
        if (order[9] === 3 && (order[2] === 2 || order[2] === 4) && order[8] !== '-') {
            if (Number(Pairs.getPair(order[1]).rate) > Number(order[8])) {
                return '<=';
            } else {
                return '>=';
            }
        } else {
            return '';
        }
    }
    public static localTime(time: any) {
        const date = new Date(time);
        const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        const offset = date.getTimezoneOffset() / 60;
        const hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;
    }
    public static convert_to_24h(time_str: any) {
        // Convert a string like 10:05:23 PM to 24h format, returns like [22,5,23]
        const time = time_str.match(/(\d+):(\d+):(\d+) (\w)/);
        if (time === null) { return time_str; }
        let hours = Number(time[1]);
        const minutes = Number(time[2]);
        const seconds = Number(time[3]);
        const meridian = time[4].toLowerCase();
        if (meridian === 'p' && hours < 12) {
            hours += 12;
        } else if (meridian === 'a' && hours === 12) {
            hours -= 12;
        }
        return '\xa0\xa0' + hours + ':' + (minutes.toString().length < 2 ? '0' + minutes : minutes)
            + ':' + (seconds.toString().length < 2 ? '0' + seconds : seconds);
    }
    public static validateEmail(email: string, emailValid?): boolean {
        // tslint:disable-next-line: max-line-length
        const emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
        return (emailRegx.test(email) || emailValid);
    }
    public static validateForm(form): boolean {
        let formError = false;
        Object.keys(form.form.controls).forEach(input => {
            form.form.controls[input].touched = true;
            if (form.form.controls[input].errors) {
                formError = true;
            }
        });
        if (formError) {
            return false;
        } else {
            return true;
        }
    }
    public static dollarPrice(ordrType: string, inputType: string, mainPair: Pair, model): string {
        let dollarPrice = 0;
        if (mainPair.baseCurrency.symbol === 'USDT') {
            dollarPrice = model[ordrType][inputType];
        } else {
            if (Pairs.getPairByName(mainPair.baseCurrency.symbol + '/USDT')) {
                dollarPrice = Pairs.getPairByName(mainPair.baseCurrency.symbol + '/USDT').rateUsd * model[ordrType][inputType];
            } else {
                dollarPrice = 0;
            }
        }
        return Number(dollarPrice).toFixedFloor(2);
    }
    public static isEmpty(val: any): boolean {
        return val === null || val === undefined || val === '';
    }
    public static isNotEmpty(val: any): boolean {
        return val !== null && val !== undefined && val !== '';
    }
    public static isNumber(input: any): boolean {
        return isNaN(input);
    }
    public static getTotalVolume(http) {
        http.get(AppSettings.apiEndpoint + 'market/get-total-volume').subscribe(res => {
            window['usdtTotal'] = res;
        });
        // https://api937.dtep.io/market/get-total-volume
    }
    public static decimal_format(number, decimals = 8) {
        number = Number(number);
        if (number !== undefined && number !== '') {
            const str = number.toFixed(decimals);
            return str;
        }
    }
    public static decimal_floor(number, decimals = 8): String {
        number = Number(number);
        if (this.isNotEmpty(number)) {
            const str = number.toFixedFloor(decimals);
            return str;
        }
    }
    public static decimal_trunc(figure, decimals): String {
        const d = Math.pow(10, decimals + 1);
        // tslint:disable-next-line: radix
        return ((Number((figure * d).toString()) / d).toFixed(decimals));
    }
    public static decimal_format_fix(number): String {
        number = Number(number);
        if (this.isNotEmpty(number)) {
            const str = number.toFixed(2);
            return str;
        }
    }
    public static formatNumberWithComma(num) {
        if (this.isEmpty(num)) {
            return num;
        }
        // return num;
        const t = num.toString().split('.');
        return (t[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + (t[1] ? '.' + t[1] : ''));
    }
}
export class TradeCommonFunction {

    // public static steandMin(pair, isMobileTrade, stepAndMinRate,stepAndMInQty) {

    //     if (!isMobileTrade) {
    //         this.resetSliderr('changePair');
    //       }
    //       let sum = 1;
    //       if (pair.basePrecision !== undefined) {
    //         sum = Math.pow(10, pair.basePrecision);
    //         const value = 1 / sum;
    //         this.stepAndMinRate = value;
    //       }
    //       if (pair.marketPrecision !== undefined) {
    //         sum = Math.pow(10, pair.marketPrecision);
    //         const value = 1 / sum;
    //         this.stepAndMInQty = value;
    //       }
    // }
}

