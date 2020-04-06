import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { Pairs, Pair, Wallet } from '../..//models/market';
import { Order, oType, OrderStatus } from '../../models/order';
import { MatDialog } from '@angular/material/dialog';
import { OrderCancelModalComponent } from '../modals/order-cancel-modal/order-cancel-modal.component';
import { Size, SizeEmpty } from '../../helpers/responsive';
import { CommonJs } from '../../helpers/commonfunctions';
import { Storage } from '../../helpers/storage';
import { disabledDeposit, AppSettings } from '../../config/config';
declare var $: any;
declare var TradingView: any;
@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit, AfterViewInit {
  @Input() isLogin;
  @Input() mainPair: Pair;
  @Input() wallets: { [id: number]: Wallet } = {};
  @Input() isMobile;
  public dateTimeFormat = AppSettings.dateTimeFormat;
  @Input() ordHistTab32;
  @Input() public myOrders = [];
  @Input() orderType32 = [];
  @Input() dropdownModel;
  @Input() dropdownStatus;
  @Input() mcsLoaderStatus;
  @Input() orderToshow32;
  @Input() stockChart;
  @Input() chartOffsetTop;
  @Input() panelExpandStatus;
  @Input() defaultSetting;
  @Input() filtertype;
  @Input() fills;
  @Input() matTab4;
  @Input() myWallets;
  @Input() isTablet;
  @Input() pairinitialized;
  @Input() historyDetailStatus;
  @Output() cancelOrderEvent = new EventEmitter();
  @Output() panelExpand = new EventEmitter();
  @Output() historyTabChangeEvent = new EventEmitter();
  @Output() toggleChartEvent = new EventEmitter();
  @Input() orderHistoryLength;
  @Input() togglechart;
  @Input() dropdownName;
  @Input() isOrderTab;
  public cocoType;
  public closeAfterCancelOrder;
  public tab68: number;
  public tradeHistoryLength;
  public allPairs = Pairs;
  public oStatus = OrderStatus;
  public oType = oType;
  @Input() tversion2 = true;
  public size = SizeEmpty;
  public activeOrderLength;
  public disableWallet = disabledDeposit;
  constructor(private ref: ChangeDetectorRef, public dialog: MatDialog) {
    // setInterval(() => {
    //   //   this.ref.detectChanges();
    // }, 1000);
  }
  ngOnInit() {
    setTimeout(() => {
      this.size = Size;

    });
    setTimeout(() => {
      $('.mcScrollbar32').mCustomScrollbar({
        theme: 'minimal', // 'dark-3',
        alwaysShowScrollbar: 0,
        scrollbarPosition: 'outside'
      });
    }, 500);

  }

  ngAfterViewInit() {

    this.historyTabChange();
    setTimeout(() => {
      this.historyTabChange();
    }, 1000);
    $(window).on('resize', () => {
      this.size = Size;

      let count = 0;
      const interval = setInterval(() => {
        this.size.update();
        count++;
        if (count > 10) {
          clearInterval(interval);
        }
      }, 100);
    });
  }

  decimal_format(number, decimals = 8) {
    number = Number(number);
    if (number !== undefined && number !== '') {
      const str = number.toFixed(decimals);
      return str;
    }
  }
  decimal_floor(number, decimals = 8) {
    number = Number(number);
    if (number !== undefined && number !== '') {
      const str = number.toFixedFloor(decimals);
      return str;
    }
  }
  decimal_trunc(figure, decimals) {
    const d = Math.pow(10, decimals + 1);
    // tslint:disable-next-line: radix
    return ((Number((figure * d).toString()) / d).toFixedFloor(decimals));
  }
  decimal_format_fix(number, decimals = 8) {
    number = Number(number);
    if (number !== undefined && number !== '') {
      const str = number.toFixedFloor(2);
      return str;
    }
  }
  Number(number) {
    return Number(number);
  }
  triggerCondition(order) {
    return CommonJs.checkTriggerCondition(order);
  }
  stopOrderPercentageChange(order) {
    let percenttageChange = 0;
    if (order[9] === 3 && (order[2] === 2) && order[8] !== '-') {
      if (Number(Pairs.getPair(order[1]).rate) > Number(order[8])) {
        percenttageChange = ((Number(Pairs.getPair(order[1]).rate - Number(order[8])) / 100) * 100);
      } else {
        percenttageChange = (Number(order[8]) - (Number(Pairs.getPair(order[1]).rate) / 100) * 100);
      }
      if (percenttageChange <= 1) {
        return false;
      } else {
        return true;
      }
    } else if ((order[2] === 4) && order[8] !== '-') {
      if (order[9] === 0) {
        return false;
      } else {
        return true;
      }
    }
  }
  activateStopOrder() {
    // if()
    //     ((y2 - y1) / y1)*100 = your percentage change
    // (where y1=start value and y2=end value)
    // ((120 - 100) / 100) * 100 = 20 %
  }
  cancelOrder(order: Order) {
    this.cancelOrderEvent.next(order);
  }
  panelToggle(index, type) {
    if (this.panelExpandStatus[type][index] === true) {
      this.panelExpandStatus[type][index] = false;
    } else {
      this.panelExpandStatus[type][index] = true;
    }
    this.closeAfterCancelOrder = this.panelExpandStatus[type][index];
  }
  dropdownToggle(name) {
    this.dropdownName = name;
    this.dropdownStatus[name] = !this.dropdownStatus[name];
  }
  toggleChart(chartOffset) {
    const matTab22 = [chartOffset, this.matTab4];
    this.toggleChartEvent.next(matTab22);
  }
  selectDropdownValue(val, i) {
    this.dropdownModel[this.dropdownName] = val;
    this.dropdownStatus[this.dropdownName] = false;
    if (this.dropdownName === 'ordType32') {
      if (i === 0) {
        this.filtertype = null;
      } else if (i === 1) {
        this.filtertype = 1;
        this.cocoType = 1;
      } else if (i === 2) {
        this.filtertype = 0;
        this.cocoType = 0;
      } else if (i === 3) {
        this.filtertype = 2;
        this.cocoType = 2;
      } else if (i === 4) {
        this.filtertype = 3;
        this.cocoType = 4;
      }
    }
  }
  hideOtherPair(event, hidesmallblnc?) {
    if (hidesmallblnc) {
      this.defaultSetting.hideSmallBalance = event.checked ? true : false;
    } else {
      this.defaultSetting.hideOhter = event.checked ? true : false;
    }
    this.updateDefaultSetting();
  }
  updateDefaultSetting() {
    Storage.set('defaultSetting', JSON.stringify(this.defaultSetting));
  }
  activeOrders() {
    let mainord = [];
    // let averageprice = 0;
    if (this.myOrders) {
      if (!this.defaultSetting.hideOhter) {
        mainord = this.myOrders.filter(ord => [0, 3, 4].indexOf(ord[9]) > -1 &&
          (this.filtertype === null ? true : [this.filtertype, this.cocoType].indexOf(ord[2]) > -1));
      } else {
        mainord = this.myOrders.filter(ord => [0, 3, 4].indexOf(ord[9]) > -1 && ord[1] === this.mainPair.id &&
          (this.filtertype === null ? true : [this.filtertype, this.cocoType].indexOf(ord[2]) > -1));
      }
    }
    this.activeOrderLength = mainord.length;
    return mainord;
  }
  myHistoryOrders() {
    let mainord = [];
    let averageprice = 0;
    if (this.myOrders) {
      if (!this.defaultSetting.hideOhter) {
        mainord = this.myOrders.filter(ord => [1, 2].indexOf(ord[9]) > -1 &&
          (this.filtertype === null ? true : [this.filtertype, this.cocoType].indexOf(ord[2]) > -1));
      } else {
        mainord = this.myOrders.filter(ord => [1, 2].indexOf(ord[9]) > -1 &&
          ord[1] === this.mainPair.id &&
          (this.filtertype === null ? true : [this.filtertype, this.cocoType].indexOf(ord[2]) > -1));
      }
    }
    mainord.forEach(ord => {
      averageprice = 0;
      if (ord[11]) {
        ord[11].forEach(fill => {
          averageprice += Number(fill[2]) * Number(fill[1]);
        });
        ord['avgprice'] = averageprice;
      } else {
        ord['avgprice'] = ord[5];
      }
    });
    this.orderHistoryLength = mainord.length;
    return mainord;
  }
  tradeHistory() {
    let mainord = [];
    if (this.defaultSetting.hideOhter) {
      mainord = this.fills.filter(fill => fill[4] === this.mainPair.id);
    } else {
      mainord = this.fills;
    }
    this.tradeHistoryLength = mainord.length;
    return mainord;
  }
  mytradeHistory() {
    this.fills = [];
    const fills = this.fills;
    if (this.myOrders) {
      this.myOrders.forEach(order => {
        if (order[11]) {
          order[11].forEach(fill => {
            const od = [
              fill[0],
              fill[1],
              fill[2],
              fill[3],
              order[1],
              order[3]
            ];
            // fill[5] = order;
            fills.push(od);
          });
        }
      });
    }
    return this.fills;
  }


  historyToggle(index) {
    $('.orderHistoryTab32 .mcScrollbar').mCustomScrollbar('update');
    if (this.historyDetailStatus[index] === true) {
      this.historyDetailStatus[index] = false;
    } else {
      this.historyDetailStatus[index] = true;
    }
  }

  openOrderCancelModal() {
    if (!this.isLogin) {
      return;
    }

    const dialogRef = this.dialog.open(OrderCancelModalComponent, {
      width: '276px',
      height: '139px',
      panelClass: 'order-cancel-modal',
      data: { 'orderLength': this.activeOrders().length }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.cancelOrderEvent.next(0);
      }
    });
  }

  historyTabChange() {
    // if (this.myOrders === undefined) {
    //   setTimeout(() => {
    //     this.historyTabChange();
    //   }, 100);
    //   return;
    // }
    this.filtertype = null;
    this.dropdownModel['ordType32'] = 'ORDERTYPE';
    const el = this;
    this.historyDetailStatus = {};

    switch (el.matTab4) {
      case 0:
        el.tab68 = el.activeOrders().length;
        break;
      case 1:
        el.tab68 = el.myHistoryOrders().length;
        break;
      case 2:
        el.tab68 = el.tradeHistory().length;
        break;
    }
    let orderlength = Math.round($('.orderHistoryTab32 .mcScrollbar32').outerHeight() / 36);
    this.orderToshow32[this.matTab4] = orderlength;
    if (el.orderToshow32[el.matTab4] !== undefined) {
      if (el.tab68 === el.orderToshow32[el.matTab4]) {
        return;
      } else if (el.tab68 > el.orderToshow32[el.matTab4] && el.orderToshow32[el.matTab4] > 7) {
        orderlength = el.orderToshow32[el.matTab4];
      }
    }

    this.orderToshow32[this.matTab4] = orderlength;
    el.orderOnTotalScroll(el, el.tab68);

    $('.orderHistoryTab32 .mcScrollbar32').mCustomScrollbar('update');

    this.updateFills();
  }
  updateFills() {
    this.fills = this.mytradeHistory();
  }
  orderOnTotalScroll(el, tab68) {
    setTimeout(() => {
      $('.orderHistoryTab32 .mcScrollbar32').mCustomScrollbar({
        theme: 'minimal',
        scrollTo: 'top',
        alwaysShowScrollbar: 0,
        scrollbarPosition: 'outside',
        callbacks: {
          onScroll: function () {
            if (el.orderToshow32[el.matTab4] < tab68) {
              el.mcsLoaderStatus = false;
              let i = 5;
              if (tab68 - el.orderToshow32[el.matTab4] < 5) {
                i = tab68 - el.orderToshow32[el.matTab4];
              }
              setTimeout(() => {
                el.mcsLoaderStatus = true;
                el.orderToshow32[el.matTab4] = el.orderToshow32[el.matTab4] + i;
                $('.orderHistoryTab32 .mat-tab-body-active .mcScrollbar32').mCustomScrollbar('update');
              }, 200);
              // setTimeout(() => {
              //   el.mcsLoaderStatus = true;
              //   el.orderToshow32[el.matTab4] = el.orderToshow32[el.matTab4] + i;
              //   $('.orderHistoryTab32 .mcScrollbar32').mCustomScrollbar('update');
              // }, 200);
            }
          }
        }
      });
    }, 200);
  }
}
