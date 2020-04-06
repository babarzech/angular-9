import { Component, OnInit, Host, EventEmitter, Output, Renderer2, ViewChild, AfterViewInit, Input } from '@angular/core';
import { ApiCall } from '../helpers/apicall';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Pair, Pairs, SelectedPairs } from '../models/market';
import { Size } from '../helpers/responsive';
import { FavPair } from '../models/favpair';
import { pairs } from 'rxjs/observable/pairs';
import { ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { Storage } from '../helpers/storage';
import { Redirect } from '../helpers/redirect';
import { Location } from '@angular/common';
import { App } from '../models/app';
import { Loader } from '../helpers/loader';
import { AppSettings } from '../config/config';
import { LanguageManager } from '../helpers/languageservice';
import { NotificationHelper } from '../helpers/notificationhelper';
import { CommonJs } from '../helpers/commonfunctions';

declare var $;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public basehref: string;
  // public isMobile: boolean;
  public menuShow: boolean;
  public subMenuShow = false;
  public submenuExpStatus = {};
  public apiCall: ApiCall;
  public tradingPairs: Pair[] = [];
  private httpClient: HttpClient;
  public selectedPairs: Pair[] = [];
  public size = Size;
  public Object = Object;
  public searchParam: string;
  public mainPair: Pair;
  public market_val: string;
  public pairtblCol = 1;
  public toggle = true;
  public checkpair;
  public myPairs = Pairs;
  public myfavpairs;
  public showfavpairs = false;
  public favicon1 = 'assets/images/star1.svg';
  public favicon2 = 'assets/images/star2.svg';
  @Output() sideBarToggle = new EventEmitter<string>();
  @Output() changePairEvent = new EventEmitter<Pair>();
  @Output() changefavpair = new EventEmitter<Pair>();
  @Input() isLogin = true;
  @Input() favpairStatus;
  public activeStatus = {};
  public MktTabStatus = {};
  // public markets = ['BTC', 'USDT'];
  // public markets = ['All','Favorites','Leverage', 'BTC', 'USDT'];
  public markets = ['All','Favorites', 'BTC', 'USDT'];
  public pairSort = { sortAsc: true, property: '' };
  public pairSortCol = {
    name: { asc: false, desc: false },
    rate: { asc: false, desc: false },
    change: { asc: false, desc: false },
    volume: { asc: false, desc: false }
  };
  @Input() favPairsId = [];
  @Input() tversion2;
  @Input() isMobile;
  @Input() isLeveragePairShow;
  public skipExecution = false;
  public favPairOnly = false;
  public menuOpen = false;
  public pairSearchStatus = false;
  public pairMenuStatus = false;
  public allPair;
  public timeNow: Date = new Date();
  public languages: any;
  public CurrentLanguage: any;
  public backupSymbol: string;
  public tooltip: string;
  public showLeveragePair = false;
  @ViewChild(MatMenuTrigger,{static:true}) trigger: MatMenuTrigger;


  constructor(private routing: ActivatedRoute, http: HttpClient, public router: Router,
    private renderer: Renderer2) {
    this.basehref = 'https://' + window.location.hostname;
    if (this.isMobile === undefined) {
      this.isMobile = false;
      if ($(window).width() < 992) {
        this.isMobile = true;
      }
    }
    $(window).on('resize', () => {

      if ($(window).width() < 992) {
        this.isMobile = true;
        // this.MktMobileTab('Market');
      } else {
        this.isMobile = false;
      }

    });
    this.tooltip = NotificationHelper.getMessageTranslation('SelectMarket');
    this.httpClient = http;
    this.tradingPairs = [];
    this.apiCall = new ApiCall(http, router);

    FavPair.init(http, router);
    this.menuShow = false;
    setInterval(() => {
      this.timeNow = new Date();
    }, 1);
    this.allPair = true;
    this.mktClick('All');
  }

  pairsInit() {
    // Pairs.init(this.httpClient, () => {
    this.selectedPairs = [];
    this.tradingPairs = Pairs.getPairs();
    if (this.routing.snapshot.params.pair) {
      const PairName = this.routing.snapshot.params.pair.replace('-', '/');
      const _Pair = Pairs.getPairByName(PairName);
      SelectedPairs.init();
      SelectedPairs.addPair(_Pair);
      this.selectedPairs = SelectedPairs.getPairs();
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
    //      this.httpClient.get(AppSettings.apiEndpoint + 'market/get-ticker').subscribe(data => {
    //        const data1 = JSON.parse(JSON.stringify(data));
    // Loader.hide();
    // this.updateTickerData(data);
    //      });
    // this.tradingPairs = [];
    // const pair = new Pair();
    // pair.name = 'BTC/ETH';
    // this.tradingPairs.push( pair );
    // });

  }
  filterFav(favpair: Pair) {

    const activeTab = Object.keys(this.activeStatus)[0];
    if (activeTab === 'Favorites') {
      if (this.favPairsId.indexOf(favpair.id) > -1) {
        return favpair.marketCurrency.symbol.toLowerCase().indexOf(this.market_val) > -1;
      } else {
        return false;
      }
    } else if (activeTab === 'Leverage') {
      if (favpair.leveragePair) {
        return true;
      } else {
        return false;
      }
    } else if (activeTab === 'All') {
      return favpair.marketCurrency.symbol.toLowerCase().indexOf(this.market_val) > -1;
    } else if (activeTab === 'BTC' ||
      activeTab === 'USDT') {
      if (favpair.baseCurrency.symbol.toLowerCase().indexOf(activeTab.toLowerCase()) > -1) {
        return (CommonJs.isNotEmpty(this.market_val) ?
          (favpair.marketCurrency.symbol.toLowerCase().indexOf(this.market_val.toLowerCase()) > -1) : true);
      } else {
        return false;
      }
      // return favpair.marketCurrency.symbol.toLowerCase().indexOf(this.backupSymbol) > -1;
    }
  }
  // filterFav(favpair: Pair) {
  //   if (this.showLeveragePair) {
  //     if (favpair.name.indexOf('_') > -1) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  //   if (this.showfavpairs) {
  //     return (this.favPairsId.indexOf(favpair.id) > -1);
  //   } else {
  //     if (this.market_val === undefined || this.market_val === null) {
  //       return true;
  //     } else {
  //       if (Object.keys(this.activeStatus)[0]) {
  //         if (favpair.baseCurrency.symbol.toLowerCase().includes(Object.keys(this.activeStatus)[0].toLowerCase())) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       } else {
  //         if (favpair.baseCurrency.symbol.toLowerCase().includes(this.market_val.toLowerCase()) ||
  //           favpair.marketCurrency.symbol.toLowerCase().includes(this.market_val.toLowerCase())) {
  //           return true;
  //         } else {
  //           return false;
  //         }
  //       }

  //     }

  //   }
  // }
  decimal_format(number, decimals = 8) {
    number = Number(number);
    if (number !== undefined && number !== '') {
      const str = number.toFixed(decimals);
      return str;
    }
  }
  changePair(pair: Pair) {

    // SelectedPairs.addPair(pair);
    this.selectedPairs = SelectedPairs.getPairs();
    this.changePairEvent.next(pair);
    this.mainPair = pair;

    if (this.isMobile) {
      this.selectedPairs = this.selectedPairs.filter((pair1) => {
        return pair1.name === this.mainPair.name;
      });
    }
  }

  removeActive(pair: Pair) {
    SelectedPairs.removePair(pair);
    this.selectedPairs = SelectedPairs.getPairs();
  }
  pairMenuOpen() {

    this.pairMenuStatus = true;

    document.getElementsByClassName('pair_menu1')[0].parentElement.classList.add('pairmenu-overlay-pane');

    $('.pair_menu1 .table1 tbody').mCustomScrollbar({
      theme: 'minimal',
      alwaysShowScrollbar: 0,
    });

    if (this.isMobile) {
      this.renderer.addClass(document.getElementsByTagName('html')[0], 'oflow-h');
    }
  }
  pairMenuClose() {
    document.getElementsByClassName('pair_menu1')[0].parentElement.classList.remove('pairmenu-overlay-pane');
    if (this.isMobile) {
      this.renderer.removeClass(document.getElementsByTagName('html')[0], 'oflow-h');
    }
    this.pairMenuStatus = false;
    this.pairSearchStatus = false;
  }
  toggleSideBar() {
    this.sideBarToggle.next('toggle');
  }
  menuToggle() {
    (this.menuOpen === true ? this.menuOpen = false : this.menuOpen = true);
  }
  pairMenuToggle() {
    this.trigger.openMenu();
  }
  showMenu() {
    this.menuShow = true;
  }
  hideMenu() {
    this.menuShow = false;
    this.subMenuShow = false;
  }
  toggleSubmenu(event) {
    event.preventDefault();
    this.subMenuShow = !this.subMenuShow;
  }

  submenuExpand(num) {
    (this.submenuExpStatus[num] === true ? this.submenuExpStatus[num] = false : this.submenuExpStatus[num] = true);
  }

  ngOnInit() {
    // this.sortPairTable('name', 'str', null);
    // this.mainPair = this.changeHeader;
    const intervaltest = setInterval(() => {
      if (this.tradingPairs.length > 0) {
        this.sortPairTable('name', 'str', null);
        clearInterval(intervaltest);
      }
    });
    if (!Storage.exists('activelang')) {
      App.getLanguages(this.httpClient, (lang) => {
        this.languages = lang;
      });
    } else {
      this.languages = JSON.parse(Storage.get('activelang'));
    }

    this.CurrentLanguage = LanguageManager.getCLangSym();
    this.basehref = this.basehref + '/' + this.CurrentLanguage + '/';
  }

  ngAfterViewInit() {
    // this.sortPairTable('name', 'str', null);
    // this.sortPairTable('change', 'percnt', null);
    // this.sortPairTable('name', 'str', null);
    // sort_by_name
    // document.getElementById('#sort_by_name').click();
  }
  logout() {
    this.apiCall.authenticate = true;
    this.apiCall.method = 'POST';
    this.apiCall.body = { 'logout': 'true' };
    this.apiCall.endPoint = 'account/logout';
    this.apiCall.send(
      success => {
        User.logout();
        this.router.navigate(['/login']);
      },
      error => {
      }
    );
  }
  hideMobileMenu() {
    if (this.menuOpen === true) {
      this.menuOpen = false;
    }
  }
  pairToSearch() {
    this.backupSymbol = this.market_val;
  }
  pairSearchToggle(event) {
    this.pairSearchStatus = !this.pairSearchStatus;
    if (this.pairSearchStatus) {
      this.backupSymbol = this.market_val;
      if (Object.keys(this.activeStatus).length > 0) {
        this.market_val = '';
      }
      // this.activeStatus = '';

      //   // this.backupSymbol = this.market_val;
      //   this.market_val = '';

      // } else {
      //   this.mktClick(this.backupSymbol);

      // }
    }


    event.stopPropagation();
  }
  // pairSearchToggle(event) {
  //   this.pairSearchStatus = !this.pairSearchStatus;
  //   if (this.pairSearchStatus) {
  //     this.backupSymbol = this.market_val;
  //     this.market_val = '';
  //     this.activeStatus = '';
  //   } else {
  //     this.mktClick(this.backupSymbol);

  //   }


  //   event.stopPropagation();
  // }

  sortPairTable(property: string, type: string, e) {
    console.log('pair sort colume');
    if (e !== null) {
      e.stopPropagation();
    }
    const favSort = [];
    if (property === 'fav') {
      for (let i = this.tradingPairs.length - 1; i >= 0; i--) {
        if (this.tradingPairs[i]) {
          if (this.favPairsId.indexOf(this.tradingPairs[i].id) > -1) {
            favSort.push(this.tradingPairs[i]);
          }
        }
      }
      favSort.sort(function (a, b) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
      const otherfav = [];
      for (let i = this.tradingPairs.length - 1; i >= 0; i--) {
        if (this.tradingPairs[i]) {
          if (!(this.favPairsId.indexOf(this.tradingPairs[i].id) > -1)) {
            otherfav.push(this.tradingPairs[i]);
          }
        }
      }
      otherfav.sort(function (a, b) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
      this.tradingPairs = favSort.concat(otherfav);
      return;
    }
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
    this.tradingPairs.forEach((pair: Pair) => {
      if (pair.Status === 0) {
        this.tradingPairs.splice(this.tradingPairs.indexOf(pair), 1);
      }
    });
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

  isNotEmpty(value): boolean {
    return value !== undefined && value !== 0;
  }
  // mktClick1(market) {
  //   if (market === 'leverage') {
  //     this.allPair = false;
  //     this.showfavpairs = false;
  //     this.showLeveragePair = true;
  //     this.activeStatus = {};
  //     this.market_val = '';
  //   } else {
  //     this.allPair = false;
  //     this.showfavpairs = true;
  //     this.showLeveragePair = false;
  //     this.activeStatus = {};
  //     this.market_val = '';
  //   }

  // }
  mktClick(market: string) {
    this.backupSymbol = (market === 'BTC' || market === 'USDT') ? market : '';
    // this.showLeveragePair = false;
    // this.showfavpairs = false;
    // if (market === '') {
    //   this.allPair = true;
    //   this.activeStatus = {};
    //   this.market_val = '';
    // } else {
    //   this.allPair = false;
    // }
    // if (this.activeStatus[market] === true) {
    //   // this.activeStatus = {};
    //   // this.market_val = undefined;
    // } else {
    this.activeStatus = {};
    this.activeStatus[market] = true;
    if (this.markets.indexOf(market) === 3 || this.markets.indexOf(market) === 3) {
      // this.market_val = market;
    } else {
      this.market_val = '';
    }


    // }
    $('.pair_menu1 .table1 tbody').mCustomScrollbar('update');
  }
  // mktClick(market: string) {
  //   this.showLeveragePair = false;
  //   this.showfavpairs = false;
  //   if (market === '') {
  //     this.allPair = true;
  //     this.activeStatus = {};
  //     this.market_val = '';
  //   } else {
  //     this.allPair = false;
  //   }
  //   if (this.activeStatus[market] === true) {
  //     // this.activeStatus = {};
  //     // this.market_val = undefined;
  //   } else {
  //     this.activeStatus = {};
  //     this.activeStatus[market] = true;
  //     this.market_val = market;
  //   }
  //   $('.pair_menu1 .table1 tbody').mCustomScrollbar('update');
  // }

  public tradingPairsFilter() {
    if (this.favPairOnly) {
      return this.tradingPairs.filter(x => this.favPairsId.indexOf(x.id) > -1);
    } else {
      return this.tradingPairs;
    }
  }
  convert_to_24h(time_str) {
    // Convert a string like 10:05:23 PM to 24h format, returns like [22,5,23]
    return CommonJs.convert_to_24h(time_str);
    // const time = time_str.match(/(\d+):(\d+):(\d+) (\w)/);
    // let hours = Number(time[1]);
    // const minutes = Number(time[2]);
    // const seconds = Number(time[3]);
    // const meridian = time[4].toLowerCase();
    // if (meridian === 'p' && hours < 12) {
    //   hours += 12;
    // } else if (meridian === 'a' && hours === 12) {
    //   hours -= 12;
    // }
    // return '\xa0\xa0' + hours + ':' + (minutes.toString().length < 2 ? '0' + minutes : minutes)
    //   + ':' + (seconds.toString().length < 2 ? '0' + seconds : seconds);
  }
  public switchFav(event, pair: Pair, img) {
    if (this.favPairsId.indexOf(pair.id) > -1) {
      this.favPairsId.splice(this.favPairsId.indexOf(pair.id), 1);
      this.changefavpair.next(pair);
    } else {
      this.favPairsId.push(pair.id);
      this.changefavpair.next(pair);
    }
    Storage.set('favorites', JSON.stringify(this.favPairsId));
    if (!this.isLogin) {
      return;
    }
    FavPair.updateFavPair(pair, status => {
      if (!status) {
        if (this.favPairsId.indexOf(pair.id) < 0) {
          this.favPairsId.splice(this.favPairsId.indexOf(pair.id), 1);
          // img.src = this.favicon1;
          // this.changefavpair.next(pair);
        } else {
          // img.src = this.favicon2;
          this.favPairsId.push(pair.id);
          // this.changefavpair.next(pair);
        }
      }
    });
    event.stopPropagation();
    // if (!$(event.target).hasClass('fav_act')) {
    //   this.favPairsId.push(pair.id);
    // } else {
    //   const ind = this.favPairsId.indexOf(pair.id);
    //   if (ind > -1) {
    //     this.favPairsId.splice(ind, 1);
    //   }
    // }
    // $(event.target).toggleClass('fav_act');
    // FavPair.updateFavPair(pair, status => {
    //   if (!status) {
    //     $(event.target).toggleClass('fav_act');
    //     if ($(event.target).hasClass('fav_act')) {
    //       this.favPairsId.push(pair.id);
    //     } else {
    //       const ind = this.favPairsId.indexOf(pair.id);
    //       if (ind > -1) {
    //         this.favPairsId.splice(ind, 1);
    //       }
    //     }
    //   }
    // });
  }
  signupReturnUrl() {
    if (this.mainPair === undefined) {
      if (Redirect.getReturnUrl() === 'buy-sell-crypto/') {
        return Redirect.getReturnUrl();
      }

    }
    return '';
  }
  activePair() {
    // return Redirect.getReturnUrl();
    if (this.mainPair === undefined) {
      return Redirect.getReturnUrl();
    }
    return this.mainPair.name.replace('/', '-');
  }
  selectPair() {
    return sessionStorage.getItem('selectedPair') === null ? 'BTC-USDT' : sessionStorage.getItem('selectedPair');
  }
  changeHeader(dta) {
  }
  favPairRestrictionToggle(event) {
    $(event.target).toggleClass('active');
    this.favPairOnly = !this.favPairOnly;
  }
  changeLanguage(lang) {
    if (this.CurrentLanguage.toLowerCase() === lang.toLowerCase()) {
      return;
    }
    App.getTranslation(this.httpClient, lang, true, () => {
      Loader.show();
      if (location.href.includes('#')) {
        const tempUrl = location.href.split('#')[0];
        const _spliturl = tempUrl.split('/');
        this.CurrentLanguage = _spliturl[3] = lang;
        const _newurl = _spliturl.join('/');
        window.history.replaceState('', '', _newurl);
        window.location.href = window.location.href;
      } else {
        const spliturl = location.href.split('/');
        this.CurrentLanguage = spliturl[3] = lang;
        const newurl = spliturl.join('/');
        window.history.replaceState('', '', newurl);
        window.location.href = window.location.href;
      }
    });
  }

}
