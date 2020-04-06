import {
  Component, OnInit, AfterViewInit, Renderer2, EventEmitter, OnDestroy, Output, ViewChild, ChangeDetectorRef, Inject, HostListener
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { DOCUMENT } from '@angular/platform-browser';
import { Location, DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { Notification, NotificationType } from '../helpers/notification';
import { Pairs, Pair, Currencies, Wallets, Wallet, Currency } from '../models/market';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { AppSettings, chartLangSettings } from '../config/config';
import { Orders, Order, OrderType, oType, OrderStatus } from '../models/order';
import { LimitOrderComponent } from './limit-order/limit-order.component';
// import { Observable } from 'rxjs/Rx';
// import { ISubscription } from 'rxjs/Subscription';
import { Loader } from '../helpers/loader';
import { ChartConfiguration } from '../config/chartconfig';
import { UserLogin } from '../models/userlogin';
import { Size, SizeEmpty } from '../helpers/responsive';
import { FavPair } from '../models/favpair';
import { Title } from '@angular/platform-browser';
import { Storage } from '../helpers/storage';
import { SocketJob } from '../helpers/socketjob';
import { symbolology, tvtimezones } from '../helpers/staticdata';
import { DataFeed } from '../helpers/tradingview';
import { MarketOrderComponent } from './market-order/market-order.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StopOrderComponent } from './stop-order/stop-order.component';
import { OrderCancelModalComponent } from './modals/order-cancel-modal/order-cancel-modal.component';
// import { Jsonp } from '@angular/http';
import { CommonJs } from '../helpers/commonfunctions';
import { Redirect } from '../helpers/redirect';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { OrderDragModalComponent } from './modals/order-drag-modal/order-drag-modal.component';
import { CocoOrderComponent } from './coco-order/coco-order.component';
import { NotificationHelper } from '../helpers/notificationhelper';
import { Observable } from 'rxjs/internal/Observable';
import { interval, SubscriptionLike } from 'rxjs';
// import { Observable } from 'rxjs';

declare var $: any;
declare var TradingView: any;

@Component({
  selector: 'app-trade',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
})
export class TradeComponent implements OnInit, AfterViewInit, OnDestroy {
  public mainPair: Pair;
  public changeInTotalOrder = 0;
  public isMobile: boolean;
  public isTablet: boolean;
  public buyOrders: Order[] = [];
  public sellOrders: Order[] = [];
  public selectedPairs: Pair[] = [];
  public historyOrders: Order[] = [];
  private subscriptions: SubscriptionLike[];
  public OrderStatus = OrderStatus;
  public searchParam: string;
  public userHistoryOrders: Order[];
  public matTab1: number;
  public matTab4: number;
  private router: Router;
  public Number = Number;
  public showSideBar: boolean;
  public chartFirstLoaded: boolean;
  public Math = Math;
  @Output() changeHeaderSelected = new EventEmitter<Pair>();
  public tradingPairs: Pair[];
  public custommsg;
  public wallets: { [id: number]: Wallet } = {};
  public matTab2: Number = 0;
  public matTab3: any;
  public buyOrdersPager: any;
  public hbuyOrdersPager: any;
  public sellOrdersPager: any;
  public hsellOrdersPager: any;
  public userOrders: Order[];
  public userOrdersPager: any;
  public userOrder: any;
  public righttab;
  public userHistoryOrdersPager: any;
  public userHistoryOrder: any;
  public activeStatus = {};
  public MktTabStatus = {};
  public selectedStatus = {};
  public ratePrecision;
  public markets = ['BTC', 'USDT'];
  public w_balance: number;
  public size = SizeEmpty;
  public otherfav = [];
  public rateGroup = [];
  public totalOrderBookOrdersToShow = 9;
  public totalOrderBookOrdersToShow1: number;
  public spLinks = false;
  public totalOrderQuantity = { buy: 0, sell: 0 };
  public pairtblCol = 1;
  public market_val: string;
  public pairSort = { sortAsc: true, property: '' };
  public pairSortCol = {
    name: { asc: false, desc: false },
    rate: { asc: false, desc: false },
    change: { asc: false, desc: false },
    volume: { asc: false, desc: false }
  };

  public dropdownStatus = { 'group': false, 'ordType32': false };
  public dropdownName: string;
  public dropdownModel = {};

  public isChartTab: boolean;
  public isTradeTab: boolean;
  public isOrderTab: boolean;
  public isBuySellTab: boolean;
  public myOrders = [];
  public isPopupOpen: boolean;
  public mobileBuyActive = true;
  public favPairs: Pair[] = [];
  public skipExecution = false;
  public favPairOnly = false;
  public isLogin: boolean;
  public pairInit: any;
  public MktMobileTab325 = ['Favorites', 'Market', 'Trade', 'MyOrders'];
  public orderType12 = ['Buy', 'Sell'];
  public orderType13 = ['Buy', 'Sell'];
  public orderType32 = ['All', 'LimitOrder', 'Market', 'StopLImit', 'Coco'];
  public tvWidget: any;
  public overflow: boolean;
  public initPage = false;
  public btnLoaderStatus = false;
  public historyDetailStatus = {};
  public oldHistoryRateTracker = 0;
  public oldClass = 'text-success';
  public dateTimeFormat = AppSettings.dateTimeFormat;
  public togglechart = false;
  public favStatus = {};
  public orderBookLoading = true;
  public panelExpandStatus = { 'oorder': {}, 'ohistory': {}, 'thistory': {} };
  public allPairs;
  public pairinitialized = false;
  public oType = oType;
  public oStatus = OrderStatus;
  // public backuporderhistory;
  // public tickerRate;
  public selectedOrderTab: number;
  public orderHistoryLength = null;
  public activeOrderLength = null;
  public tradeHistoryLength = null;
  public myWallets;
  public orderBookType = 0;
  public defaultSetting: { hideOhter: boolean, hideFavTab: boolean, hideSmallBalance: boolean, mobibileSettings: { tradeTab: string } };
  public fills = [];
  public favPairsId = [];
  public lastScrollTop = 0;
  public delta = 5;
  public mymodel: any;
  public socketstatus = false;
  public reverseOrders;
  public buyOrderExit = {};
  public sellOrderExit = {};
  public currentPair;
  public tversion2 = true;
  public groupedSell = [];
  public groupedBuy = [];
  public mktwidth = 0;
  public filtertype = null;
  public deductHeight: number;
  public pcounter = 0;
  public orderToBeShown: number;
  public orderToshow32 = [];
  public mcsLoaderStatus = true;
  public chartOffsetTop: number;
  public mobileOrderBookHeight;
  public timer = true;
  public orderDraged: any = {};
  public orderDrop: any = {};
  public tooltipMessage = {};
  public wscrollTop: number;
  public userRelatedTimeZone = [];
  public pageLoaded = false;
  public prevPair = [];
  public isLeveragePairShow = true;
  @ViewChild(LimitOrderComponent, { static:true }) LimitOrderChild: LimitOrderComponent;
  @ViewChild(HeaderComponent, { static:true }) child: HeaderComponent;
  @ViewChild(MarketOrderComponent, { static:true }) MarketOrderChild: MarketOrderComponent;
  @ViewChild(StopOrderComponent, { static:true }) StopOrderChild: StopOrderComponent;
  @ViewChild(UserOrdersComponent, { static:true }) userOrderChild: UserOrdersComponent;
  @ViewChild(CocoOrderComponent, { static:true }) CocoOrderChild: CocoOrderComponent;


  constructor(private ref: ChangeDetectorRef, private routing: ActivatedRoute, private location: Location,
    public title: Title, public dialog: MatDialog,
    public route: Router, private renderer: Renderer2, public httpClient: HttpClient, private overlayContainer: OverlayContainer,
    @Inject(DOCUMENT) private document: Document) {
    // setTimeout(() => {
    //   ref.detach();
    //   setInterval(() => {
    //     this.ref.detectChanges();
    //   }, 100);
    // }, 6000);
    this.renderer.addClass(document.getElementsByTagName('html')[0], 'trade-html');
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    Loader.show();
    this.chartFirstLoaded = false;
    this.matTab3 = 1;
    this.matTab4 = 0;
    this.tradingPairs = [];
    this.showSideBar = false;
    this.subscriptions = [];
    this.mainPair = new Pair();
    this.mainPair.marketCurrency = new Currency();
    this.mainPair.baseCurrency = new Currency();
    this.router = route;
    this.isMobile = false;

    if ($(window).width() < 768) {
      this.isMobile = true;
    }

    if ($(window).width() < 1200) {
      this.isTablet = true;

    } else {
      this.isTablet = false;
    }
    this.dateTimeFormat = this.isMobile ? AppSettings.timeFormatMobile : this.dateTimeFormat;
    this.defaultSettingManager();
    User.init(httpClient, route);
    UserLogin.init(httpClient, route);
    Orders.init(this.httpClient, this.route);
    Currencies.init(httpClient, (currency) => {
      Pairs.init(this.httpClient, () => {
        this.allPairs = Pairs;
        this.pairinitialized = true;
        if (window.location.hash === '') {
          // window.location.hash = 'BTC-LTC';
          // window.location.hash = 'BTC/USDT';
        }
        this.isLogin = UserLogin.Filter(true, (data) => {
          if (data === true || this.isLogin === true) {
            this.isLogin = data;
            this.initializePage();
          }
          this.isLogin = data;
          if (data === true) {
            FavPair.init(httpClient, route);
          }
        });
        if (this.isLogin === false) {
          this.initializePage();
        }
        const ttt = setInterval(() => {
          if (this.child !== undefined) {
            this.child.pairsInit();
            clearInterval(ttt);
          } else {
          }
        }, 100);

      });
    });

    // this.tooltipMessage['coco'] = '<strong>COCO Order </strong> <br> Use this order to place a Stop Limit order and a Limit order ' +
    //   'at the same time. If either one is completed, the other will be cancelled. If either is cancelled, the ' +
    //   'other will be cancelled as well.';
    this.tooltipMessage['coco'] = NotificationHelper.getMessageTranslation('Usethisorderto');

  }
  public initializePage() {
    this.initselected();
    this.initPage = true;
    this.tradingPairs = Pairs.getPairs();
    if (CommonJs.isNotEmpty(this.routing.snapshot.params.pair)) {
      const PairName = this.routing.snapshot.params.pair.replace('-', '/');
      let _Pair = Pairs.getPairByName(PairName);
      if (!CommonJs.isEmpty(_Pair)) {
        this.changePair(_Pair);
      } else {
        if (_Pair === undefined) {
          this.router.navigate(['/error/pagenotfound']);
          return;
        }
        _Pair = Pairs.getPairByName('BTC/USDT');
        if (!CommonJs.isEmpty(_Pair)) {
          this.changePair(_Pair);
        }
      }
    }
    // if (this.routing.snapshot.params.pair) {
    //   const PairName = this.routing.snapshot.params.pair.replace('-', '/');
    //   let _Pair = Pairs.getPairByName(PairName);
    //   if (_Pair != null && _Pair !== undefined) {
    //     this.changePair(_Pair);
    //   } else {
    //     if (_Pair === undefined) {
    //       this.router.navigate(['/error/pagenotfound']);
    //       return;
    //     }
    //     _Pair = Pairs.getPairByName('BTC/USDT');

    //     if (_Pair != null) {
    //       this.changePair(_Pair);
    //     }
    //   }
    // }
    this.httpClient.get(AppSettings.apiEndpoint + 'market/get-ticker').subscribe(data => {
      Loader.hide();
      this.updateTickerData(data);
    });
    if (this.isLogin) {
      this.getmyOrderHistory();
      FavPair.getFavPairs(result => {
        if (result.Status === true) {
          this.favPairsId = result.Result;
          this.favPairsId = Storage.get('favorites') !== null ? JSON.parse(Storage.get('favorites')) : [];
          result.Result.forEach(p => {
            if (!(this.favPairsId.indexOf(p) > -1)) {
              this.favPairsId.push(p);
            }
            this.addFavPair();
          });
        }
      });
    } else {

      this.favPairsId = Storage.get('favorites') !== null ? JSON.parse(Storage.get('favorites')) : [];
      this.favPairsId.forEach(p => {
        const pp = Pairs.getPair(p);
        if (pp.Status === 1) {
          this.favPairs.push(pp);
        }
        // this.removeextra(Pairs.getPair(p));
      });
    }
    if (this.isLogin) {
      this.subscriptions.push(interval(60000).subscribe(res => {
        if (this.mainPair !== null) { // && typeof this.mainPair !== 'undefined') {
          this.updateWallets(this.mainPair);
        }
      }));

      this.subscriptions.push(interval(221000 * 10 * 2).subscribe(res => {
        if (this.mainPair !== null) { // && typeof this.mainPair !== 'undefined') {
        }
      }));
    }
    // const int = setInterval(() => {
    //   if (this.mainPair.rate) {
    //     this.title.setTitle(this.mainPair.rate.toFixedFloor(this.mainPair.basePrecision) + ' | '
    // + this.mainPair.name + ' | Buy & Sell '
    // +
    //       this.mainPair.marketCurrency.name + ' | DECOIN Exchange');
    //     clearInterval(int);
    //   }
    // });
  }
  defaultSettingManager() {
    if (Storage.exists('defaultSetting')) {
      this.defaultSetting = JSON.parse(Storage.get('defaultSetting'));
    } else {
      this.defaultSetting = { hideOhter: false, hideFavTab: false, hideSmallBalance: false, mobibileSettings: { tradeTab: 'Trade' } };
      this.updateDefaultSetting();
    }
    if ($(window).width() < 1367) {
      if (!Storage.exists('defaultSetting')) {
        this.defaultSetting.hideFavTab = false;
      }
    } else {
      if (!Storage.exists('defaultSetting')) {
        this.defaultSetting.hideFavTab = true;
      }
    }
    if (this.defaultSetting.mobibileSettings === undefined) {
      this.defaultSetting.mobibileSettings = { tradeTab: 'Market' };
    }
    this.MktMobileTab(this.defaultSetting.mobibileSettings.tradeTab);
  }
  wrapAll(el, wrapper, cls) {
    Array.prototype.forEach.call(el, function (c) {
      wrapper.className = cls;
      wrapper.appendChild(c);
    });
    const tbottom = document.querySelector('.tradePanel-bottom');

    document.querySelector('.tradePanels').insertBefore(wrapper, tbottom);
  }

  unWrap(wrapper) {
    const docFrag = document.createDocumentFragment();
    while (wrapper.firstChild) {
      const child = wrapper.removeChild(wrapper.firstChild);
      docFrag.appendChild(child);
    }

    wrapper.parentNode.replaceChild(docFrag, wrapper);
  }

  checkMarketLength() {
    const mktwidth = $('.mkt-info-wrap').width();
    let mwidth = 0;
    $('.mkt-info').each(function () {
      mwidth += $(this).width();
    });

    mwidth = mwidth + ((!this.isMobile) ? ($('.leverage-pair').width() + 15) : 0);

    if (mwidth > mktwidth) {
      if ($('.mkt-info-item').length > 3) {
        $('.mkt-info-item:not(.dn-v2):last').remove();
      }
      return true;
    }
  }

  initselected() {
    this.tradingPairs = Pairs.getPairs();
    if (this.routing.snapshot.params.pair) {
      const PairName = this.routing.snapshot.params.pair.replace('-', '/');
      const _Pair = Pairs.getPairByName(PairName);
      this.mainPair = _Pair;
      if (_Pair != null) {
        // this.changePair(_Pair);
      }
      if (this.isMobile) {
        this.selectedPairs = this.selectedPairs.filter((pair1) => {
          return pair1.name === this.mainPair.name;
        });

      }
    }
  }
  sortPairTable(property: string, type: string) {
    let lastSort = null;
    for (const key of Object.keys(this.pairSortCol)) {
      if (this.pairSortCol[key].asc === true || this.pairSortCol[key].desc === true) {
        lastSort = {
          key: key,
          value: Object.assign({}, this.pairSortCol[key])
        };
      }
      this.pairSortCol[key].asc = false;
      this.pairSortCol[key].desc = false;
    }
    if (lastSort != null) {
      if (lastSort.key === property) {
        this.pairSortCol[property].desc = !lastSort.value.desc;
        this.pairSortCol[property].asc = !lastSort.value.asc;
      } else {
        this.pairSortCol[property].asc = true;
      }
    } else {
      this.pairSortCol[property].asc = true;
    }
    if (this.pairSort.property === property) {
      this.pairSort.sortAsc = !this.pairSort.sortAsc;
    } else {
      this.pairSort.property = property;
      this.pairSort.sortAsc = true;
    }
    this.tradingPairs.sort((a, b) => {
      if (type === 'str') {
        const va = a[property].toUpperCase();
        const vb = b[property].toUpperCase();
        if (this.pairSort.sortAsc) {
          return (va < vb) ? -1 : (va > vb) ? 1 : 0;
        } else {
          return (va > vb) ? -1 : (va < vb) ? 1 : 0;
        }
      } else if (type === 'num') {
        if (this.pairSort.sortAsc) {
          return parseFloat(a[property]) - parseFloat(b[property]);
        } else {
          return parseFloat(b[property]) - parseFloat(a[property]);
        }
      } else if (type === 'percnt') {
        const aper = this.isNotEmpty(a.rate) ?
          (a.prevDayPrice !== 0 ? ((a.rate / a.prevDayPrice) * 100 - 100) : 100) : -100000;
        const bper = this.isNotEmpty(b.rate) ?
          (b.prevDayPrice !== 0 ? ((b.rate / b.prevDayPrice) * 100 - 100) : 100) : -100000;
        if (this.pairSort.sortAsc) {
          return parseFloat(aper.toString()) - parseFloat(bper.toString());
        } else {
          return parseFloat(bper.toString()) - parseFloat(aper.toString());
        }
      }
    });
  }
  favPairRestrictionToggle(event) {
    $(event.target).toggleClass('active');
    this.favPairOnly = !this.favPairOnly;
  }
  isNotEmpty(value): boolean {
    return value !== undefined && value !== 0;
  }
  isNotEmptyNum(variable: any) {
    return variable !== undefined; // && variable !== '';
  }
  pairMenuToggle() {
    this.child.pairMenuToggle();
    this.renderer.addClass(document.getElementsByClassName('mat-menu-panel')[0], 'favpair_menu1');
  }


  mktMenuOpen() {
    document.getElementsByClassName('info_menu1')[0].parentElement.classList.add('mktmenu-overlay-pane');
  }

  sellordersSorted() {
    const value = this.ratePrecision;
    // this.groupedSell = [];
    if (value === this.mainPair.basePrecision) {

      this.groupedSell = this.sellOrders;
      return;
    }
    const grpSell = [];
    for (let i = 0; i <= this.sellOrders.length - 1; i++) {
      if (this.sellOrders[i]) {
        grpSell.push({
          // rate: Number(this.decimal_trunc(this.sellOrders[i].rate, value)),
          rate: Number(this.decimal_trunc(this.sellOrders[i].rate + (1 / (Math.pow(10, this.ratePrecision))), value)),
          quantity: this.sellOrders[i].quantity,
          total: (Number(this.decimal_trunc(this.sellOrders[i].rate, this.mainPair.basePrecision)) * this.sellOrders[i].quantity)
        });
      }
    }
    for (let i = grpSell.length - 1; i >= 0; i--) {
      if (grpSell[i] && grpSell[i - 1]) {
        if (grpSell[i].rate === grpSell[i - 1].rate) {
          grpSell[i].quantity = grpSell[i - 1].quantity + grpSell[i].quantity;
          grpSell[i].total = grpSell[i - 1].total + grpSell[i].total;
          grpSell.splice(i - 1, 1);
        }
      }
    }
    for (let i = grpSell.length - 1; i >= 0; i--) {
      if (grpSell[i].rate === 0) {
        if (grpSell.length === 1) {
          // grpSell = [];
          this.groupedSell = [];
          return;
        }
        if (grpSell[i - 1] && grpSell[i]) {
          grpSell[i - 1].quantity = grpSell[i - 1].quantity + grpSell[i].quantity;
          grpSell.splice(i, 1);
        }
      }
    }
    this.groupedSell = grpSell;
  }
  buyordersSorted() {
    const value = this.ratePrecision;
    // this.groupedBuy = [];
    if (value === this.mainPair.basePrecision) {
      this.groupedBuy = this.buyOrders;
      return;
    }
    const grpBuy = [];
    for (let i = 0; i <= this.buyOrders.length - 1; i++) {
      if (this.buyOrders[i]) {
        grpBuy.push({
          rate: Number(this.decimal_trunc(this.buyOrders[i].rate, value)),
          quantity: this.buyOrders[i].quantity,
          total: (Number(this.decimal_trunc(this.buyOrders[i].rate, this.mainPair.basePrecision)) * this.buyOrders[i].quantity)
        });
      }
    }

    for (let i = grpBuy.length - 1; i >= 0; i--) {
      if (grpBuy[i] && grpBuy[i - 1]) {
        if (grpBuy[i].rate === grpBuy[i - 1].rate) {
          grpBuy[i].quantity = grpBuy[i - 1].quantity + grpBuy[i].quantity;
          grpBuy[i].total = grpBuy[i - 1].total + grpBuy[i].total;
          grpBuy.splice(i - 1, 1);
        }
      }
    }
    // for (let i = grpBuy.length - 1; i >= 0; i--) {
    //   if (grpBuy[i].rate === 0) {
    //     if (grpBuy.length === 1) {
    //       // grpBuy = [];
    //       this.groupedBuy = [];
    //       return;
    //     }
    //     grpBuy[i - 1].quantity = grpBuy[i - 1].quantity + grpBuy[i].quantity;
    //     grpBuy.splice(i, 1);
    //   }
    // }
    this.groupedBuy = grpBuy;
  }
  selectDropdownValue(val, i?) {
    // debugger;
    this.dropdownModel[this.dropdownName] = val;
    this.dropdownStatus[this.dropdownName] = false;
    if (this.dropdownName === 'group') {
      this.ratePrecision = val;
      // this.updateOrderBook(this.mainPair, OrderStatus.Active);
      this.buyordersSorted();
      this.sellordersSorted();
    }

  }

  panelToggle(index, type) {
    if (this.panelExpandStatus[type][index] === true) {
      this.panelExpandStatus[type][index] = false;
    } else {
      this.panelExpandStatus[type][index] = true;
    }
  }
  public getSellCount(index: number) {
    const selllength = this.ratePrecision === this.mainPair.basePrecision ? this.sellOrders.length : this.groupedSell.length;
    this.calculateTotal();
    let cnt = 0;
    if (selllength > this.totalOrderBookOrdersToShow) {
      index = index + (selllength - this.totalOrderBookOrdersToShow);
    }

    for (let i = index; i < selllength; i++) {
      if (this.groupedSell[i]) {
        cnt += this.groupedSell[i].quantity;
      }
    }
    return cnt;
  }
  public getBuyCount(index: number) {
    this.calculateTotal();
    let cnt = 0;
    this.groupedBuy.forEach((dt, ind) => {
      if (ind > index) {
        return false;
      }
      cnt += dt.quantity;

    });
    return cnt;
  }

  updateTickerData(data, short = false): void {
    if (typeof data.Result !== 'undefined') {
      data = data.Result;
    }
    for (const key in data) {
      if (typeof data[key] !== 'undefined') {
        // if (short) {
        //   data[key].PairId = data[key].PI;
        // }
        const _pair = Pairs.getPair(data[key][0]);
        if (typeof _pair !== 'undefined') {
          let precision = 100000000;
          if (data[key][5] > 10) {
            precision = 100;
          }
          _pair.prevDayPrice = Math.round(data[key][6] * precision) / precision;
          const rate = Math.round(data[key][5] * precision) / precision;
          // if (_pair.rate === 0) {
          //   _pair.rate = _pair.prevDayPrice;
          // }
          _pair.trendUp = data[key][8];
          // _pair.trendUp = rate > _pair.rate;
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
          try {
            if (this.mainPair.id === _pair.id) {
              DataFeed.dataUpdateRate(_pair.rate);
              this.title.setTitle(_pair.rate.toFixedFloor(this.mainPair.basePrecision) + ' | ' + this.mainPair.name + ' | Buy & Sell ' +
                this.mainPair.marketCurrency.name + ' | DECOIN Exchange');
              this.mainPair = _pair;
            }
          } catch (err) { }
        }
      }
    }
    this.tradingPairs = Pairs.getPairs();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.wscrollTop = this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
  }
  selectfocusIn(e) {
    if (this.StopOrderChild.TradeFocus || this.LimitOrderChild.TradeFocus || this.MarketOrderChild.TradeFocus) {
      this.StopOrderChild.TradeFocus = false;
      this.LimitOrderChild.TradeFocus = false;
      this.MarketOrderChild.TradeFocus = false;
    } else {
      // e.target.blur();
      this.StopOrderChild.TradeFocus = true;
      this.LimitOrderChild.TradeFocus = true;
      this.MarketOrderChild.TradeFocus = true;
    }
    // e.target;
  }
  ngOnInit() {

    // this.socketstatus = true;
    // let didScroll;
    // $(window).scroll(function (event) {
    //   didScroll = true;
    // });

    // setInterval(() => {
    //   if (this.isMobile) {
    //     if (didScroll) {
    //       this.hasScrolled();
    //       didScroll = false;
    //     }
    //   }
    // }, 250);

    // if (this.isMobile === true) {
    //   this.MktMobileTab('Market');
    // }
    // this.defaultSettingManager();

    setInterval(() => {

      $('.mcScrollbar').mCustomScrollbar({
        theme: 'minimal', // 'dark-3',
        alwaysShowScrollbar: 0,
        scrollbarPosition: 'outside',
        mouseWheel: {
          scrollAmount: 60,
          normalizeDelta: true
        }
      });
      this.size = Size;

    }, 50);

    if (Storage.exists('leveragePairShow')) {
      this.isLeveragePairShow = false;
    }

    // $('.mcScrollbar').mCustomScrollbar({
    //   scrollInertia: 0,
    //   live: true
    // });
    // this.size = Size;
    // $('.dataTable1').DataTable({
    //   scrollCollapse: true,
    //   paging: false,
    //   info: false,
    //   language: {
    //     search: '<i class="material-icons search-icon">search</i>',
    //     searchPlaceholder: 'Search...'
    //   },
    //   'initComplete': function (settings, json) {
    //     $('.dataTables_scrollBody').mCustomScrollbar({
    //       theme: 'dark-3',
    //       alwaysShowScrollbar: 0,
    //     });
    //   }
    // });

  }

  // hasScrolled() {
  //   const st = $(window).scrollTop();
  //   if (Math.abs(this.lastScrollTop - st) <= this.delta) {
  //     return;
  //   }

  //   if (st > this.lastScrollTop && st > this.size.headerHeight) {
  //     $('.buySell-btns').addClass('down');
  //   } else {
  //     if (st + $(window).height() < $(document).height()) {
  //       $('.buySell-btns').removeClass('down');
  //     }
  //   }
  //   this.lastScrollTop = st;
  // }

  toggleSupport() {
    this.spLinks = !this.spLinks;
  }


  favPairsToggle() {
    this.defaultSetting.hideFavTab = !this.defaultSetting.hideFavTab;
    this.updateDefaultSetting();
    this.togglechart = false;
  }


  matTooltipToggle(tt, msg, cls) {
    tt.toggle();
    document.getElementsByClassName('mat-tooltip')[0].parentElement.parentElement.classList.add(cls);
    document.getElementsByClassName('mat-tooltip')[0].innerHTML = msg;
    event.stopPropagation();
  }

  toggleChart(chartOffset) {
    this.matTab4 = chartOffset[1];
    chartOffset = chartOffset[0];
    if (this.isMobile) {
      this.togglechart = !this.togglechart;
      return;
    }
    this.historyDetailStatus = {};
    const el = this;
    this.chartOffsetTop = chartOffset;
    if (this.togglechart) {
      this.defaultSetting = JSON.parse(Storage.get('defaultSetting'));
      this.togglechart = false;

    } else {
      if (this.defaultSetting.hideFavTab) {
        this.defaultSetting.hideFavTab = false;
      }
      this.togglechart = true;
      this.initializeTradingView(this.mainPair);
    }


    setTimeout(() => {
      let orderlength = Math.round($('.orderHistoryTab32 .mcScrollbar32').outerHeight() / 36);

      if (el.orderToshow32[el.matTab4] !== undefined) {
        if (this.userOrderChild.tab68 === el.orderToshow32[el.matTab4]) {
          return;
        } else if (this.userOrderChild.tab68 > el.orderToshow32[el.matTab4] && el.orderToshow32[el.matTab4] > 7) {
          orderlength = el.orderToshow32[el.matTab4];
        }
      }

      this.orderToshow32[this.matTab4] = orderlength;

    });

    setTimeout(() => {
      $('.orderHistoryTab32 .mcScrollbar32').mCustomScrollbar('update');
    }, 400);


  }

  // tabChange(event) {
  //   if (this.isMobile === false) {
  //     this.size.update();
  //     $('.dataTables_scrollBody').height(((this.size.chartHeight + this.size.marketOrderCreateHeight) / 2 - 127));
  //   }
  //   this.matTab2 = event.index;
  // }

  orderTabChange(event) {
    this.selectedOrderTab = Number(event.target.value);
  }


  getUserOrderPicked() {
    const ordersPicked = [];
    this.userOrderChild.activeOrders().forEach((order) => {
      if (Number(order[5]) === this.orderDraged.rate) {
        ordersPicked.push(order);
      }
    });
    return ordersPicked;
  }
  // drap and drp
  // drap and drp
  drop(ev, order, orderType) {
    // order.orderType = orderType;
    Object.assign(this.orderDrop, order);
    this.orderDrop.orderType = orderType;
    this.getUserOrderPicked();
    const id = (this.orderDrop.orderType === 'buy' ? this.mainPair.baseCurrency.id : this.mainPair.marketCurrency.id);
    let balance = (this.wallets[id].available);
    const Rate = this.orderDrop.rate;
    let calulateQuantity = 0;
    this.getUserOrderPicked().forEach(ord => {
      this.orderDraged.rate = Number(ord[6]);
      calulateQuantity = calulateQuantity + Number(ord[6]);
    });
    let total = 0;
    let quantity = 0;
    balance = balance + (this.orderDrop.orderType === 'buy' ? (this.orderDraged.rate * calulateQuantity) : calulateQuantity);
    if (this.orderDrop.orderType === 'buy') {
      total = (Rate * calulateQuantity);
      if (total > balance) {
        quantity = balance / Rate;
      } else {
        quantity = calulateQuantity;
      }
    } else {
      total = calulateQuantity;
      quantity = calulateQuantity;
      // }
    }

    const dialogRef = this.dialog.open(OrderDragModalComponent, {
      width: '350px',
      panelClass: 'order-drag-modal',
      data: { Rate: Rate, Quantity: quantity, pair: this.mainPair }
      // data: { Rate: 5, Quantity: 9, pair: this.mainPair }
    });
    dialogRef.afterClosed().subscribe((result: any) => {

      if (result) {
        // this.orderDraged
        // result.Rate,result.Quantity
        const total1 = this.orderDrop.orderType === 'buy' ? (result.Rate * result.Quantity) : result.Quantity;
        if (balance > (total1)) {
          //  result.dntShowAgain
        } else {
          Notification.send('Error', 'Insufficientbalancetoplacethisorder', NotificationType.Danger);
        }
      }
    });
    ev.preventDefault();
    // document.getElementsByClassName('order-drag-modal')[0].parentElement.parentElement.classList.add('order-drag-overlay');
    // var data = ev.dataTransfer.getData("text");
    // ev.target.appendChild(document.getElementById(data));
  }

  allowDrop(ev, order, orderType) {
    // if (this.orderDraged.orderType === orderType) {
    ev.preventDefault();
    // return true;
    // }
  }

  drag(ev, order, orderType) {
    Object.assign(this.orderDraged, order);
    // this.orderDraged = order;
    this.orderDraged.orderType = orderType;
    // ev.dataTransfer.setData("text", ev.target.id);
  }
  // end drag and drop
  // end drag and drop



  MktMobileTab(mtab: string, tabChange?) {
    this.MktTabStatus = {};
    this.MktTabStatus[mtab] = true;
    this.isChartTab = false;
    this.isTradeTab = false;
    this.isOrderTab = false;
    this.isBuySellTab = false;
    if (mtab === 'Favorites') {
      this.isChartTab = true;
    } else if (mtab === 'Market') {
      this.isTradeTab = true;
      this.totalOrderBookOrdersToShow = 9;
      if (tabChange && this.orderBookType !== 0) {
        this.orderBookTypeSwitch(0);
      }
    } else if (mtab === 'Trade') {
      this.isBuySellTab = true;
      this.buySell_Popup('Buy');
    } else if (mtab === 'MyOrders') {
      this.isOrderTab = true;
    }
    // setTimeout(() => {
    // $('#sellscroll').mCustomScrollbar(
    // {
    // theme: 'minimal', // 'dark-3',
    // alwaysShowScrollbar: 0,
    // scrollbarPosition: 'outside',
    // });
    // setTimeout(() => {
    // $('#sellscroll').mCustomScrollbar(
    // 'scrollTo', 'bottom', {
    // scrollInertia: 0
    // });
    // }, 100);
    // $('.buyscrollorderbook').mCustomScrollbar(
    // {
    // theme: 'minimal', // 'dark-3',
    // alwaysShowScrollbar: 0,
    // scrollbarPosition: 'outside',
    // });
    // }, 100);
    // if (!firsttime) {
    this.defaultSetting.mobibileSettings.tradeTab = mtab;
    this.updateDefaultSetting();
    // } else {
    // setTimeout(() => {
    // this.MktMobileTab(this.defaultSetting.mobibileSettings.tradeTab);
    // }, 300);
    // }
  }

  buySell_Popup(ordertype) {
    if (ordertype === 'Buy') {
      this.orderType13 = ['Buy'];
      this.selectedStatus = { Buy: true };
    } else {
      this.orderType13 = ['Sell'];
      this.selectedStatus = { Sell: true };
    }
  }

  closePopup() {
    this.isPopupOpen = false;
    this.selectedStatus = {};
  }
  mktClick(market: string) {
    if (this.activeStatus[market] === true) {
      this.activeStatus = {};
    } else {
      this.activeStatus = {};
      this.activeStatus[market] = true;
      this.market_val = market;
    }
  }
  createRange(length: number) {
    const ar = [];
    for (let i = 0; i < length; i++) {
      ar.push(i);
    }
    return ar;
  }

  pairMenuOpen() {
    $('.mat-menu-panel').mCustomScrollbar();
  }
  toggleSideBar(event) {
    this.showSideBar = this.showSideBar ? false : true;
  }

  searchPair() {
    const param = this.searchParam.toLowerCase().trim();
  }

  checkOrderExits() {
    this.buyOrderExit = {};
    this.sellOrderExit = {};
    this.userOrderChild.activeOrders().forEach((order) => {
      if (order[3] === 0) {
        this.buyOrders.forEach((ord) => {
          if (Number(order[5]) === ord.rate && order[9] === 0) {
            this.buyOrderExit[ord.rate] = true;
          }
        });
      } else {
        this.sellOrders.forEach((ord) => {
          if (Number(order[5]) === ord.rate && order[9] === 0) {
            this.sellOrderExit[ord.rate] = true;
          }
        });
      }
    });
  }
  updateWallets(pair: Pair): void {
    Wallets.init(this.httpClient, this.router, pair,
      done => {
        if (this.mainPair.marketCurrency === undefined) {
          return;
        } else {
        }
        this.wallets = done;
        this.myWallets = Object.values(this.wallets);
        this.myWallets = this.myWallets.sort((a, b) => (a.btcBalance < b.btcBalance) ? 1 : -1);
        this.myWallets.forEach(wlt => {
          if (wlt.btcBalance === undefined) {
            this.myWallets.splice(this.myWallets.indexOf(wlt), 1);
            this.myWallets.push(wlt);
          }
        });
        this.w_balance = this.wallets[this.mainPair.marketCurrency.id].balance;
      });
  }
  public calculateTotal(type = 0) {
    const selllength = this.ratePrecision === this.mainPair.basePrecision ? this.sellOrders.length : this.groupedSell.length;
    if (type !== 2) { // in case of 0 and 1
      this.totalOrderQuantity.buy = 0;
      this.groupedBuy.forEach((order, index) => {
        if (index < this.totalOrderBookOrdersToShow) {
          this.totalOrderQuantity.buy += order.quantity;
        }
      });
    }
    if (type !== 1) { // in case of 0 and 2
      this.totalOrderQuantity.sell = 0;
      const t = selllength - this.totalOrderBookOrdersToShow;
      this.groupedSell.forEach((order, index) => {
        if (index >= t) {
          this.totalOrderQuantity.sell += order.quantity;
        }
      });
    }
  }
  updateOrderBook(pair: Pair, type: OrderStatus, count?) {
    let url: string;
    const historyOrders = type === OrderStatus.Completed;
    if (type === OrderStatus.Completed) {
      url = 'market/get-market-history/';
    } else {
      url = 'market/get-orderbook/';
    }
    this.httpClient.get(AppSettings.apiEndpoint + url + pair.id).subscribe(result => {
      if (pair.id !== this.mainPair.id) {
        return;
      }
      if (result['Status']) {
        result = result['Result'];
        const sellIndex = 0; // historyOrders ? '0' : '0';
        // if (historyOrders === true) {
        //   this.historyOrders = [];
        // } else {
        //   this.sellOrders = [];
        //   this.buyOrders = [];
        // }
        if (type === OrderStatus.Completed) {
          // if(DataFeed.resolution === '1'){
          DataFeed.resetCandle();
          DataFeed.onMarketHistory(result[sellIndex]);
          
          // }

        }
        for (const key in result[sellIndex]) {
          if (typeof result[sellIndex][key] !== 'undefined') {
            const order = new Order();
            if (type === OrderStatus.Active) {
              order.quantity = Number(result[sellIndex][key][0]);
              order.rate = Number(result[sellIndex][key][1]);
              const pow = Math.pow(10, this.mainPair.marketPrecision);
              if ((Math.floor(order.quantity * pow) / pow) > 0) {
                this.sellOrders.push(order);
              }
            } else {
              order.rate = Number(result[sellIndex][key][0]);
              order.quantity = Number(result[sellIndex][key][1]);
              // order.type = result[sellIndex][key][2] === 0 ? OrderType.Buy : OrderType.Sell;
              order.date = result[sellIndex][key][2];
              order.trendUp = result[sellIndex][key][3];
              this.historyOrders.push(order);
            }
          }
        }
        if (historyOrders === false) {
          this.buyOrders = [];
          for (const key in result[1]) {
            if (typeof result[1][key] !== 'undefined') {
              const order = new Order();
              order.quantity = Number(result[1][key][0]);
              order.rate = Number(result[1][key][1]);
              if (Number(key) < this.totalOrderBookOrdersToShow) {
              }
              const pow = Math.pow(10, this.mainPair.marketPrecision);
              if ((Math.floor(order.quantity * pow) / pow) > 0) {
                this.buyOrders.push(order);
                this.buyordersSorted();
              }
            }
          }
        }
        this.sortOrders(this.sellOrders);
        this.sortOrders(this.buyOrders);
        this.buyordersSorted();
        this.sellordersSorted();
        this.calculateTotal();
        if (type === OrderStatus.Active) {
          this.orderBookLoading = false;
        }

        setTimeout(() => {
          this.checkOrderExits();
        }, 1000);
      }
    },
      error => {
        if (CommonJs.isEmpty(count)) {
          count = 0;
        }
        count++;
        if (count < 5) {
          this.updateOrderBook(pair, type, count);
        }

        // console.log('error occur', error);
      }
    );
  }
  getmyOrderHistory() {
    Orders.getMyOrders(res => {
      this.myOrders = res;
    });
  }
  updateDefaultSetting() {
    Storage.set('defaultSetting', JSON.stringify(this.defaultSetting));
  }
  dropdownToggle(name) {
    this.dropdownName = name;
    this.dropdownStatus[name] = !this.dropdownStatus[name];
  }
  addFavPair() {
    this.favPairs = [];
    this.favPairsId.forEach(p => {
      const pp = Pairs.getPair(p);
      if (pp.Status === 1) {
        this.favPairs.push(pp);
      }
    });
    Storage.set('favorites', JSON.stringify(this.favPairsId));
  }
  openOrderCancelModal() {
    this.userOrderChild.openOrderCancelModal();
  }
  cancelOrder(order) {
    const orderArray = [];
    if (order === undefined) {
      return;
    }
    if (order === 0) {
      this.userOrderChild.activeOrders().forEach(ord => {
        orderArray.push(ord[0]);
        ord[9] = OrderStatus.__;
      });
    } else {
      orderArray.push(order[0]);
      order[9] = OrderStatus.__;
    }

    // this.btnLoaderStatus = true;
    Orders.cancelOrder(orderArray,
      success => {
        if (success.Status) {
          order[9] = OrderStatus.Cancelled;
          this.checkOrderExits();
        } else {
          order[9] = OrderStatus.Active;
          Notification.send('Error', success.Message, NotificationType.Danger);
        }
      });
  }
  initializeTradingView(pair: Pair) {
    try {
      ChartConfiguration.defaultConfig2.symbol = pair.name;
      ChartConfiguration.defaultConfig2.timezone = this.getTimeZone();
      DataFeed.init(this.httpClient, this);
      ChartConfiguration.defaultConfig2.datafeed = DataFeed;
      const resolution = Storage.get('tradingViewResolution');
      if (resolution !== null) {
        ChartConfiguration.defaultConfig2.interval = resolution;
      }
      this.tvWidget = new TradingView.widget(ChartConfiguration.defaultConfig2);
      window['tvWidget'] = this.tvWidget;
      this.chartFirstLoaded = true;
      this.tvWidget.onChartReady(() => {
      });
    } catch (err) {
      console.error(err);
    }
  }
  // addFavourite(pair) {
  //   FavPair.updateFavPair(pair, result => {
  //   });
  // }
  // displayFavPair(i: number) {
  //   const width = (i + 1) * 165;
  //   return (Size.chartWidth - 105) > width;
  // }
  dollarPrice(price) {
    let newprice;
    if (price >= 1) {
      newprice = price.toFixedFloor(2);
    } else if (price < 1) {
      newprice = price.toFixedFloor(4);
    } else if (price < 0.001) {
      newprice = price.toFixedFloor(6);
    }
    return newprice;
  }
  // managefav(pair) {
  //   if (($(window).width() - $('.tradePanel-right').width() - 406) <= $('.favpair-items').width()) {
  //     this.favPairs.shift();
  //     this.favPairs.push(pair);
  //   } else {
  //     this.favPairs.push(pair);
  //   }
  //   if (this.isMobile) {
  //     this.favPairs = this.favPairs.filter((pair1) => {
  //       return pair1.name === this.mainPair.name;
  //     });
  //   }
  // }
  removeFav(pair: Pair) {

    if (this.favPairsId.indexOf(pair.id) > -1) {
      this.favPairsId.splice(this.favPairsId.indexOf(pair.id), 1);
    }
    this.addFavPair();
    if (!this.isLogin) {
      return;
    }
    FavPair.updateFavPair(pair, status => {
      if (!status) {
        this.favPairsId.push(pair.id);
        this.addFavPair();
        // if (!(this.favPairsId.indexOf(pair.id) > -1)) {
        //   if (pair.Status === 1) {
        //     this.favPairs.push(pair);
        //   }
        // } else {

        // }
      }
    });
  }
  triggerCondition(order) {
    return CommonJs.checkTriggerCondition(order);
  }
  formatNumber(num) {
    if (!num) {
      return num;
    }
    // return num;
    const t = num.toString().split('.');
    return (t[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + (t[1] ? '.' + t[1] : ''));
  }
  setRateGroup(pair: Pair) {
    this.rateGroup = [];
    const max = pair.basePrecision;
    const min = pair.basePrecision > 3 ? pair.basePrecision - 3 : 0;
    for (let i = min; i <= max; i++) {
      if (!(this.rateGroup.indexOf(i) > -1)) {
        this.rateGroup.push(i);
      }
    }
  }
  reSetBuySellWigets(pair: Pair) {
    if (this.StopOrderChild === undefined || this.MarketOrderChild === undefined || this.LimitOrderChild === undefined) {
      setTimeout(() => {
        this.reSetBuySellWigets(pair);
      });
      return;
    }
    this.LimitOrderChild.precisionBC = this.mainPair.basePrecision;
    this.LimitOrderChild.precisionMC = this.mainPair.marketPrecision;
    this.MarketOrderChild.precisionMC = this.mainPair.marketPrecision;
    this.MarketOrderChild.precisionBC = this.mainPair.basePrecision;
    this.StopOrderChild.precisionMC = this.mainPair.marketPrecision;
    this.StopOrderChild.precisionBC = this.mainPair.basePrecision;
    this.LimitOrderChild.stepAndMin(pair);
    this.MarketOrderChild.stepAndMin(pair);
    this.StopOrderChild.stepAndMin(pair);
    this.CocoOrderChild.stepAndMin(pair);
    this.CocoOrderChild.selectedPercent = {};
    this.CocoOrderChild.precisionMC = this.mainPair.marketPrecision;
    this.CocoOrderChild.precisionBC = this.mainPair.basePrecision;
    this.LimitOrderChild.selectedPercent = {};
    this.MarketOrderChild.selectedPercent = {};
    this.StopOrderChild.selectedPercent = {};
    const ordertypes = ['Buy', 'Sell'];
    ordertypes.forEach(type => {
      this.LimitOrderChild.model[type].Rate = (this.mainPair.rate).toFixedFloor(this.mainPair.basePrecision);
      this.LimitOrderChild.model[type].Quantity = null;
      this.LimitOrderChild.scaleX[this.LimitOrderChild.orderType.indexOf(type)] = ((1 / 100) * 100) / 100;
      this.LimitOrderChild.sellqt = null;
      this.LimitOrderChild.buyqt = null;
      this.MarketOrderChild.model[type].Quantity = '';
      this.MarketOrderChild.scaleX[this.LimitOrderChild.orderType.indexOf(type)] = ((1 / 100) * 100) / 100;
      this.StopOrderChild.model[type].Stop = (this.mainPair.rate).toFixedFloor(this.mainPair.basePrecision);
      this.StopOrderChild.model[type].Rate = (this.mainPair.rate).toFixedFloor(this.mainPair.basePrecision);
      this.StopOrderChild.model[type].Quantity = '';
      this.StopOrderChild.buyqt = '';
      this.StopOrderChild.sellqt = '';
      this.StopOrderChild.scaleX[this.LimitOrderChild.orderType.indexOf(type)] = ((1 / 100) * 100) / 100;
      this.CocoOrderChild.model[type].Rate = this.mainPair.rate.toFixedFloor(this.mainPair.basePrecision);
      this.CocoOrderChild.model[type].LimitPrice = this.mainPair.rate.toFixedFloor(this.mainPair.basePrecision);
      this.CocoOrderChild.model[type].Stop = this.mainPair.rate.toFixedFloor(this.mainPair.basePrecision);
      this.CocoOrderChild.model[type].Quantity = '';
      this.CocoOrderChild.buyqt = '';
      this.CocoOrderChild.sellqt = '';
      this.CocoOrderChild.scaleX[this.CocoOrderChild.orderType.indexOf(type)] = ((1 / 100) * 100) / 100;
    });
  }
  toggleChartTablet() {
    if (this.isTablet) {
      $('.tradeHistory-panel .mcScrollbar').mCustomScrollbar({
        theme: 'minimal', // 'dark-3',
        alwaysShowScrollbar: 0,
        scrollbarPosition: 'outside',
      });
      return !this.togglechart;

    } else {
      return true;
    }
  }
  onOrderUpdate(orders) {
    if (this.orderBookLoading) {
      return;
    }
    if (this.mainPair.rate === undefined) {
      return;
    }
    // SocketJob.
    this.updateOrders(this.sellOrders, orders[0], true, this.mainPair.marketPrecision);
    this.updateOrders(this.buyOrders, orders[1], true, this.mainPair.marketPrecision);
    this.buyordersSorted();
    this.sellordersSorted();
    this.updatelengthofOrderbook();
    this.calculateTotal();
  }
  onTickerUpdates(ticker) {
    this.updateTickerData(ticker, true);
  }
  reInitOrderBookd() {
    this.historyOrders = [];
    this.groupedBuy = [];
    this.groupedSell = [];
    this.updateOrderBook(this.mainPair, OrderStatus.Active);
    this.updateOrderBook(this.mainPair, OrderStatus.Completed);
  }
  connectToSocket(pair: Pair) {
    if (this.socketstatus) {
      // this.reInitOrderBookd();
      SocketJob.joinPairChannel(this.mainPair);
      return;
    }
    SocketJob.init(this, this.mainPair, orders => {
    },
      ticker => {
      }, false);
  }
  // isTablet && toggleChart
  changePair(pair: Pair, connectToSocket?) {
    // if(this.prevPair === 0){
    //   this.prevPair.push(pair.id);
    // } else {
    this.prevPair.unshift(pair.id);
    // }
    if (this.prevPair.length >= 3) {
      this.prevPair.length = 2;
    }
    this.mainPair = pair;
    if (pair.Status === 0) {
      this.router.navigate(['/error/pagenotfound']);
    }
    if (connectToSocket === undefined) {
      this.connectToSocket(this.mainPair);
    }
    if (this.mainPair.rate === undefined) {
      setTimeout(() => {
        this.changePair(pair, false);
      });
      return;
    }
    this.reInitOrderBookd();
    // if (!this.socketstatus || (this.buyOrders.length === 0 || this.sellOrders.length === 0)) {

    // }
    // tslint:disable-next-line: no-use-before-declare
    this.setRateGroup(pair);
    this.reSetBuySellWigets(pair);
    this.favStatus = {};
    this.favStatus[pair.id] = true;
    this.orderBookLoading = true;
    sessionStorage.setItem('selectedPair', (pair.name).replace('/', '-'));
    if (this.child) {
      this.child.mainPair = pair;
    } // change header pair on pairchange
    // if (this.mainPair.rate !== undefined) {
    const tickerRate = this.mainPair.rate;
    this.title.setTitle(tickerRate.toFixedFloor(this.mainPair.basePrecision) + ' | ' + this.mainPair.name + ' | Buy & Sell ' +
      this.mainPair.marketCurrency.name + ' | DECOIN Exchange');
    // } else {
    //   this.title.setTitle(' Buy & Sell ' + this.mainPair.marketCurrency.name + ' | DECOIN Exchange');
    // }
    this.changeHeaderSelected.next(pair);
    this.mymodel = true;
    setTimeout(() => {
      this.mymodel = false;
      this.size.mainpairmenuBtnWidth = $('.mainpairmenu-btn').width();
    }, 250);

    if (window.location.search === '') {
      this.location.replaceState(pair.name.replace('/', '-'));
    } else {
      this.location.replaceState(pair.name.replace('/', '-') + window.location.search);
    }
    // if (!this.isLogin) {
    //   Storage.set('returnurl', '/' + pair.name.replace('/', '-'));
    // }
    this.ratePrecision = this.mainPair.basePrecision;
    if (this.chartFirstLoaded === true) {
      this.initializeTradingView(pair);
    } else {
      TradingView.onready(() => {
        this.initializeTradingView(pair);
      });
      setTimeout(() => {
        if (this.chartFirstLoaded === false) {
          this.initializeTradingView(pair);
        }
      }, 1000);
    }
    this.buyOrders = [];
    this.sellOrders = [];
    this.historyOrders = [];
    // this.updateOrderBook(pair, OrderStatus.Active);
    // this.updateOrderBook(pair, OrderStatus.Completed);

    if (this.isLogin) {
      this.updateWallets(pair);
    }
    return false;
  }
  updateOrders(orders: Order[], newOrders, short: boolean = false, marketPrecision: number) {
    newOrders.forEach(order => {
      order[1] = Number(order[1]);
      order[0] = Number(order[0]);
      let index = -1;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].rate === order[1]) {
          index = i;
          break;
        }
      }
      const pow = Math.pow(10, marketPrecision);
      if (index >= 0) {
        if ((Math.floor(order[0] * pow) / pow) <= 0) {
          orders.splice(index, 1);
        } else {
          orders[index].quantity = order[0];
        }
      } else if ((Math.floor(order[0] * pow) / pow) > 0) {
        const _order = new Order();
        _order.rate = order[1];
        _order.quantity = order[0];
        // orders from socket babar
        if (_order.quantity !== 0) {
          orders.push(_order);
        }
        // orders.push(_order);
      }
      //  const index = orders.in
    });
    this.buyordersSorted();
    this.sellordersSorted();
    this.sortOrders(orders);
  }
  sortOrders(orders: Order[]): void {
    // if (!this.isMobile) {
    if (orders.length > 0) {
      if (orders[0].type === OrderType.Sell) {
        orders = orders.sort((a, b): number => {
          return a.rate - b.rate;
        });
      } else {
        orders = orders.sort((a, b): number => {
          return b.rate - a.rate;
        });
      }
    }
  }

  leveragePairHide() {
    this.isLeveragePairShow = false;
    Storage.set('leveragePairShow', false);
  }

  ngAfterViewInit() {

    // this.openOrderDragModal();

    const intv12 = setInterval(() => {
      this.checkMarketLength();
      if (this.checkMarketLength() === false) {
        clearInterval(intv12);
      }
    }, 50);
    setTimeout(() => {
      if ((this.isTablet || this.isMobile) && this.pcounter === 0) {
        this.mobileOrderBookHeight = $('.mobileOrderBookHeight').height();
      }
      // if (this.isTablet) {
      //   this.tabUnwrap();
      // }
    }, 500);



    this.righttab = $('.tradePanel-right').width();
    this.size.update();
    $('.height1').height($(window).height() - $('header').height());
    $('.scrollPanel').mCustomScrollbar({ theme: 'minimal', scrollInertia: 1 });

    this.resetStructure();
    $(window).on('resize', () => {

      if ($(window).width() < 768) {
        this.isMobile = true;
        // this.MktMobileTab('Market');
      } else {
        this.isMobile = false;
        this.orderType13 = ['Buy', 'Sell'];
      }

      if ($(window).width() < 1200) {
        this.isTablet = true;
      } else {
        this.isTablet = false;
      }

      this.resetStructure();

    });

    if (!this.isTablet) {
      this.pcounter = 0;
      $(window).on('resize', () => {
        if (this.isMobile) {
          return;
        }
        this.totalOrderToshow();
      });

      this.totalOrderToshow();
    }
    const disableAnimations = true;
    const overlayContainerElement: HTMLElement = this.overlayContainer.getContainerElement();
    this.renderer.setProperty(overlayContainerElement, '@.disabled', disableAnimations);
  }
  // tabUnwrap() {
  //   if (document.querySelector('.tradePanel-left') === null || document.querySelector('.tradePanel-right') === null) {
  //     setTimeout(() => {
  //       this.tabUnwrap();
  //     }, 50);
  //     return;
  //   }
  //   this.unWrap(document.querySelector('.tradePanel-left'));
  //   this.unWrap(document.querySelector('.tradePanel-right'));
  // }
  ngOnDestroy() {
    this.subscriptions.forEach(function (value) {
      value.unsubscribe();
    });
    SocketJob.destroy();
    if (this.tvWidget != null) {
      try {
        this.tvWidget.remove();
      } catch (err) { }
    }
    this.renderer.removeClass(document.getElementsByTagName('html')[0], 'trade-html');
    const intv = window.setInterval(() => { }, 9999);
    for (let i = 0; i <= intv; i++) {
      if (i !== window['loginChecker']) {
        clearInterval(i);
      }
    }
  }



  resetStructure() {

    if (this.isTablet) {
      if (document.getElementsByClassName('tradePanel-left').length) {
        this.unWrap(document.querySelector('.tradePanel-left'));
        this.unWrap(document.querySelector('.tradePanel-right'));
      }
    } else {
      const pleft = document.createElement('div');
      const pright = document.createElement('div');
      if (!document.getElementsByClassName('tradePanel-left').length) {
        this.wrapAll(document.querySelectorAll('.mkt-info-wrap,.tab325,.favpair-chart, app-user-orders'), pleft, 'tradePanel-left');
        this.wrapAll(document.querySelectorAll('.orderbook-row,.orderbook-row + .buySell-panel'), pright, 'tradePanel-right');
      }
    }
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
    // const d = Math.pow(10, decimals + 1);
    // tslint:disable-next-line: radix
    return Number(figure).toFixedFloor(decimals);
    // return ((Number((figure * d).toString()) / d).toFixed(decimals));
    // return this.toFloor((Number((figure * d).toString()) / d), decimals);
  }
  // toFloor(number: any, precision) {
  //   const pow = Math.pow(10, precision);
  //   return Math.floor(number * pow) / pow;
  // }
  decimal_format_fix(number, decimals = 8) {
    number = Number(number);
    if (number !== undefined && number !== '') {
      const str = number.toFixed(2);
      return str;
    }
  }
  countHeight() {
    return $('.subpanel-right').height() + this.deductHeight;
  }
  orderBookTypeSwitch(type: number) {
    if (this.orderBookType === 1) {
      this.totalOrderBookOrdersToShow = this.isTablet ? 9 : this.orderToBeShown;
      this.orderBookType = 0;
      return;
    } else if (this.orderBookType === 2) {
      this.totalOrderBookOrdersToShow = this.isTablet ? 9 : this.orderToBeShown;
      this.orderBookType = 0;
      return;
    } else {
      this.orderBookType = type;
      if (this.isTablet) {
        this.updatelengthofOrderbook();
      }
    }
    this.totalOrderToshow();
  }
  totalOrderToshow() {

    setTimeout(() => {

      const orderTblTrHeight = $('.orderbook-tbl13 table tbody tr').outerHeight(true);
      const subPanelTopOffset = $(document).height() -
        ($('.tradePanel-bottom').outerHeight(true) + $('.subpanel.buySell-panel').outerHeight());
      let totalOrderToShow = ((subPanelTopOffset
        - ($('table.table1.orderbook-tbl13>thead>tr').offset().top + $('table.table1.orderbook-tbl13>thead>tr').outerHeight(true) +
          $('.orderbook-tbl13 table .tr-prate').outerHeight(true))
      ) / orderTblTrHeight) / 2;
      if (this.pcounter === 0) {
        this.changeInTotalOrder = (((Math.round(totalOrderToShow) - totalOrderToShow)) * 2) * orderTblTrHeight;
        this.deductHeight = (this.size.height - this.size.headerHeight - this.size.buySellHeight - this.size.thSubPanlHeaderHeight
          - this.size.thTabletheadHeight - (27));
        this.pcounter++;

      }
      totalOrderToShow = Math.round(totalOrderToShow);
      if (this.orderBookType === 0) {
        this.totalOrderBookOrdersToShow = totalOrderToShow;
        this.orderToBeShown = totalOrderToShow;
      }
      this.updatelengthofOrderbook();
      setTimeout(() => {
        $('.orderbook_scrollbar').mCustomScrollbar({
          theme: 'minimal', // 'dark-3',
          alwaysShowScrollbar: 0,
          scrollbarPosition: 'outside',
          mouseWheel: {
            scrollAmount: 60,
            normalizeDelta: true
          }
        });
        $('#sellscroll').mCustomScrollbar(
          {
            theme: 'minimal', // 'dark-3',
            alwaysShowScrollbar: 0,
            scrollbarPosition: 'outside',
            mouseWheel: {
              scrollAmount: 60,
              normalizeDelta: true
            }
          });
        this.scrollToBottom();
      }, (this.isMobile ? 100 : 100));
    }, (this.pcounter === 0 ? 900 : 100));
  }
  updatelengthofOrderbook() {
    if (this.isTablet) {
      if (this.orderBookType === 1) {
        this.totalOrderBookOrdersToShow = ((18 > this.buyOrders.length) ?
          (18) : this.buyOrders.length);
      }
      if (this.orderBookType === 2) {
        this.totalOrderBookOrdersToShow = (18 > this.sellOrders.length) ?
          (18) : this.sellOrders.length;
      }
      return;
    } else {
      if (this.orderBookType === 1) {
        this.totalOrderBookOrdersToShow = ((this.orderToBeShown * 4 > this.buyOrders.length) ?
          (this.orderToBeShown * 4) : this.buyOrders.length);
      }
      if (this.orderBookType === 2) {
        this.totalOrderBookOrdersToShow = (this.orderToBeShown * 4 > this.sellOrders.length) ?
          (this.orderToBeShown * 4) : this.sellOrders.length;
      }
    }
  }
  scrollToBottom() {
    if (this.orderBookType === 2) {
      $('#sellscroll').mCustomScrollbar(
        'scrollTo', 'bottom', {
        scrollInertia: 0
      });
    }
  }
  pickRate(rate, resetOrderBook?) {

    if (resetOrderBook) {
      this.orderBookTypeSwitch(0);
    }
    this.orderType12.forEach(type => {
      this.LimitOrderChild.model[type].Rate = (rate).toFixedFloor(this.mainPair.basePrecision);
      this.LimitOrderChild.model[type].Quantity = null;
      this.StopOrderChild.model[type].Rate = (rate).toFixedFloor(this.mainPair.basePrecision);
      this.StopOrderChild.model[type].Stop = (rate).toFixedFloor(this.mainPair.basePrecision);
      this.StopOrderChild.model[type].Quantity = null;
      this.LimitOrderChild.scaleX[this.LimitOrderChild.orderType.indexOf(type)] = ((1 / 100) * 100) / 100;
      this.CocoOrderChild.model[type].Rate = (rate).toFixedFloor(this.mainPair.basePrecision);
      this.CocoOrderChild.model[type].LimitPrice = (rate).toFixedFloor(this.mainPair.basePrecision);
      this.CocoOrderChild.model[type].Stop = (rate).toFixedFloor(this.mainPair.basePrecision);
      this.CocoOrderChild.model[type].Quantity = null;
    });
    this.LimitOrderChild.sellqt = null;
    this.LimitOrderChild.buyqt = null;
  }
  pickOrder(order: Order, type: number, pick?) {
    this.LimitOrderChild.pickOrder(order, type);
    this.StopOrderChild.pickOrder(order, type);
    this.CocoOrderChild.pickOrder(order, type);
  }
  activeOrders() {
    if (this.userOrderChild === undefined) {
      return [];
    }
    const activeOrders = this.userOrderChild.activeOrders();
    this.activeOrderLength = activeOrders.length;
    return activeOrders;
  }

  calculateFillStats(myOrder, index = 11) {
    let total = 0;
    let price = 0;
    if (myOrder[index]) {
      myOrder[index].forEach(fill => {
        total += fill[1] * fill[2];
        price += (fill[2] / myOrder[7]) * fill[1];
      });
    }
    return {
      p: price,
      t: total
    };
  }
  getTimeZone(): string {
    let clientTime = 0;
    const utcTime = this.stdTimezoneOffset() / 60 * -1;

    const hr = Math.floor(utcTime);
    const min = Math.round(utcTime % 1 * 100);
    if (min > 0) {
      clientTime = hr + (min / 100 * 60);
    } else {
      clientTime = hr;
    }
    const symbol = 'UTC';
    // for (const key in symbolology) {
    //   if (key === clientTime.toString()) {
    //     symbol = symbolology[key];
    //     return symbol;
    //   }
    // }
    return this.getTimeZones(clientTime);
    // return symbol;
  }
  stdTimezoneOffset() {
    return new Date(new Date().getFullYear(), 6, 1).getTimezoneOffset();
    // return new Date().getTimezoneOffset();
  }

  isDstObserverd(): boolean {
    const jan = new Date(new Date().getFullYear(), 0, 1);
    const jul = new Date(new Date().getFullYear(), 6, 1);
    const max = Math.max(jan.getTimezoneOffset() * -1, jul.getTimezoneOffset() * -1);
    const isDst = new Date().getTimezoneOffset() * -1 < max;
    return isDst;
  }

  getTimeZones(zone): string {
    const isDst = this.isDstObserverd();
    let symbol = 'UTC';
    const selectedzones = ChartConfiguration.timezones.filter(x => x.offset === zone && x.isdst === isDst).map(m => m.utc);
    selectedzones.forEach(x => {
      x.forEach(y => { this.userRelatedTimeZone.push(y); });
    });
    this.userRelatedTimeZone.forEach(u => {
      tvtimezones.forEach(t => {
        if (t === u) {
          symbol = t;
        }
      });
    });
    return symbol;
  }
}
