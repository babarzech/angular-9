import { Component, OnInit, AfterViewInit } from '@angular/core';
// import { Storage } from './helpers/storage';
// import { Http } from '@angular/common/http';
// import { ActivatedRoute } from '@angular/router';
// import { AppSettings } from './config/config';
import { App } from './models/app';
import { Info } from './helpers/info';
import { HttpClient } from '@angular/common/http';
import { Responsive, Size } from './helpers/responsive';

import { Storage } from './helpers/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { UserLogin } from './models/userlogin';
import { PlatformLocation } from '@angular/common';
import { LanguageManager } from './helpers/languageservice';
import { CommonJs } from './helpers/commonfunctions';
declare var $: any;
declare global {
  interface Number {
    toFixedFloor(length: number): string;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  public size = Size;
  public check: boolean;

  version: Number = 1.0;
  constructor(public active: ActivatedRoute, http: HttpClient, public route: Router, location: PlatformLocation) {
    this.check = false;
    document.documentElement.lang = LanguageManager.ReturnValidLang().toString();
    Number.prototype.toFixedFloor = function (fixed) {
      const re = this.toFixed(8).toString().match(new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?'));
      // if (this.toFixed(8).toString().match(re) !== null) {
      return (re === undefined || re === null) ? this : re[0];
      // }
    };
    // route.events.subscribe((val) => {
    // });
    UserLogin.init(http, route);
    if (window['loginChecker'] === undefined) {
      window['loginChecker'] = setInterval(() => {
        UserLogin.Filter(false);
      }, 60000);
    }
    const ref = this.getUrlParameter('ref');
    if (ref !== undefined && this.isNumber(ref)) {
      Storage.set('ref', ref);
    }
    const Utm_source = this.getUrlParameter('utm_source');
    const utm_campaign = this.getUrlParameter('utm_campaign');
    const utm_medium = this.getUrlParameter('utm_medium');
    if (Utm_source !== undefined || utm_campaign !== undefined || utm_medium !== undefined) {
      const campaign = JSON.stringify({
        'utm_source': (Utm_source !== undefined ? Utm_source : ''),
        'utm_campaign': (utm_campaign !== undefined ? utm_campaign : ''),
        'utm_medium': (utm_medium !== undefined ? utm_medium : '')
      });
      Storage.set('gcampaign', campaign);
    }
    const transaction_id = this.getUrlParameter('transaction_id');
    const offer_id = this.getUrlParameter('offer_id');
    const aff_id = this.getUrlParameter('aff_id');
    if (transaction_id !== undefined && offer_id !== undefined && aff_id !== undefined) {
      const aff_track = JSON.stringify({ 'transaction_id': transaction_id, 'offer_id': offer_id, 'aff_id': aff_id });
      Storage.set('aff_track', aff_track);
    }

    // const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    // const options = new RequestOptions({ headers: headers });
    // const params = new URLSearchParams();
    // params.append('test', 'pass');
    // htp.post(AppSettings.apiEndpoint + 'home/test', params, options).subscribe();

    // htp.post('http://localhost/api%20kreddos/apitester.php', {
    //   title: 'foo',
    //   body: 'bar',
    //   userId: 1
    // })
    //   .subscribe(
    //     res => {
    //     },
    //     err => {
    //     }
    //   );


    // const json = {var1: 'test'};
    // const params = 'json=alpha123';
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // htp.post('http://localhost/api%20kreddos/apitester.php', params, {headers} ).subscribe (re => {
    // });
    /*
    const params = new URLSearchParams();
    params.append('test', 'pass');
    const req = new RequestOptions();
    req.body = {'great': 'awesome'};
    req.headers = new Headers({ 'Content-Type': 'x-www-form-urlencoded' });
    req.params = params;
    req.method = 'POST';
    req.url = 'http://localhost/api%20kreddos/apitester.php';
    htp.post('http://localhost/api%20kreddos/apitester.php', JSON.stringify({'great': 'awesome'}), req).subscribe();
    // http.post('http://localhost/api%20kreddos/apitester.php', {'great': 'awesome'}, {
    //   headers: new HttpHeaders().append('Content-Type', 'x-www-form-urlencoded'),
    // }).subscribe();
    /*
    http.post('http://localhost/api%20kreddos/apitester.php', {'great': 'awesome'}, {
      body: {'great': 'awesome'},
      method: 'POST',
      headers: new Headers().append('Content-Type', 'application/json')
    }).subscribe();*/
    if (window.innerWidth >= 1500) {
      CommonJs.getTotalVolume(http);
    }
    Info.init(http, res => {
      const Version = res.Version;
      if (localStorage.getItem('server-version') === null) {
        localStorage.setItem('server-version', Version.toString());
      } else {
        if (Number(localStorage.getItem('server-version')) !== Version) {
          localStorage.removeItem('pair-data');
          localStorage.removeItem('styles-v2');
          localStorage.removeItem('defaultSetting');
          localStorage.removeItem('currencies-data');
          localStorage.removeItem('server-version');
          localStorage.removeItem('appLang');
          localStorage.removeItem('Clang');
          localStorage.removeItem('appLangBackUp');
          localStorage.removeItem('activelang');
          Storage.eraseCookie('language');
          localStorage.setItem('server-version', Version.toString());
          window.location.reload(true);
        }
      }
    });
    // init the translation
    if ((localStorage.getItem('appLang') === null || localStorage.getItem('Clang') === null)) {
      // get the current url lang symb
      const _uriSym = LanguageManager.getURISym();

      if (_uriSym !== null && _uriSym !== undefined && _uriSym !== '') {
        App.getTranslation(http, _uriSym, false, () => {
          this.check = true;
        });
      } else if (Storage.existsCookie('language')) {
        App.getTranslation(http, Storage.readCookie('language'), false, () => {
          this.check = true;
        });
        // this.check = true;
        // window.location.reload();
      } else {
        App.getTranslation(http, 'en', false, () => {
          this.check = true;
        });
      }
    } else {
      this.check = true;
    } 
    
    App.initialize(http);
    App.init();
    $('body').on('keydown', '.numberOnly', function (e) {
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode >= 35 && e.keyCode <= 40)) {
        return;
      }
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  }
  ngOnInit() {
    this.getTrackParams();
    $('body').on('click', 'a.smooth-scroll', function (event) {
      const tar = $(this).attr('href');
      event.preventDefault();
      $('html, body').animate({
        scrollTop: $(tar).offset().top
      }, 1000);
    });
  }
  ngAfterViewInit() {
    Responsive.init('dn-v2');
  }

  onPageChange() {
    Responsive.init('dn-v2');

    $(window).scrollTop(0);

    $('.mcScrollbar').mCustomScrollbar({
      theme: 'minimal', // 'dark-3',
      alwaysShowScrollbar: 0,
      scrollbarPosition: 'outside'
    });
  }
  getTrackParams() {
    let gparams = {};
    let gparamskeys = [];
    let ccampaign = false;
    const kcampagn = ['transaction_id', 'offer_id', 'aff_id', 'utm_source', 'utm_campaign', 'utm_medium'];
    this.active.queryParamMap.subscribe(params => {
      if (Object.keys(params['params']).length > 0) {
        gparamskeys = Object.keys(params['params']);
        gparams = params['params'];
        for (let i = 0; i < gparamskeys.length; i++) {
          if (kcampagn.indexOf(gparamskeys[i]) === -1) {
            ccampaign = true;
            break;
          }
        }
        if (ccampaign) {
          let old_track = [];
          if (localStorage.getItem('_track') != null) {
            old_track = JSON.parse(localStorage.getItem('_track'));
            for (let i = 0; i < gparamskeys.length; i++) {
              if (old_track[gparamskeys[i]] !== null) {
                old_track[gparamskeys[i]] = gparams[gparamskeys[i]];
              } else {
                old_track[gparamskeys[i]] = gparams[i];
              }
            }
            Storage.set('_track', JSON.stringify(old_track));
          } else {
            Storage.set('_track', JSON.stringify(gparams));
          }
        }
      } else {
        return;
      }
    });
    // gparamskeys = Object.keys(this.active.queryParams['_value']);
    // const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m: string, key: any, value: any) => {
    //   gparams[key] = value;
    //   gparamskeys.push(key);
    // });

  }
  getUrlParameter(sParam) {
    const sPageURL = window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    for (let i = 0; i < sURLVariables.length; i++) {
      const sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  isNumber(str) {
    const pattern = /^\d+$/;
    return pattern.test(str);
  }


}


