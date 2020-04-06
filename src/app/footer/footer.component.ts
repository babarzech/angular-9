import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../models/userlogin';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '../helpers/storage';
import { AppSettings } from '../config/config';
import { App } from '../models/app';
import { Loader } from '../helpers/loader';
import { LanguageManager } from '../helpers/languageservice';
import { CommonJs } from '../helpers/commonfunctions';

declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public langCode: any;
  public langList: any;

  private httpClient: HttpClient;
  public currentyear: Number = new Date().getFullYear();
  public isMobile: Boolean;
  public panelExpandStatus = [];
  public isUserLogin = true; // : boolean; its always true since we don't show footer on any non login page.
  public showsearchinput: boolean;

  constructor(http: HttpClient, router: Router) {
    // UserLogin.init(http, router);
    // if (UserLogin.Filter()) {
    //   this.isUserLogin = true;
    // }else {
    //   this.isUserLogin = false;
    // }
    this.httpClient = http;
    this.isMobile = false;
    if ($(window).width() < 767) {
      this.isMobile = true;
    } else {
      this.panelExpandStatus[1] = true;
      this.panelExpandStatus[3] = true;
    }
  }
  panelToggle(index) {
    if (this.isMobile) {
      if (this.panelExpandStatus[index] === true) {
        this.panelExpandStatus[index] = false;
      } else {
        this.panelExpandStatus[index] = true;
      }
    }
  }
  ngOnInit() {
    if (!Storage.exists('activelang')) {
      App.getLanguages(this.httpClient, (lang) => {
        this.langList = lang;
      });
    } else {
      this.langList = JSON.parse(Storage.get('activelang'));
    }

    this.langCode = LanguageManager.getCLangSym();

  }

  selectLanguage(event, langItem) {
    event.preventDefault();
    this.langCode = langItem.code;
  }
  usdtTotalVolume() {
    // new Date().;
    const volume = Number(CommonJs.decimal_format_fix(window['usdtTotal']));
    return CommonJs.formatNumberWithComma(volume);
  }
  dateNow() {
    const now = new Date().toLocaleString().split('/').join('-');

    return this.toJSONLocal(new Date()) + '' + CommonJs.convert_to_24h(now);
  }
  toJSONLocal(date) {
    const local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
  }
  changeLanguage(lang) {
    if (this.langCode.toLowerCase() === lang.toLowerCase()) {
      return;
    }
    App.getTranslation(this.httpClient, lang, true, () => {
      Loader.show();
      if (location.href.includes('#')) {
        const tempUrl = location.href.split('#')[0];
        const _spliturl = tempUrl.split('/');
        this.langCode = _spliturl[3] = lang;
        const _newurl = _spliturl.join('/');
        window.history.replaceState('', '', _newurl);
        window.location.href = window.location.href;
      } else {
        const spliturl = location.href.split('/');
        this.langCode = spliturl[3] = lang;
        const newurl = spliturl.join('/');
        window.history.replaceState('', '', newurl);
        window.location.href = window.location.href;
      }
    });
  }
}
