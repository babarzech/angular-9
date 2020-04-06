import { Injectable } from '@angular/core';
import { Storage } from '../helpers/storage';
import { ApiCall } from '../helpers/apicall';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppSettings } from '../config/config';
import { CommonJs } from '../helpers/commonfunctions';

declare var $: any;

@Injectable()



export class Pair {
  public id: number;
  public name: string;
  public baseCurrency: Currency;
  public marketCurrency: Currency;
  public rate: number;
  public high: number;
  public low: number;
  public bid: number;
  public ask: number;
  public volume: number;
  public prevDayPrice: number;
  public trendUp: boolean;
  public trendUp24hr: boolean;
  public precision: number;
  public rateUsd: number;
  public basePrecision: number;
  public marketPrecision: number;
  public hide = false;
  public minimumTotal: number;
  public minimumAmount: number;
  public Status: number;
  public leveragePair: boolean;
  public leveragePercentage: string;
  public leveragePairName: string;
  public type: number;
}

export class Currency {
  public id: number;
  public name: string;
  public symbol: string;
  public address: string;
  public isFiat: boolean;
  public precision: number;
  public withdrawalFee: number;
  public status: number;
}


export class UserGroupLimit {
  public currency: Currency;
  public limitation: string;
  public consumed: string;
}
export class UserLocketBalanceLimit {
  public currency: Currency;
  public limit: number;
}
export class Wallet {
  public address: string;
  public isMemo: boolean;
  public memo: number;
  public balance: number;
  public available: number;
  public pending: number;
  public currency: Currency;
  public conf: number;
  public minW: number;
  public fiat: Fiat;
  public hide = false;
  public btcBalance: number;
  public defaultTradePair: string;
}

export class Fiat {
  public bankName: string;
  public accountTitle: string;
  public accountNumber: string;
  public branchCode: string;
}
export class BaseCurrencies {
  public static currencies = ['BTC', 'USDT', 'DTEP'];
}
export class Currencies {
  private static readonly key: string = 'currencies-data';
  private static currencies: { [id: number]: Currency };
  public static init(http: HttpClient, callback = null) {
    if (Storage.exists(this.key)) {
      this.initCurrency();
      if (callback !== null) {
        callback(this.currencies);
      }
    } else {
      http.get(AppSettings.apiEndpoint + 'market/get-currencies').subscribe(
        resp => {
          const resp1 = JSON.parse(JSON.stringify(resp));
          Storage.set(this.key, JSON.stringify(resp1.Result));
          this.initCurrency();
          if (callback !== null) {
            callback(this.currencies);
          }
        }
      );
    }
  }
  private static initCurrency() {
    const object = JSON.parse(Storage.get(this.key));
    this.currencies = {};
    for (const key in object) {
      if (typeof object[key] !== 'undefined') {
        const cur = new Currency();
        cur.id = Number(object[key][0]);
        cur.name = object[key][1];
        cur.symbol = object[key][2];
        cur.isFiat = object[key][3];
        cur.precision = Number(object[key][4]);
        cur.withdrawalFee = Number(object[key][5]);

        cur.status = Number(object[key][6]);
        this.currencies[Number(object[key][0])] = cur;
      }
    }
  }
  public static getCurrency(id: number): Currency {
    if (this.currencies != null) {
      return this.currencies[id];
    } else {
      Currencies.initCurrency();
      return this.currencies[id];
    }
  }
  public static getCurrencyByName(name: string): Currency {
    name = name.toLowerCase();
    if (this.currencies != null) {
      for (const key in this.currencies) {
        if (typeof this.currencies[key] !== 'undefined') {
          if (this.currencies[key].name.toLocaleLowerCase() === name.toLowerCase()) {
            return this.currencies[key];
          }
        }
      }
    }
  }
  public static getCurrencyBySymbol(name: string): Currency {
    name = name.toLowerCase();
    if (this.currencies != null) {
      for (const key in this.currencies) {
        if (typeof this.currencies[key] !== 'undefined') {
          if (this.currencies[key].symbol.toLocaleLowerCase() === name.toLowerCase()) {
            return this.currencies[key];
          }
        }
      }
    }
  }
  public static getCurrencies(): Currency[] {
    const currencies: Currency[] = [];
    for (const key in this.currencies) {
      if (typeof this.currencies[key] !== 'undefined') {
        // if (this.pairs[key].Status === 1) {
        currencies.push(this.currencies[key]);
        // }
      }
    }
    return currencies;
  }
}
export class Pairs {
  private static readonly key: string = 'pair-data';
  private static pairs: { [id: number]: Pair };
  public static init(http: HttpClient, callBack?: () => void) {
    if (Storage.exists(this.key)) {
      this.initPair();
      if (callBack) {
        callBack();
      }
    } else {
      http.get(AppSettings.apiEndpoint + 'market/get-pairs').subscribe(
        resp => {
          const resp1 = JSON.parse(JSON.stringify(resp));
          Storage.set(this.key, JSON.stringify(resp1.Result));
          this.initPair();
          if (callBack) {
            callBack();
          }
        }
      );
    }
  }
  public static setPairs(pairs: Pair[]): void {
    for (const key in pairs) {
      if (typeof pairs[key] !== 'undefined') {
        this.pairs[pairs[key].id] = pairs[key];
      }
    }
  }
  public static setPair(pair: Pair): void {
    this.pairs[pair.id] = pair;
  }
  private static initPair() {

    const resp = JSON.parse(Storage.get(this.key));
    this.pairs = [];
    for (const key in resp) {
      if (typeof resp[key] !== 'undefined') {
        const pair = new Pair();
        pair.name = resp[key][1];
        pair.type = resp[key][9];
        if (pair.type === 1) {
          pair.leveragePair = true;
         // pair.leveragePercentage = pair.name.split('(')[1].split(')')[0];
         pair.leveragePercentage = pair.name.split('x')[1];
         const substring = pair.name.substring(pair.name.indexOf('x') - 0, pair.name.length);
          pair.leveragePairName = pair.name.replace(substring, '');
        }

        pair.id = Number(resp[key][0]);
        pair.baseCurrency = Currencies.getCurrency(Number(resp[key][2]));
        pair.marketCurrency = Currencies.getCurrency(Number(resp[key][3]));
        pair.basePrecision = Number(resp[key][4]);
        pair.marketPrecision = Number(resp[key][5]);
        pair.precision = Number(resp[key][4]);
        // pair.minimumBuyLimit = Number(resp[key][5]);
        // pair.minimumSellLimit = Number(resp[key][6]);
        pair.minimumTotal = Number(resp[key][6]);
        pair.minimumAmount = Number(resp[key][7]);
        pair.Status = Number(resp[key][8]);
        this.pairs[resp[key][0]] = pair;
      }
    }
  }
  public static getPair(id: number): Pair {
    return this.pairs[id];
  }
  public static getPairByName(name: string, ignoreSlashDash = false): Pair {
    let _pair: Pair;
    // tslint:disable-next-line: forin
    for (const key in this.pairs) {
      if (this.pairs[key].type === 1) {
        if (this.pairs[key].name === name.replace('/', '-')) {
            _pair = this.pairs[key];
            break;
        }
      } else {
      if ((ignoreSlashDash && this.pairs[key].name.split('-').join('/') === name) ||
        (!ignoreSlashDash && this.pairs[key].name === name)) {
        _pair = this.pairs[key];
        break;
      }
     }
    }
    return _pair;
  }
  // public static getPairByName(name: string): Pair {
  //     let _pair: Pair;
  //     for (const key in this.pairs) {
  //         if (this.pairs[key].name === name) {
  //             _pair = this.pairs[key];
  //             break;
  //         }
  //     }
  //     return _pair;
  // }
  public static getPairRates(http, callBack): void {
    http.get(AppSettings.apiEndpoint + 'market/get-ticker').subscribe(data => {
      if (typeof data.Result !== 'undefined') {
        data = data.Result;
      }

      for (const key in data) {
        if (typeof data[key] !== 'undefined') {
          const _pair = Pairs.getPair(data[key][0]);
          if (typeof _pair !== 'undefined') {
            let precision = 100000000;
            if (data[key][5] > 10) {
              precision = 100;
            }
            _pair.prevDayPrice = Math.round(data[key][6] * precision) / precision;
            const rate = Math.round(data[key][5] * precision) / precision;
            _pair.trendUp = data[key][8];
            _pair.rate = rate;
            _pair.high = Math.round(data[key][3] * precision) / precision;
            _pair.low = Math.round(data[key][4] * precision) / precision;
            _pair.bid = Math.round(data[key][2] * precision) / precision;
            _pair.ask = Math.round(data[key][1] * precision) / precision;
            _pair.volume = Math.round(data[key][7] * precision) / precision;
            _pair.trendUp24hr = _pair.rate > _pair.prevDayPrice;
            if (_pair) {
              if (_pair.baseCurrency.symbol === 'USDT') {
                _pair.rateUsd = _pair.rate;
              } else if (_pair.baseCurrency.symbol === 'BTC') {
                _pair.rateUsd = _pair.rate * Pairs.getUsdtPairRate(_pair.baseCurrency.id);
                setTimeout(() => {
                  _pair.rateUsd = _pair.rate * Pairs.getUsdtPairRate(_pair.baseCurrency.id);
                }, 100);
              } else {
                _pair.rateUsd = _pair.rate * Pairs.getUsdtPairRate(_pair.baseCurrency.id);
                setTimeout(() => {
                  _pair.rateUsd = _pair.rate * Pairs.getUsdtPairRate(_pair.baseCurrency.id);
                }, 100);
                // _pair.rateUsd = 21111;
              }
            }
            Pairs.setPair(_pair);

          }
        }
      }
      callBack();
    });

    // this.tradingPairs = Pairs.getPairs();
  }
  public static getPairs(): Pair[] {
    const pairs: Pair[] = [];
    for (const key in this.pairs) {
      if (typeof this.pairs[key] !== 'undefined') {
        // if (this.pairs[key].Status === 1) {
        pairs.push(this.pairs[key]);
        // }
      }
    }
    return pairs;
  }
  public static getUsdtPairRate(currencyId: number): number {
    for (const key in this.pairs) {
      if (typeof this.pairs[key] !== 'undefined') {
        // if (key === '6') {
        //     this.pairs[key].baseCurrency.id === 4);
        //     this.pairs[key].baseCurrency.id);
        // }
        if (this.pairs[key].marketCurrency.id === currencyId && this.pairs[key].rate !== undefined &&
          this.pairs[key].baseCurrency.id === 4) {
          return this.pairs[key].rate;
        }
      }
    }
    return 1;
  }
}


export class Wallets {
  public static apiCall: ApiCall;
  public static wallets: { [id: number]: Wallet } = {};
  public static offlineCount = 0;
  public static LimitStatus = 0;
  public static LimitValue;
  public static withdrawAmount = 0;
  public static walletStatus = [
    'Unverified', 'Pending', 'Processing', 'Completed', 'Rejected', 'Cancelled', 'Blocked', 'Expired'
  ];
  public static TransactionStatus = [
    'Unconfirmed', 'Confirmed'
  ];
  public static withdrawClass = [
    'red', 'orange', 'blue', 'green', 'red', 'grey', 'red', 'red'
  ];
  public static walletCls = [
    'danger', 'warning', 'info', 'success', 'danger', 'warning', 'danger', 'warning'
  ];
  public static convertToBtc(wallet: Wallet, callback?) {
    const pairs: Pair[] = Pairs.getPairs();
    if (wallet === undefined) {
      return;
    }
    let totalBtc;
    const baseCurrencies = BaseCurrencies.currencies;
    if (!(pairs.length > 0)) {
      return;
    }
    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].marketCurrency.symbol === wallet.currency.symbol && pairs[i].Status === 1) {
        if (pairs[i].baseCurrency.symbol === baseCurrencies[0]) {
          totalBtc = pairs[i].rate * wallet.balance;
          break;
        } else if (pairs[i].baseCurrency.symbol === baseCurrencies[1]) {
          totalBtc = (pairs[i].rate * wallet.balance) / Pairs.getPairByName('BTC/USDT').rate;
        }
      }
    }
    if (totalBtc === undefined) {
      if (wallet.currency.symbol === 'USDT') {
        totalBtc = wallet.balance / Pairs.getPairByName('BTC/USDT').rate;
      }
    }
    return totalBtc;
  }
  public static updateBtcBalance(callBack?): void {
    const pairs: Pair[] = Pairs.getPairs();
    let wallet: Wallet;
    for (const id in this.wallets) {
      if (typeof this.wallets[id] !== 'undefined') {
        wallet = this.wallets[id];
        let totalBtc;
        const baseCurrencies = BaseCurrencies.currencies;
        if (!(pairs.length > 0)) {
          return;
        }
        for (let i = 0; i < pairs.length; i++) {
          if (pairs[i].marketCurrency.symbol === wallet.currency.symbol && pairs[i].Status === 1) {
            if (pairs[i].baseCurrency.symbol === baseCurrencies[0]) {
              totalBtc = pairs[i].rate * wallet.balance;
              break;
            } else if (pairs[i].baseCurrency.symbol === baseCurrencies[1]) {
              totalBtc = (pairs[i].rate * wallet.balance) / Pairs.getPairByName('BTC/USDT').rate;
            }
          }
        }
        if (totalBtc === undefined) {
          if (wallet.currency.symbol === 'USDT') {
            totalBtc = wallet.balance / Pairs.getPairByName('BTC/USDT').rate;
          }
        }
        if (totalBtc === undefined) {
          totalBtc = 0;
        }
        this.wallets[id].btcBalance = totalBtc;
      }
    }
  }
  public static totalBtcBalance(callBack?) {
    const pairs: Pair[] = Pairs.getPairs();
    let wallet: Wallet;
    let sumtotalBtc: Number = 0;
    for (const id in this.wallets) {
      if (typeof this.wallets[id] !== 'undefined') {
        wallet = this.wallets[id];
        let totalBtc;
        const baseCurrencies = BaseCurrencies.currencies;
        if (!(pairs.length > 0)) {
          return;
        }
        for (let i = 0; i < pairs.length; i++) {
          if (pairs[i].marketCurrency.symbol === wallet.currency.symbol && pairs[i].Status === 1) {
            if (pairs[i].baseCurrency.symbol === baseCurrencies[0]) {
              totalBtc = pairs[i].rate * wallet.balance;
              break;
            } else if (pairs[i].baseCurrency.symbol === baseCurrencies[1]) {
              totalBtc = (pairs[i].rate * wallet.balance) / Pairs.getPairByName('BTC/USDT').rate;
            }
          }
        }
        if (totalBtc === undefined) {
          if (wallet.currency.symbol === 'USDT') {
            totalBtc = wallet.balance / Pairs.getPairByName('BTC/USDT').rate;
          }
        }
        sumtotalBtc = sumtotalBtc + (totalBtc);
      }
    }
    return sumtotalBtc;
  }
  public static init(http: HttpClient,
    route: Router, pair: Pair, callBack?: (data, t, T, userGroupLimit, userLocketBalanceLimit?) =>
      void, count = 0) {
    this.apiCall = new ApiCall(http, route);
    this.apiCall.method = 'POST';
    this.apiCall.encryptBody = false;
    this.apiCall.body = { PairId: pair.id, LimitStatus: this.LimitStatus };
    this.apiCall.endPoint = 'trade/get-wallets';
    this.apiCall.authenticate = true;
    this.apiCall.send(
      success => {
        this.offlineCount = 0;
        if (success.Status) {
          const array = success.Result[0];
          const withdrawLimits: UserGroupLimit[] = [];
          if (success.Result[3] !== undefined && success.Result[3] !== null) {
            for (const id in success.Result[3]) {
              if (typeof success.Result[3][id] !== 'undefined') {
                const userGroupLimit = new UserGroupLimit();
                userGroupLimit.limitation = success.Result[3][id][0];
                userGroupLimit.consumed = success.Result[3][id][1];
                userGroupLimit.currency = Currencies.getCurrency(success.Result[3][id][2]);
                withdrawLimits.push(userGroupLimit);
              }
            }
            this.LimitValue = success.Result[3];
          }
          if (success.Result[4] !== undefined && success.Result[4] !== null) {
            this.withdrawAmount = success.Result[4];
          }
          for (const key in array) {
            if (typeof array[key] !== 'undefined') {
              const cur = array[key];
              const wallet = new Wallet();
              wallet.isMemo = cur[9];
              wallet.memo = cur[6];
              wallet.address = cur[1];
              wallet.available = Number(cur[3]);
              wallet.balance = Number(cur[2]);
              wallet.pending = cur[4];
              wallet.conf = cur[7];
              wallet.minW = cur[8];
              wallet.currency = Currencies.getCurrency(cur[0]);
              wallet.defaultTradePair = this.defaultTradePair(wallet.currency);
              // if (wallet.currency.isFiat) {
              //     const fiat = new Fiat();
              //     fiat.accountNumber = cur.Fiat.AccountNumber;
              //     fiat.accountTitle = cur.Fiat.AccountTitle;
              //     fiat.bankName = cur.Fiat.BankName;
              //     fiat.branchCode = cur.Fiat.BranchCode;
              //     wallet.fiat = fiat;
              // }

              this.wallets[cur[0]] = wallet;
            }
          }
          const userLocketBalanceLimit: UserLocketBalanceLimit[] = [];
          for (const id in success.Result[5]) {
            if (typeof success.Result[5][id] !== 'undefined') {
              const _userLocketBalanceLimit = new UserLocketBalanceLimit();
              _userLocketBalanceLimit.currency = Currencies.getCurrency(success.Result[5][id][0]);
              _userLocketBalanceLimit.limit = success.Result[5][id][1];
              userLocketBalanceLimit.push(_userLocketBalanceLimit);
            }
          }
          this.updateBtcBalance();
          callBack(this.wallets, success.Result[1], success.Result[2], withdrawLimits, userLocketBalanceLimit);
        } else if (count <= 2) {
          setTimeout(() => {
            this.init(http, route, pair, callBack, ++count);
          }, 500);
        }
      },
      error => {
        if (error.status === 504) {
          this.offlineCount += 1;
          let inter = 500;
          if (this.offlineCount > 2) {
            inter = 5000;
          }
          setTimeout(() => {
            this.init(http, route, pair, callBack);
          }, inter);
        }
      }
    );
    this.LimitStatus = 0;
  }
  public static defaultTradePair(currency: Currency) {
    const pairs = Pairs.getPairs();
    let leveragePair = false;
    if (currency === undefined) {
      return;
    }
    let defaultTrade;
    const baseCurrencies = BaseCurrencies.currencies;
    if (!(pairs.length > 0)) {
      return;
    }

    for (let i = 0; i < pairs.length; i++) {
      if (pairs[i].marketCurrency.symbol === currency.symbol && pairs[i].Status === 1 && currency.status) {
        if (pairs[i].baseCurrency.symbol === baseCurrencies[0]) {
          defaultTrade = baseCurrencies[0];
          break;
        } else if (pairs[i].baseCurrency.symbol === baseCurrencies[1]) {
          if (pairs[i].marketCurrency.symbol.indexOf('(') > -1) {
            leveragePair = true;
            defaultTrade = pairs[i].name;
          } else {
            defaultTrade = baseCurrencies[1];
          }
        }
      }
    }
    if (leveragePair) {
      return defaultTrade;
    }
    if (defaultTrade === undefined) {
      return 'BTC-USDT';
    }
    return currency.symbol + '-' + defaultTrade;
  }
  public static getHistory(http: HttpClient, route: Router, type: number, callBack) {
    const apiCall = new ApiCall(http, route);
    apiCall.method = 'POST';
    apiCall.encryptBody = false;
    apiCall.body = { Type: type };
    apiCall.endPoint = 'trade/transaction-history';
    apiCall.authenticate = true;
    apiCall.send(
      success => {
        const wt = [];
        success.Result.forEach(val => {
          val.Currency = Currencies.getCurrency(val.CurrencyId);
          val.cls = this.walletCls[val.Status];
          if (type === 2) {
            val.Status = this.TransactionStatus[val.Status];
          }
          if (type === 1) {
            val.Color = this.withdrawClass[val.Status];
            val.Status = this.walletStatus[val.Status];
          }
          if (type === 0 && val.Type === 0) {
            val.Color = this.withdrawClass[val.Status];
            val.Status = this.walletStatus[val.Status];
          }
          if (type === 0 && val.Type === 1) {
            val.Status = this.TransactionStatus[val.Status];
          }
          wt.push(val);
        });
        callBack(wt);
      }, error => {
      });
  }
}

export class SelectedPairs {
  private static readonly key = 'SelectedProducts';
  private static pairs: Pair[] = [];
  public static init(): void {
    if (Storage.exists(this.key)) {
      // Storage.set(this.Key, Pair);
      this.pairs = [];
      const data = JSON.parse(Storage.get(this.key));
      for (const key in data) {
        if (typeof data[key] !== 'undefined') {
          const p = Pairs.getPair(data[key]);
          if (p !== undefined) {
            // if (p.Status === 1) {
            this.pairs.push(p);
            // }
          }
        }
      }
    } else {
      Storage.set(this.key, '{}');
    }
  }
  public static addPair(pair: Pair): void {
    const _pairs = JSON.parse(Storage.get(this.key));
    const pairs = Object.keys(_pairs).map(function (k) { return _pairs[k]; });
    if (pair == null) {
      return;
    }
    const index = pairs.indexOf(pair.id);

    if (index < 0) {
      // if (($(window).width() - $('.tradePanel-right').width() - 100) > $('.favpair-items').outerWidth(true)) {
      //     $('.fav-pairs').addClass('dfkladfklad');
      // }
      // if (($(window).width() - $('.header-btns').width() - 450) > $('.mainpairmenu').outerWidth(true)) {
      const inner = ($(window).width() - $('.tradePanel-right').width()) - $('.favpair-items').width();
      if (($(window).width() - $('.tradePanel-right').width() - inner) > $('.favpair-items').width()) {
        this.pairs.shift();
        pairs.shift();
        this.pairs.push(pair);
        pairs.push(pair.id);
      } else {
        this.pairs.push(pair);
        pairs.push(pair.id);

      }
    } else {
      this.pairs[index] = pair;
    }

    Storage.set(this.key, JSON.stringify(pairs));
  }
  public static removePair(pair: Pair): void {
    const _pairs = JSON.parse(Storage.get(this.key));
    const pairs1 = Object.keys(_pairs).map(function (k) { return _pairs[k]; });
    const index = pairs1.indexOf(pair.id);
    pairs1.splice(index, 1);
    Storage.set(this.key, JSON.stringify(pairs1));
    this.init();
  }
  public static getPairs(): Pair[] {
    return this.pairs;
  }
}
