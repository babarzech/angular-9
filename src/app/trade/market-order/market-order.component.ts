import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Wallet, Pair, Currency } from '../../models/market';
import { ApiCall } from '../../helpers/apicall';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserLogin } from '../../models/userlogin';
import { Notification, NotificationType } from '../../helpers/notification';
import { RangeSliderComponent } from '../range-slider/range-slider.component';
import { Order } from '../..//models/order';

declare var $: any;

@Component({
  selector: 'app-market-order',
  templateUrl: './market-order.component.html',
  styleUrls: ['./market-order.component.css'],
})
export class MarketOrderComponent implements OnInit {

  @Input() isLogin: boolean;
  @Input() mainPair: Pair;
  @Input() isMobileTrade;
  @Input() wallets: { [id: number]: Wallet } = {};
  @Input() public socketConnection = [];
  @Input() public socketstatus;
  @Input() public sellOrders;
  @Input() public buyOrders;
  @Input() public sellOrderExit;
  @Input() public buyOrderExit;
  private apiCaller: ApiCall;
  public scaleX = {};
  public precisionBC: number;
  public precisionMC: number;
  public buyvalid = false;
  public decimallength;
  public sellvalid = false;
  public stepAndMInQty;
  public stoptrade = false;
  // public pairdata;
  public validqty = false;
  public model; // = { Buy: {}, Sell: {}};
  // public totalAmount: number;
  public isDisabled = {};
  public maxrate = 8;
  public lastInput: any;
  public selectedPercent = {};
  public cursorPosition = 0;
  public TradeFocus = false;
  public breakLoop;
  @Input() public orderType = [];

  @ViewChild('buySlider',{static:true}) rangeBuySlider: RangeSliderComponent;
  @ViewChild('sellSlider',{static:true}) sellRangeSlider: RangeSliderComponent;

  public amtPercent = [0, 25, 50, 75, 100];
  constructor(http: HttpClient, public router: Router) {
    const dt = { OrderType: 0, Stop: 0 }; // market order
    this.model = { Buy: dt, Sell: Object.assign({}, dt) };
    this.apiCaller = new ApiCall(http, router);
    // this.totalAmount = this.model.Rate ? this.model.Rate * this.model.Quantity : 0.00;
    setInterval(() => {
      if (!this.TradeFocus) {
        if (this.lastInput && this.cursorPosition) {
          this.lastInput.focus();
          this.lastInput.setSelectionRange(this.cursorPosition, this.cursorPosition, 'forward');
        }
      } else {
        this.lastInput = null;
        this.cursorPosition = 0;
      }
    }, 30);
  }
  setCursorPosition() {
    this.TradeFocus = false;
    this.cursorPosition = this.lastInput.selectionStart;
  }
  ngOnInit() {
    const int = setInterval(() => {
      if (this.mainPair.rate) {
        clearInterval(int);
        this.precisionBC = this.mainPair.basePrecision;
        this.precisionMC = this.mainPair.marketPrecision;
        this.stepAndMin(this.mainPair);
      }
    });
  }
  pickOrder(order: Order, type: number, pick) {
    const t = type === 0 ? 'Buy' : 'Sell';
    if (pick === 1) {
      this.model[t].Quantity = order.quantity;
    }
  }
  isNumber(input: any): boolean {
    return isNaN(input);
  }
  isNotEmpty(variable: any) {
    return typeof variable !== 'undefined'; // && variable !== '';
  }
  preventChange(): boolean {
    return false;
  }
  valueChanging(e) {
    if (e.percentage >= 0 && e.percentage <= 100) {
      this.applyPercent(e.percentage, e.orderType === 'Buy', e.orderType, this.mainPair.rate);
    }
  }
  applyPercent(input: number, buy: boolean, ordertype, Rate) {
    if (!this.isLogin) {
      return;
    }
    this.selectedPercent[ordertype] = input;
    let balance = this.wallets[!buy ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
    const actualbalance = this.wallets[!buy ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
    let qty = 0;
    let filled = 0;
    let sumall = 0;
    let totalqt = 0;
    if (buy) {
      if (this.sellOrders.length === 0) {
        this.model[ordertype].Quantity = 0;
        return;
      }
      for (let i = this.sellOrders.length - 1; i >= 0; i--) {
        if (this.sellOrders[i]) {
          totalqt = totalqt + this.sellOrders[i].quantity;
          sumall = sumall + (this.sellOrders[i].rate * this.sellOrders[i].quantity);
          qty = (this.sellOrders[i].quantity * this.sellOrders[i].rate);
          if (balance > qty) {
            filled = filled + (this.sellOrders[i].quantity * this.sellOrders[i].rate);
            balance = balance - (this.sellOrders[i].quantity * this.sellOrders[i].rate);
          } else if (balance === qty) {
            filled = filled + (this.sellOrders[i].quantity * this.sellOrders[i].rate);
            balance = balance - (this.sellOrders[i].quantity * this.sellOrders[i].rate);
          } else if (balance < qty) {
            filled = filled + balance;
            balance = 0;
          }
        }
        if (filled >= actualbalance) {
          break;
        }
        // if (Number(balance) <= 0) {
        //   break;
        // }
      }
    }
    this.scaleX[this.orderType.indexOf(ordertype)] = input / 100;
    // actualbalance = actualbalance * ()
    if (buy) {
      if (sumall) {
        Rate = sumall / totalqt;
      }
      this.model[ordertype].Quantity = (((actualbalance / Rate) * input) / 100).toFixedFloor(this.precisionMC);
      if (!isFinite(balance)) {
        return;
      }
    } else {
      if (this.buyOrders.length === 0) {
        this.model[ordertype].Quantity = 0;
        return;
      }
      this.model[ordertype].Quantity = ((actualbalance * input) / 100).toFixedFloor(this.precisionMC);
    }
  }
  resetSliderr(orderType) {
    // if (this.sellRangeSlider === undefined) {
    //   setTimeout(() => {
    //     this.resetSliderr(orderType);
    //   }, 100);
    //   return;
    // }
    if (!this.isMobileTrade) {
      if (orderType === 'Buy') {
        this.rangeBuySlider.resetSlider();
      } else if (orderType === 'Sell') {
        this.sellRangeSlider.resetSlider();
      } else {
        this.sellRangeSlider.resetSlider();
        this.rangeBuySlider.resetSlider();
      }
    }
  }
  stepAndMin(pair: Pair) {
    this.resetSliderr('changePair');
    let sum = 1;
    if (pair.marketPrecision !== undefined) {
      sum = Math.pow(10, pair.marketPrecision);
      const value = 1 / sum;
      this.stepAndMInQty = value;
    }
  }
  setAll(pair: Pair) {
    this.model.Buy.Quantity = null;
    this.model.Sell.Quantity = null;
    this.precisionBC = pair.basePrecision;
    this.precisionMC = pair.marketPrecision;
    this.stepAndMin(this.mainPair);
  }
  onFocus(event) {
    this.lastInput = event.target;
    // this.lastInput.focus();
    event.target.inputMode = 'none';
  }
  keypad(val) {
    if (val === '.' && (this.lastInput.value === '' || this.lastInput.value === null || this.lastInput.value.indexOf('.') > -1)) {
      return;
    }
    if (this.lastInput === undefined || (this.lastInput.value.charAt(0) === '.' && val === '.')) {
      return;
    }
    // this.lastInput.value = this.lastInput.value + val;
    let a = this.lastInput.value;
    let output = val;
    let position = 0;
    if (a !== undefined) {
      let b = val;
      // console.log(a);
      position = this.lastInput.selectionStart;
      output = [a.slice(0, position), b, a.slice(position)].join('');
    }
    // console.log(output, this.lastInput);
    this.lastInput.value = output;
    this.decimallength = output;
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', false, true);
    this.lastInput.dispatchEvent(evt);
    this.stepAndMin(this.mainPair);
    this.precisionMC = this.mainPair.marketPrecision;
    this.lastInput.selectionStart = position + 1;
    this.setCursorPosition();
  }
  amountChange(type: any, ordrType, changetype) {
    this.stepAndMin(this.mainPair);
    this.precisionMC = this.mainPair.marketPrecision;
    if (changetype === true) {
      if (type === 'q') {
        if (!this.model[ordrType].Quantity) {
          this.model[ordrType].Quantity = 0;
        }
        this.model[ordrType].Quantity = (Number(this.model[ordrType].Quantity) + this.stepAndMInQty).toFixed(this.precisionMC);
      }
    } else {
      if (type === 'q') {
        if (!this.model[ordrType].Quantity) {
          this.model[ordrType].Quantity = 0;
        }
        if (Number(this.model[ordrType].Quantity) <= 0) {
          return;
        }
        this.model[ordrType].Quantity = (Number(this.model[ordrType].Quantity) - this.stepAndMInQty).toFixed(this.precisionMC);
      }
    }

  }
  keypadRemove() {
    // const lastValue = this.lastInput.value.substr(0, this.lastInput.value.length - 1);
    if (this.lastInput.value.match('([A-Z,a-z])\w+') || (Number(this.lastInput.value) === 0 && this.lastInput.value.length === 1)) {
      this.lastInput.value = '';
      this.lastInput.selectionStart = 1;
      this.cursorPosition = 1;
      return;
    }
    let lastValue = this.lastInput.value; // .substr(0, this.lastInput.value.length - 1);
    // if (this.lastInput.selectionStart === 0 || (lastValue.charAt(0) === '0' && lastValue.charAt(1) === '.' && lastValue.length > 1 && this.lastInput.selectionStart === 1)) {
    if (this.lastInput.selectionStart === 0) {
      return;
    }
    lastValue =
      lastValue.slice(0, this.lastInput.selectionStart - 1) +
      lastValue.slice(this.lastInput.selectionStart);
    // this.lastInput.value = Number(lastValue);
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', false, true);
    this.lastInput.dispatchEvent(evt);
    this.lastInput.selectionStart = this.lastInput.selectionStart - 1;
    this.cursorPosition = this.cursorPosition - 1;
    // this.lastInput.value = Number(lastValue);
    this.lastInput.value = lastValue;
    this.onFocus(evt);
  }
  decimalValidator(e: any) {
    const input: any = String.fromCharCode(e.charCode);
    if (e.target.value.indexOf('.') > -1 && String.fromCharCode(e.charCode) === '.') {
      e.preventDefault();
    }
    if (!isNaN(input)) {
      this.decimallength = e.target.value;
    } else {
      const charCode = (e.which) ? e.which : e.keyCode;
      if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }
  }
  pasteRestriction(e, type) {
    const clipboardData = e.clipboardData;
    const pastedText = clipboardData.getData('text');
    const t = pastedText.split('.');
    if (type === 'r') {
      if (t[1]) {
        if (t[1].length > this.precisionBC || t.length > 1) {
          e.preventDefault();
        }
      }
    } else {
      if (t[1]) {
        if (t[1].length > this.precisionMC || t.length > 1) {
          e.preventDefault();
        }
      }

    }
  }
  inputChange(ordrType: string, buy: boolean, type, e): any {
    const myvalue = e.target.value;
    if (e.target.value.length > 1 && !(e.target.value.indexOf('.') > -1)) {
      if (myvalue.charAt(0) === '0') {
        e.target.value = myvalue.slice(1);
      }
    }
    let balance = null;
    let totalqt = null;
    const input: any = e.data;
    if (!isNaN(input)) {
      const t = this.decimallength.split('.');
      if (t[0] === '0' && input === '0' && !(e.target.value.indexOf('.') > -1)) {
        e.target.value = '0';
      }
    }
    if (type === 'q') {
      if ((e.target.value.indexOf('e') > -1)) {
        e.target.value = Number(e.target.value).toFixed(this.mainPair.marketPrecision);
        return;
      }
      // if (this.model[ordrType].Quantity < 0.000001 && this.model[ordrType].Quantity !== 0
      //   && this.model[ordrType].Quantity !== null) {
      //   // this.model[ordrType].Quantity = Number(this.model[ordrType].Quantity).toFixed(this.precisionBC);
      // }
    }
    if (ordrType === 'Buy') {
      this.buyvalid = false;
      totalqt = this.model[ordrType].Quantity * this.mainPair.rate;
    } else {
      this.sellvalid = false;
      totalqt = this.model[ordrType].Quantity;
    }
    //  else if (this.model[ordrType].Quantity === 0) {
    //   this.model[ordrType].Quantity = this.model[ordrType].Quantity;
    // } else if (this.model[ordrType].Quantity < 0) {
    //   this.model[ordrType].Quantity = Number(this.model[ordrType].Quantity).toFixed(qty);
    // }
    if (!this.isMobileTrade) {
      const t = e.target.value.toString().split('.');
      if (type === 'q') {
        if (t[1]) {
          if (t[1].length >= (this.precisionMC + 1) && e.inputType === 'insertText') {
            e.target.value = this.decimallength;

          }
        }
      }
    }
    if (this.isMobileTrade) {
      const t = e.target.value.toString().split('.');
      // console.log(t);
      if (t[1]) {
        if (t[1].length >= (this.precisionMC + 1)) {
          e.target.value = Number(this.decimallength).toFixedFloor(this.precisionMC);
        }
      }
    }
    if (this.isLogin) {
      this.updatePercentageValue(ordrType);
      balance = this.wallets[!buy ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
      if (totalqt >= balance) {
        this.scaleX[this.orderType.indexOf(ordrType)] = ((balance / balance) * 100) / 100;
        return;
      }
      this.scaleX[this.orderType.indexOf(ordrType)] = ((totalqt / balance) * 100) / 100;
    }
  }
  updatePercentageValue(orderType: string) {
    const balance = this.wallets[!(orderType === 'Buy') ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
    const model = this.model[orderType];
    if (orderType === 'Buy') {
      const total = (this.mainPair.rate * this.model[orderType].Quantity);
      const percent = (total / balance) * 100;
      if (!this.isMobileTrade) {
        this.rangeBuySlider.updateValue(percent, orderType);
      }
    } else {
      const percent = (model.Quantity / balance) * 100;
      if (!this.isMobileTrade) {
        this.sellRangeSlider.updateValue(percent, orderType);
      }
    }
  }
  getBalance(ordrType: string): string {
    const cr = this.mainPair[ordrType === 'Sell' ? 'marketCurrency' : 'baseCurrency'];
    if (cr.symbol === undefined) {
      return '0';
    }
    return this.getUserBalance(ordrType).toString() + ' ' + cr.symbol;
    // const wlt = this.wallets[cr.id];
    // if (wlt !== undefined && wlt.available !== undefined) {
    //   if (ordrType === 'Buy') {
    //     return Number(wlt.available).toFixedFloor(this.precisionBC) + ' ' + cr.symbol;
    //   } else {
    //     return Number(wlt.available).toFixedFloor(this.precisionMC) + ' ' + cr.symbol;
    //   }
    // } else {
    //   return '0 ' + cr.symbol;
    // }
  }
  getUserBalance(ordrType: string) {
    const cr = this.mainPair[ordrType === 'Sell' ? 'marketCurrency' : 'baseCurrency'];
    if (cr.symbol === undefined) {
      return 0;
    }
    const wlt = this.wallets[cr.id];
    if (wlt !== undefined && wlt.available !== undefined) {
      if (ordrType === 'Buy') {
        return (Number(wlt.available).toFixedFloor(this.precisionBC));
      } else {
        return (Number(wlt.available).toFixedFloor(this.precisionMC));
      }
    } else {
      return 0;
    }
  }
  validateDecimalPlaces(n: number, precision: number) {
    if (n === undefined) {
      return;
    }
    const nn = n.toString().split('.');
    return nn.length < 2 ? true : nn[1].length <= precision;
  }
  onSubmit(ordertype: string) {
    this.breakLoop = false;
    if (this.model[ordertype].Quantity === '') {
      Notification.send('OrderFailed', 'PleaseenterValidAmount', NotificationType.Danger);
      return;
    }
    if (!this.socketstatus) {
      Notification.send('Error', 'Youarenotconnectedtosocket',
        NotificationType.Danger);
      return;
    }
    if (this.mainPair.minimumAmount > (this.model[ordertype].Quantity)) {
      Notification.send('OrderFailed', 'AmountmustbegreaterthanMinAmount',
        NotificationType.Danger,
        60,
        { MinAmount: this.mainPair.minimumAmount, Currency: this.mainPair.marketCurrency.symbol }
      );
      return;
    }
    let totalAmount = 0;
    const totalorders = ordertype === 'Buy' ? this.sellOrders : this.buyOrders;
    const orderlength = ordertype === 'Buy' ? this.sellOrders.length : this.buyOrders.length;
    if (orderlength === 0) {
      Notification.send('Error', 'Thereisnomarket',
        NotificationType.Danger);
      return;
    }
    for (const key in totalorders) {
      if (totalorders[key] !== undefined) {
        totalAmount = totalAmount + totalorders[key].quantity;
      }
    }
    if (Number(this.model[ordertype].Quantity) > totalAmount) {
      Notification.send('Error', 'OrderAmountisBiggerthanAvailableAmountinMarketAvailableAmountis',
        NotificationType.Danger,
        60,
        { Amount: totalAmount, Currency: this.mainPair.marketCurrency.symbol }
      );
      return;
    }
    if (ordertype === 'Buy') {
      if (this.mainPair.minimumTotal > (this.mainPair.rate * this.model[ordertype].Quantity)) {
        Notification.send('OrderFailed', 'AmountmustbegreaterthanMinTotal',
          NotificationType.Danger,
          60,
          { MinTotal: this.mainPair.minimumTotal, Currency: this.mainPair.baseCurrency.symbol }
        );
        return;
      }
    } else {
      if (this.mainPair.minimumTotal > (this.mainPair.rate * this.model[ordertype].Quantity)) {
        Notification.send('OrderFailed', 'AmountmustbegreaterthanMinTotal',
          NotificationType.Danger,
          60,
          { MinTotal: this.mainPair.minimumTotal, Currency: this.mainPair.baseCurrency.symbol }
        );
        return;
      }
    }
    let userBuyOrd = Object.keys(this.buyOrderExit);
    let userSellOrd = Object.keys(this.sellOrderExit);
    userSellOrd = userSellOrd.sort((a: any, b: any) => a - b);
    userBuyOrd = userBuyOrd.sort((a: any, b: any) => b - a);
    userBuyOrd.length = 1;
    userSellOrd.length = 1;
    if (ordertype === 'Buy') {
      let totalSellQty = 0;
      for (let i = this.sellOrders.length - 1; i >= 0; i--) {
        if (this.breakLoop) {
          break;
        }
        userSellOrd.forEach(ord => {
          if (Number(ord) === this.sellOrders[i].rate) {
            if (Number(this.model[ordertype].Quantity) > (totalSellQty)) {
              if (totalSellQty === 0) {
                Notification.send('OrderFailed', 'TradecannotbeexecutedagainstyourBuyOrder',
                  NotificationType.Danger);
              } else {
                Notification.send('OrderFailed', 'YouCanPlaceOrderOfAmountUptoQuantity',
                  NotificationType.Danger,
                  60,
                  { Quantity: totalSellQty, Currency: this.mainPair.marketCurrency.symbol }
                );
              }
              this.breakLoop = true;
              return;
            }
          }
        });
        totalSellQty = totalSellQty + this.sellOrders[i].quantity;
      }
    } else {
      let totalBuyQty = 0;
      for (let i = 0; i <= this.buyOrders.length - 1; i++) {
        if (this.breakLoop) {
          break;
        }
        userBuyOrd.forEach(ord => {
          if (Number(ord) === this.buyOrders[i].rate) {
            if (Number(this.model[ordertype].Quantity) > totalBuyQty) {
              if (totalBuyQty === 0) {
                Notification.send('OrderFailed', 'TradecannotbeexecutedagainstyourBuyOrder',
                  NotificationType.Danger);
              } else {
                Notification.send('OrderFailed', 'YouCanPlaceOrderOfAmountUptoQuantity',
                  NotificationType.Danger,
                  60,
                  { Quantity: totalBuyQty, Currency: this.mainPair.marketCurrency.symbol }
                );
              }
              this.breakLoop = true;
              return;
            }
          }
        });
        totalBuyQty = totalBuyQty + this.buyOrders[i].quantity;
      }
    }
    if (this.breakLoop === true) {
      return;
    }
    if (!this.validateDecimalPlaces(this.model[ordertype].Quantity, this.precisionMC)) {
      this.model[ordertype].Quantity = Number(this.model[ordertype].Quantity).toFixedFloor(this.precisionMC);
    }
    this.stoptrade = true;
    this.isDisabled = {};
    this.isDisabled[ordertype] = true;
    this.model[ordertype].PairId = this.mainPair.id;
    this.model[ordertype].Rate = 0;
    this.apiCaller.method = 'POST';
    this.model[ordertype].Type = ordertype === 'Sell' ? 1 : 0;
    this.apiCaller.body = this.model[ordertype];
    this.apiCaller.authenticate = true;
    this.apiCaller.encryptBody = false;
    this.apiCaller.endPoint = 'trade/trade-order';
    this.apiCaller.send(
      success => {
        this.scaleX[this.orderType.indexOf(ordertype)] = 1 / 100;
        this.resetSliderr(ordertype);
        // Loader.hide();
        this.stoptrade = false;
        this.isDisabled = {};
        if (success.Status) {
          this.model[ordertype] = { OrderType: 0, Rate: 0, Stop: 0 };
          // Notification.send('Order Created', success.Message, NotificationType.Success);
        } else {
          this.isLogin = UserLogin.Filter(true, (data) => {
            if (!(data === true)) {
              this.router.navigate(['login']);
            }
          });
          Notification.send('OrderFailed', success.Message, NotificationType.Danger);
        }
      },
      error => {
        // Loader.hide();
        this.isDisabled = {};
      }
    );
  }

}
