import { Component, ChangeDetectorRef, OnInit, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Pair, Wallet, Pairs } from '../../models/market';
import { ApiCall } from '../../helpers/apicall';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Loader } from '../../helpers/loader';
import { Notification, NotificationType } from '../../helpers/notification';
import { NgForm } from '@angular/forms';
import { Size, SizeEmpty } from '../../helpers/responsive';
import { RangeSliderComponent } from '../range-slider/range-slider.component';
import { Order } from '../../models/order';
import { CommonJs } from '../../helpers/commonfunctions';
declare var $: any;

@Component({
  selector: 'app-coco-order',
  templateUrl: './coco-order.component.html',
  styleUrls: ['./coco-order.component.css']
})
export class CocoOrderComponent implements OnInit {

  @Input() isLogin: boolean;
  @Input() mainPair: Pair;
  @Input() wallets: { [id: number]: Wallet } = {};
  @Input() isMobileTrade;
  @Input() myModel;


  // @Input() public mobileBuyActive;
  @Input() public orderType = [];
  @Input() public socketstatus: boolean;
  @ViewChild('buySlider',{static:true}) rangeSlider: RangeSliderComponent;
  @ViewChild('sellSlider',{static:true}) sellRangeSlider: RangeSliderComponent;



  private apiCaller: ApiCall;
  public model;
  public isDisabled = {};
  public scaleX = {};
  public totalbuy = null;
  public totalsell = null;
  public buyqt: any;
  public sellqt: any;
  public r;
  public buyscale;
  public sellscale;
  public decimallength;
  public ratebining: {};
  public precisionBC;
  public precisionMC;
  public size = SizeEmpty;
  public stepAndMinRate = 0.00001;
  public stepAndMInQty = 0.00001;
  public erroroccur = false;
  public validbuyrate = false;
  public validbuyqty = false;
  public validsellrate = false;
  public validsellqty = false;
  public lastInput: any;
  public initmdel = false;
  public stoptrade = false;
  public myPairs = Pairs;
  public selectedPercent = {};
  public autofocus = { rate: false, qty: false, buyqt: false, sellqt: false };
  public buyPercentageValue = 0;
  public sellPercentageValue = 0;
  public TradeFocus = false;
  // public totalAmount: number;
  // public orderType = ['Buy', 'Sell'];
  public amtPercent = [0, 25, 50, 75, 100];
  public cursorPosition = 0;
  constructor(http: HttpClient, router: Router, private cd: ChangeDetectorRef) {
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
      // console.log(this.TradeFocus, this.lastInput, this.cursorPosition,'stop-limit');
      // console.log(this.cursorPosition,this.lastInput);
      // this.lastInput.selectionStart = this.cursorPosition;
    }, 30);
    this.model = {
      Buy: { OrderType: 1, Stop: 0, Type: 0 },
      Sell: { OrderType: 1, Stop: 0, Type: 1 }
    };
    this.apiCaller = new ApiCall(http, router);
    // this.totalAmount = this.model.Rate ? this.model.Rate * this.model.Quantity : 0.00;
  }
  setCursorPosition() {
    this.TradeFocus = false;
    this.cursorPosition = this.lastInput.selectionStart;
  }
  ngOnInit() {
    const int = setInterval(() => {
      if (this.mainPair.rate) {
        const ordertypes = ['Buy', 'Sell'];
        ordertypes.forEach(otype => {
          this.model[otype].Rate = this.mainPair.rate.toFixed(this.mainPair.basePrecision);
          this.model[otype].LimitPrice = this.mainPair.rate.toFixed(this.mainPair.basePrecision);
          this.model[otype].Stop = this.mainPair.rate.toFixed(this.mainPair.basePrecision);
        });

        clearInterval(int);
        this.precisionBC = this.mainPair.basePrecision;
        this.precisionMC = this.mainPair.marketPrecision;
        this.stepAndMin(this.mainPair);
      }
    });


    setTimeout(() => {
      this.size = Size;
    }, 2000);

  }
  isNumber(input: any): boolean {
    return isNaN(input);
  }
  setRate(rate, ordrType) {
    this.model[ordrType].Rate = Number(rate);
    return rate;
  }
  dollarPrice(ordrType, inputType) {
    return CommonJs.dollarPrice(ordrType, inputType, this.mainPair, this.model);
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
        this.rangeSlider.resetSlider();
      } else if (orderType === 'Sell') {
        this.sellRangeSlider.resetSlider();
      } else {
        this.sellRangeSlider.resetSlider();
        this.rangeSlider.resetSlider();
      }
    }
  }
  stepAndMin(pair: Pair) {
    this.resetSliderr('changePair');
    let sum = 1;
    if (pair.basePrecision !== undefined) {
      sum = Math.pow(10, pair.basePrecision);
      const value = 1 / sum;
      this.stepAndMinRate = value;
    }
    if (pair.marketPrecision !== undefined) {
      sum = Math.pow(10, pair.marketPrecision);
      const value = 1 / sum;
      this.stepAndMInQty = value;
    }
  }
  inputChange(ordrType, buy: boolean, type, e) {
    const myvalue = e.target.value;
    if (e.target.value.length > 1 && !(e.target.value.indexOf('.') > -1)) {
      if (myvalue.charAt(0) === '0') {
        e.target.value = myvalue.slice(1);
      }
    }
    const input: any = e.data;
    if (!isNaN(input) && this.decimallength) {
      const t = this.decimallength.split('.');
      if (t[0] === '0' && input === '0' && !(e.target.value.indexOf('.') > -1)) {
        e.target.value = '0';
      }
    }
    let balance = null;
    let totalqt = null;
    if (this.isLogin) {
      balance = this.wallets[!buy ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
    }
    if (type === 'r') {
      if ((e.target.value.indexOf('e') > -1)) {
        e.target.value = Number(e.target.value).toFixed(this.mainPair.basePrecision);
        return;
      }
    } else {
      if ((e.target.value.indexOf('e') > -1)) {
        e.target.value = Number(e.target.value).toFixed(this.mainPair.marketPrecision);
        return;
      }
    }
    if (ordrType === 'Buy') {
      this.validbuyrate = false;
      totalqt = this.model[ordrType].Quantity * this.model[ordrType].Rate;
      this.validbuyqty = false;
    } else {
      this.validsellrate = false;
      this.validsellqty = false;
      totalqt = this.model[ordrType].Quantity;
    }
    if (this.isMobileTrade) {
      const t = e.target.value.toString().split('.');
      if (type === 'r') {
        if (t[1]) {
          if (t[1].length >= (this.precisionBC)) {
            // this.model[ordrType].Rate = this.decimallength.slice(0, -1);
            e.target.value = Number(this.decimallength).toFixedFloor(this.precisionBC);
          }
        }
      } else {
        if (t[1]) {
          if (t[1].length >= (this.precisionMC)) {
            this.model[ordrType].Quantity = this.decimallength.slice(0, -1);
            e.target.value = Number(this.decimallength).toFixedFloor(this.precisionMC);
          }
        }
      }
    }
    if (ordrType === 'Buy') {
      if ((this.model[ordrType].Quantity !== 0 && this.model[ordrType].Quantity !== null) &&
        (this.model[ordrType].Rate !== 0 && this.model[ordrType].Rate !== null)
      ) {
        this.buyqt = ((this.model[ordrType].Quantity *
          (this.model[ordrType].Rate > this.model[ordrType].LimitPrice ? this.model[ordrType].Rate : this.model[ordrType].LimitPrice)
        ).toFixedFloor(this.precisionBC));
      } else {
        this.buyqt = null;
      }
    } else {
      if ((this.model[ordrType].Quantity !== 0 && this.model[ordrType].Quantity !== null) &&
        (this.model[ordrType].Rate !== 0 && this.model[ordrType].Rate !== null)
      ) {
        this.sellqt = ((this.model[ordrType].Quantity *
          (this.model[ordrType].Rate < this.model[ordrType].LimitPrice ? this.model[ordrType].Rate : this.model[ordrType].LimitPrice)
        ).toFixedFloor(this.precisionBC));
      } else {
        this.sellqt = null;
      }
    }
    // for managing if quantity is zero
    if (!this.isMobileTrade) {
      const t = e.target.value.toString().split('.');
      if (type === 'r') {
        if (t[1]) {
          if (t[1].length >= (this.precisionBC + 1) && e.inputType === 'insertText') {
            e.target.value = this.decimallength;
          }
        }
      } else {
        if (t[1]) {
          if (t[1].length >= (this.precisionMC + 1) && e.inputType === 'insertText') {
            this.model[ordrType].Quantity = this.decimallength;
            e.target.value = this.decimallength;
          }
        }
      }
    }
    if (this.model[ordrType].Quantity === 0 || !(isFinite(this.model[ordrType].Quantity))) {
      if (this.model[ordrType].Rate === 0) {
        return;
      }
      if (ordrType === 'Buy') {
        this.buyqt = Math.floor(
          (balance * this.buyscale)
          / 100 * Math.pow(10, this.precisionBC)) / Math.pow(10, this.precisionBC);
        if (this.model[ordrType].Quantity > 0 || this.buyqt > 0) {
          this.model[ordrType].Quantity = (Number(this.buyqt) / this.model[ordrType].Rate).toFixed(this.precisionBC);
        }
      } else {
        this.sellqt = Math.floor(
          (balance * this.sellscale)
          / 100 * Math.pow(10, this.precisionBC)) / Math.pow(10, this.precisionBC);
        if (this.model[ordrType].Quantity > 0 || this.sellqt > 0) {
          this.model[ordrType].Quantity = (Number(this.sellqt) / this.model[ordrType].Rate).toFixed(this.precisionMC);
        }
      }
    }
    // decimal length validator
    if (this.isLogin) {

      this.updatePercentageValue(ordrType);

      if (totalqt >= balance) {
        this.scaleX[this.orderType.indexOf(ordrType)] = ((balance / balance) * 100) / 100;
        return;
      }
      this.scaleX[this.orderType.indexOf(ordrType)] = ((totalqt / balance) * 100) / 100;
      // calculating percentage
    }
  }
  updatePercentageValue(orderType: any) {
    const balance = this.wallets[!(orderType === 'Buy') ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
    const model = this.model[orderType];
    if (orderType === 'Buy') {
      const total = (this.model[orderType].Rate * this.model[orderType].Quantity);
      const percent = (total / balance) * 100;
      if (!this.isMobileTrade) {
        this.rangeSlider.updateValue(percent, orderType);
      }

    } else {
      const percent = (model.Quantity / balance) * 100;
      if (!this.isMobileTrade) {
        this.sellRangeSlider.updateValue(percent, orderType);
      }
    }
  }
  amountChange(type, ordrType, changetype) {
    if (changetype === true) {
      if (type === 'r') {
        if (!this.model[ordrType].Rate) {
          this.model[ordrType].Rate = 0;
        }
        this.model[ordrType].Rate = (Number(this.model[ordrType].Rate) + this.stepAndMinRate).toFixed(this.precisionBC);
      }
      if (type === 's') {
        if (!this.model[ordrType].Stop) {
          this.model[ordrType].Stop = 0;
        }
        this.model[ordrType].Stop = (Number(this.model[ordrType].Stop) + this.stepAndMinRate).toFixed(this.precisionBC);
      }
      if (type === 'q') {
        if (!this.model[ordrType].Quantity) {
          this.model[ordrType].Quantity = 0;
        }
        this.model[ordrType].Quantity = (Number(this.model[ordrType].Quantity) + this.stepAndMInQty).toFixed(this.precisionMC);
      }
      if (type === 'lp') {
        if (!this.model[ordrType].LimitPrice) {
          this.model[ordrType].LimitPrice = 0;
        }
        this.model[ordrType].LimitPrice = (Number(this.model[ordrType].LimitPrice) + this.stepAndMinRate).toFixed(this.precisionBC);
      }
    } else {
      if (type === 'r') {
        if (!this.model[ordrType].Rate) {
          this.model[ordrType].Rate = 0;
        }
        if (Number(this.model[ordrType].Rate) <= this.stepAndMinRate) {
          return;
        }
        this.model[ordrType].Rate = (Number(this.model[ordrType].Rate) - this.stepAndMinRate).toFixed(this.precisionBC);
      }
      if (type === 's') {
        if (!this.model[ordrType].Stop) {
          this.model[ordrType].Stop = 0;
        }
        if (Number(this.model[ordrType].Stop) <= this.stepAndMinRate) {
          return;
        }
        this.model[ordrType].Stop = (Number(this.model[ordrType].Stop) - this.stepAndMinRate).toFixed(this.precisionBC);
      }
      if (type === 'q') {
        if (!this.model[ordrType].Quantity) {
          this.model[ordrType].Quantity = 0;
        }
        if (Number(this.model[ordrType].Quantity) <= this.stepAndMInQty) {
          return;
        }
        this.model[ordrType].Quantity = (Number(this.model[ordrType].Quantity) - this.stepAndMInQty).toFixed(this.precisionMC);
      }
      if (type === 'lp') {
        if (!this.model[ordrType].LimitPrice) {
          this.model[ordrType].LimitPrice = 0;
        }
        if (Number(this.model[ordrType].LimitPrice) <= this.stepAndMinRate) {
          return;
        }
        this.model[ordrType].LimitPrice = (Number(this.model[ordrType].LimitPrice) - this.stepAndMinRate).toFixed(this.precisionBC);
      }
    }
    if (!this.model[ordrType].Quantity || !this.model[ordrType].Rate) {
      return;
    }
    if (ordrType === 'Buy') {
      this.buyqt = ((Number(this.model[ordrType].Quantity) * Number(this.model[ordrType].Rate)).toFixedFloor(this.precisionBC));

    } else {
      this.sellqt = ((Number(this.model[ordrType].Quantity) * Number(this.model[ordrType].Rate)).toFixedFloor(this.precisionBC));
    }

  }


  onFocus(event) {
    this.lastInput = event.target;
    // this.lastInput.focus();
    event.target.inputMode = 'none';
  }
  increment(type, ordrType) {
    if (type === 'r') {
      $('input[focus-elm=rte]').focus();
      this.lastInput.value = (Number(this.lastInput.value) + this.stepAndMinRate).toFixedFloor(this.precisionBC);
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      this.lastInput.dispatchEvent(evt);
    }
    if (type === 's') {
      $('input[focus-elm=stp]').focus();
      this.lastInput.value = (Number(this.lastInput.value) + this.stepAndMinRate).toFixedFloor(this.precisionBC);
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      this.lastInput.dispatchEvent(evt);
    }
    if (type === 'q') {
      $('input[focus-elm=qty]').focus();
      this.lastInput.value = (Number(this.lastInput.value) + this.stepAndMInQty).toFixedFloor(this.precisionMC);
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      this.lastInput.dispatchEvent(evt);
    }
  }
  decrement() {

  }
  keypad(val) {
    if (val === '.' && (this.lastInput.value === '' || this.lastInput.value === null || this.lastInput.value.indexOf('.') > -1)) {
      return;
    }
    if (this.lastInput === undefined || (this.lastInput.value.charAt(0) === '.' && val === '.')) {
      return;
    }
    let a = this.lastInput.value
    let b = val;
    let position = this.lastInput.selectionStart;
    let output = [a.slice(0, position), b, a.slice(position)].join('');
    // this.lastInput.value = this.lastInput.value + val;

    this.lastInput.value = output;
    this.decimallength = output;
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', false, true);
    this.lastInput.dispatchEvent(evt);
    this.lastInput.selectionStart = position + 1;
    this.setCursorPosition();
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
    if (this.lastInput.selectionStart === 0) {
      return;
    }
    lastValue =
      lastValue.slice(0, this.lastInput.selectionStart - 1) +
      lastValue.slice(this.lastInput.selectionStart);
    this.lastInput.value = Number(lastValue);
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', false, true);
    this.lastInput.dispatchEvent(evt);
    this.lastInput.selectionStart = this.lastInput.selectionStart - 1;
    this.cursorPosition = this.cursorPosition - 1;
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
  setAll(pair) {
    this.model.Buy.Quantity = null;
    this.model.Sell.Quantity = null;
    this.sellqt = null;
    this.buyqt = null;
    this.precisionBC = pair.basePrecision;
    this.precisionMC = pair.marketPrecision;
    this.stepAndMin(pair);
  }
  pickOrder(order: Order, type: number) {
    const t = type === 0 ? 'Buy' : 'Sell';
    let availableblnc: number;
    let setquantity: number;
    let totalqt;
    order.quantity = Number((order.quantity).toFixedFloor(this.mainPair.marketPrecision));
    order.rate = Number((order.rate).toFixedFloor(this.mainPair.basePrecision));
    if (type === 0) { // buy
      if (this.isLogin) {
        availableblnc = this.wallets[this.mainPair.baseCurrency.id].available;
        if ((order.rate * order.quantity) > availableblnc) {
          setquantity = Number((availableblnc / order.rate).toFixedFloor(this.mainPair.basePrecision));
        }
      }
      this.model[t].Quantity = setquantity ? setquantity : order.quantity;
      this.model[t].LimitPrice = (order.rate).toFixedFloor(this.mainPair.basePrecision);
      this.model[t].Rate = (order.rate).toFixedFloor(this.mainPair.basePrecision);
      this.model[t].Stop = (order.rate).toFixedFloor(this.mainPair.basePrecision);
      totalqt = order.rate * (setquantity !== undefined ? setquantity : order.quantity);
      if (this.isLogin) {
        this.scaleX[this.orderType.indexOf(t)] = ((totalqt / availableblnc) * 100) / 100;
      }
      this.buyqt = (this.model[t].Quantity *
        this.model[t].Rate).toFixedFloor(this.mainPair.basePrecision);
    } else { // sell
      if (this.isLogin) {
        availableblnc = this.wallets[this.mainPair.marketCurrency.id].available;
        if (order.quantity > availableblnc) {
          setquantity = Number((availableblnc).toFixedFloor(this.mainPair.marketPrecision));
        }
      }
      this.model[t].Quantity = Number(setquantity !== undefined ?
        setquantity : order.quantity).toFixedFloor(this.mainPair.marketPrecision);
      this.model[t].LimitPrice = order.rate.toFixedFloor(this.mainPair.basePrecision);
      this.model[t].Rate = order.rate.toFixedFloor(this.mainPair.basePrecision);
      this.model[t].Stop = order.rate.toFixedFloor(this.mainPair.basePrecision);
      totalqt = order.rate * (setquantity ? setquantity : order.quantity);
      if (this.isLogin) {
        this.scaleX[this.orderType.indexOf(t)] =
          (((setquantity ? setquantity : order.quantity) / availableblnc) * 100) / 100;
      }
      this.sellqt = (this.model[t].Quantity *
        this.model[t].Rate).toFixedFloor(this.mainPair.basePrecision);
    }

  }
  maxRate(type) {
    if (type === 'r') {
      return this.precisionMC;
    } else if (type === 'q') {
      return this.precisionBC;
    }
  }
  isNotEmpty(variable: any) {
    return typeof variable !== 'undefined'; // && variable !== '';
  }
  totalqtChange(ordrType, buy: boolean, totalqt, e) {
    const myvalue = e.target.value;
    if (e.target.value.length > 1 && !(e.target.value.indexOf('.') > -1)) {
      if (myvalue.charAt(0) === '0') {
        e.target.value = myvalue.slice(1);
      }
    }
    let balance = null;
    // backspace checking code today
    if (!this.isMobileTrade) {
      const t = e.target.value.toString().split('.');
      if (t[1]) {
        if (t[1].length >= (this.precisionBC + 1) && e.inputType === 'insertText') {
          e.target.value = this.decimallength;
        }
      }
    }
    if (this.isMobileTrade) {
      const t = e.target.value.toString().split('.');
      if (t[1] > 1) {
        if (t[1].length >= (this.precisionBC + 1)) {
          e.target.value = Number(this.decimallength).toFixedFloor(this.precisionBC);
        }
      }
    }
    if (this.isLogin) {
      balance = this.wallets[!buy ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
    }

    if (ordrType === 'Buy') {
      const qty = totalqt / this.model[ordrType].Rate;
      // this.model[ordrType].Quantity = Math.round(Number(qty) * this.roundmc) / this.roundmc;
      if (totalqt !== 0 && totalqt !== null) {
        this.model[ordrType].Quantity = Math.ceil(qty * Math.pow(10, this.precisionMC)) / Math.pow(10, this.precisionMC);
      } else {
        this.model[ordrType].Quantity = null;
      }
    } else {
      const qty = totalqt / this.model[ordrType].Rate;
      if (totalqt !== 0 && totalqt !== null) {
        // Math.round( number * 10 ) / 10;
        this.model[ordrType].Quantity = qty;
        this.model[ordrType].Quantity = Math.ceil(qty * Math.pow(10, this.precisionMC)) / Math.pow(10, this.precisionMC);
        // this.model[ordrType].Quantity = qty.toFixed(this.precisionMC);
      } else {
        this.model[ordrType].Quantity = null;
      }
      // this.model[ordrType].Quantity = Math.round(Number(qty) * this.roundmc) / this.roundmc;
    }
    // const test = this.model[ordrType].Quantity.toString().split('.');
    // const test2 = test[1].substring(0, this.precisionBC);
    // this.model[ordrType].Quantity = Number(test[0]) + Number('0.' + test2);
    if (this.isLogin) {
      this.updatePercentageValue(ordrType);
      if (ordrType === 'Buy') {
        if (totalqt >= balance) {
          this.scaleX[this.orderType.indexOf(ordrType)] = ((balance / balance) * 100) / 100;
          return;
        }
        this.scaleX[this.orderType.indexOf(ordrType)] = ((totalqt / balance) * 100) / 100;
      } else {
        if (this.model[ordrType].Quantity >= balance) {
          this.scaleX[this.orderType.indexOf(ordrType)] = ((balance / balance) * 100) / 100;
          return;
        }
        this.scaleX[this.orderType.indexOf(ordrType)] = ((this.model[ordrType].Quantity / balance) * 100) / 100;
      }
    }
  }
  onTotalValueChange(orderType: string, isBuy: boolean) {
  }
  preventChange(): boolean {
    return false;
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
  valueChanging(e) {
    if (e.percentage >= 0 && e.percentage <= 100) {
      this.applyPercent(e.percentage, e.orderType === 'Buy', e.orderType);
    }
  }
  applyPercent(input: number, buy: boolean, ordertype) {
    if (!this.isLogin) {
      return;
    }
    this.selectedPercent[ordertype] = input;
    let balance = this.wallets[!buy ? this.mainPair.marketCurrency.id : this.mainPair.baseCurrency.id].available;
    // if (balance === 0) {
    //   return;
    // }
    if ((this.model[ordertype].Rate === null || this.model[ordertype].Rate === 0)) {
      if (buy) {
        this.buyqt = 0;
        this.buyscale = input;
      } else {
        this.sellqt = 0;
        this.sellscale = input;
      }
      this.model[ordertype].Quantity = 0;
      this.scaleX[this.orderType.indexOf(ordertype)] = input / 100;
      return;
    }
    if (buy) {
      this.buyqt = Math.floor(
        (balance * input)
        / 100 * Math.pow(10, this.precisionBC)) / Math.pow(10, this.precisionBC);
      this.model[ordertype].Quantity = (Number(this.buyqt) / this.model[ordertype].Rate).toFixed(this.precisionMC);
    } else {
      this.model[ordertype].Quantity = Math.floor(
        (balance * input)
        / 100 * Math.pow(10, this.precisionMC)) / Math.pow(10, this.precisionMC);
      this.sellqt = Math.floor(
        (this.model[ordertype].Quantity * this.model[ordertype].Rate)
        * Math.pow(10, this.precisionBC)) / Math.pow(10, this.precisionBC);
    }

    this.scaleX[this.orderType.indexOf(ordertype)] = input / 100;
    // if (ordertype === 'Buy') {
    //   this.totalbuy = Number(balance) / Number(input);
    // } else {
    //   this.totalsell = Number(balance / Number(input));
    // }
    // this.model[ordertype].Quantity = (this.model[ordertype].Rate * this.model[ordertype].Quantity) / this.model[ordertype].Rate;
    if (buy) {
      balance = balance / this.model[ordertype].Rate;
      if (!isFinite(balance)) {
        return;
      }
    }
    // this.model[ordertype].Quantity = Math.round(
    //   (balance * input)
    //   / 100 * Math.pow(10, 8)) / Math.pow(10, 8);
  }
  validateDecimalPlaces(n: number, precision: number) {
    if (n === undefined) {
      return;
    }
    const nn = n.toString().split('.');
    return nn.length < 2 ? true : nn[1].length <= precision;
  }
  onSubmit(ordertype, f: NgForm) {
    // this.scaleX[ordertype === 'Buy' ? 0 : 1] = 0;  return;
    // this.erroroccur = false;
    const rate = this.model[ordertype].Rate;
    // this.buyqt = Number(this.buyqt);
    // this.sellqt = Number(this.sellqt);
    if (ordertype === 'Buy') {
      this.buyqt = Number(this.buyqt);
    } else {
      this.sellqt = Number(this.sellqt);
    }
    // if (ordertype === 'Buy' &&
    //   (this.model[ordertype].Rate === null || this.model[ordertype].Rate === undefined || this.model[ordertype].Rate === 0)) {
    //   this.validbuyrate = true;
    //   this.erroroccur = true;
    // }
    // if (ordertype === 'Buy' &&
    //   (this.model[ordertype].Quantity === null || this.model[ordertype].Quantity === undefined ||
    // this.model[ordertype].Quantity === 0)) {
    //   this.validbuyqty = true;
    //   this.erroroccur = true;
    // }
    // if (ordertype === 'Sell' &&
    //   (this.model[ordertype].Rate === null || this.model[ordertype].Rate === undefined || this.model[ordertype].Rate === 0)) {
    //   this.validsellrate = true;
    //   this.erroroccur = true;
    // }
    // if (ordertype === 'Sell' &&
    //   (this.model[ordertype].Quantity === null || this.model[ordertype].Quantity === undefined ||
    // this.model[ordertype].Quantity === 0)) {
    //   this.validsellqty = true;
    //   this.erroroccur = true;
    // }
    // if (this.erroroccur) {
    //   return;
    // }
    // if (!this.socketstatus) {
    //   Notification.send('Error', 'Cannot create order, You are not connected to socket',
    //     NotificationType.Danger);
    //   return;
    // }
    if (this.model[ordertype].Rate === '' || this.model[ordertype].Quantity === '') {
      Notification.send('OrderFailed', 'PleaseEnterValidRateandAmount', NotificationType.Danger);
      return;
    }
    if (Number(this.model[ordertype].Type) === 1) { // sell
      this.model.Sell.OrderType = 3;
      if (this.mainPair.minimumAmount > (this.model[ordertype].Quantity)) {
        Notification.send('OrderFailed', 'AmountmustbegreaterthanMinAmount',
          NotificationType.Danger,
          60,
          { MinAmount: this.mainPair.minimumAmount, Currency: this.mainPair.marketCurrency.symbol }
        );
        return;
      }
      if (this.mainPair.minimumTotal > (this.sellqt)) {
        Notification.send('OrderFailed', 'AmountmustbegreaterthanMinTotal',
          NotificationType.Danger,
          60,
          { MinTotal: this.mainPair.minimumTotal, Currency: this.mainPair.baseCurrency.symbol }
        );
        return;
      }
      if (this.wallets[this.mainPair.marketCurrency.id].available < this.model[ordertype].Quantity) {
        Notification.send('Error', 'Insufficientbalancetoplacethisorder',
          NotificationType.Danger);
        return;
      }
      this.wallets[this.mainPair.marketCurrency.id].available =
        Number(this.wallets[this.mainPair.marketCurrency.id].available) - Number(this.model[ordertype].Quantity);
      this.wallets[this.mainPair.marketCurrency.id].balance =
        Number(this.wallets[this.mainPair.marketCurrency.id].balance) - Number(this.model[ordertype].Quantity);
    } else {  // buy
      this.model.Buy.OrderType = 3;
      if (this.mainPair.minimumAmount > (this.model[ordertype].Quantity)) {
        Notification.send('OrderFailed', 'AmountmustbegreaterthanMinAmount',
          NotificationType.Danger,
          60,
          { MinAmount: this.mainPair.minimumAmount, Currency: this.mainPair.marketCurrency.symbol }
        );
        return;
      }
      if (this.mainPair.minimumTotal > this.buyqt) {
        Notification.send('OrderFailed', 'AmountmustbegreaterthanMinTotal',
          NotificationType.Danger,
          60,
          { MinTotal: this.mainPair.minimumTotal, Currency: this.mainPair.baseCurrency.symbol }
        );
        return;
      }
      if (this.wallets[this.mainPair.baseCurrency.id].available < this.buyqt) {
        Notification.send('Error', 'Insufficientbalancetoplacethisorder',
          NotificationType.Danger);
        return;
      }
      this.wallets[this.mainPair.baseCurrency.id].available =
        Number(this.wallets[this.mainPair.baseCurrency.id].available) - Number(this.buyqt);
      this.wallets[this.mainPair.baseCurrency.id].balance =
        Number(this.wallets[this.mainPair.baseCurrency.id].balance) - Number(this.buyqt);
    }
    // Loader.show();
    this.model[ordertype].Rate = rate;
    this.isDisabled = {};
    this.isDisabled[ordertype] = true;
    this.model[ordertype].PairId = this.mainPair.id;
    this.apiCaller.method = 'POST';
    if (!this.validateDecimalPlaces(this.model[ordertype].Quantity, this.precisionMC)) {
      this.model[ordertype].Quantity = Number(this.model[ordertype].Quantity).toFixedFloor(this.precisionMC);
    }
    if (!this.validateDecimalPlaces(this.model[ordertype].Rate, this.precisionBC)) {
      this.model[ordertype].Rate = Number(this.model[ordertype].Rate).toFixedFloor(this.precisionBC);
    }
    // return;
    this.stoptrade = true;
    this.apiCaller.body = this.model[ordertype];
    this.apiCaller.authenticate = true;
    this.apiCaller.endPoint = 'trade/trade-order';
    this.apiCaller.encryptBody = false;
    this.apiCaller.send(
      success => {
        this.stoptrade = false;
        this.isDisabled = {};
        if (success.Status) {
          f.reset();
          this.scaleX[this.orderType.indexOf(ordertype)] = 1 / 100;
          this.resetSliderr(ordertype);
        } else {
          Notification.send('Error', success.Message, NotificationType.Danger);
          if (ordertype === 'Sell') { // sell
            this.wallets[this.mainPair.marketCurrency.id].available =
              Number(this.wallets[this.mainPair.marketCurrency.id].available) + Number(this.model[ordertype].Quantity);
            this.wallets[this.mainPair.marketCurrency.id].balance =
              Number(this.wallets[this.mainPair.marketCurrency.id].balance) + Number(this.model[ordertype].Quantity);
          } else { // buy
            this.wallets[this.mainPair.baseCurrency.id].available =
              Number(this.wallets[this.mainPair.baseCurrency.id].available) +
              Number(this.model[ordertype].Quantity * this.model[ordertype].Rate);
            this.wallets[this.mainPair.baseCurrency.id].balance =
              Number(this.wallets[this.mainPair.baseCurrency.id].balance) +
              Number(this.model[ordertype].Quantity * this.model[ordertype].Rate);
          }
        }
      },
      error => {
        this.isDisabled = {};
      }
    );
  }

}
