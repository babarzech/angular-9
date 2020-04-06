import { Injectable } from '@angular/core';
import { Storage } from '../helpers/storage';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { AppSettings } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Info } from '../helpers/info';
import { TranslationInit } from '../helpers/languageservice';

export class Signature {
  public key: string;
  public nonce: number;
}

@Injectable()
export class App {
  private static info = {};
  public static http: HttpClient;
  public static initialize(http: HttpClient, callback?: () => void) {
    this.http = http;
    if (!Storage.exists('appRun')) {
      this.http.post(AppSettings.apiEndpoint + 'home/initialize', { 'ft': true }).subscribe(res => {
        let Status = true;
        if (res['Error'] !== undefined) {
          Status = false;
        }
        if (!Status) {
          setTimeout(() => {
            App.initialize(http, callback);
          }, 1000);
          return;
        }
        App.save(JSON.stringify(res));
        Storage.set('appRun', 1);
        if (typeof callback === 'function') {
          callback();
        }
      });
    }
  }

  public static init() {
    this.info = JSON.parse(Storage.get('appCreds'));
  }
  public static reInit(callback?: () => void) {
    Storage.remove('appRun');
    Storage.remove('appCred');
    this.initialize(this.http, callback);
  }
  public static save(creds: string) {
    Storage.set('appCreds', creds);
    this.init();
  }
  public static getPrivateKey() {
    return this.info['PrivateKey'];
  }
  public static getPublicKey() {
    return this.info['PublicKey'];
  }
  private static getSecret() {
    return this.info['Secret'];
  }
  public static generateSignature(requestUrl: string, requestType: string, requestBody: object): Signature {
    if (this.info === null) {
      return null;
    }
    const body1 = {};

    for (const key in requestBody) { /* typeof requestBody[key] !== 'undefined' && */
      if (!(new RegExp('picture|file|_|recaptcharesponse')).test(key.toLocaleLowerCase())) {
        body1[key] = requestBody[key] !== null ? requestBody[key].toString() : requestBody[key];
        // if (requestBody[key] === null || requestBody[key] === undefined) {
        //   body1[key] = requestBody[key].toString();
        // }
      }
    }

    const body = JSON.stringify(body1);
    // const body = JSON.stringify(requestBody);
    const nonce: number = Date.now() + Info.getTimeOffset(); // + Math.random();
    let signature = Base64.stringify(sha256(this.getSecret() + requestUrl + requestType + body));
    signature = hmacSHA512(signature + nonce, this.getSecret());
    const sig = new Signature();
    sig.key = signature.toString();
    sig.nonce = nonce;
    return sig;
  }
  public static getId() {
    return this.info['Id'];
  }
  public static getTranslation(http: HttpClient, getlang: any, isChangLang: boolean, callback?) {
    if (
      (!Storage.exists('appLang') && isChangLang === false) ||
      (Storage.exists('appLang') && isChangLang === true) ||
      (Storage.readCookie('language') !== localStorage.getItem('Clang'))
    ) {
      this.http = http;
      this.http.get(AppSettings.apiEndpoint + 'home/get-translation?prefLang=' + getlang).subscribe(res => {
        let Status = true;
        if (res['Error'] !== undefined) {
          Status = false;
        }
        if (!Status) {
          setTimeout(() => {
            App.getTranslation(http, getlang, isChangLang, callback);
          }, 1000);
          return;
        }
        const appLang = res['Translation'];
        const appLangBackUp = res['BackUpTranslation'];
        Storage.set('Clang', getlang);
        Storage.set('appLang', JSON.stringify(appLang));

        Storage.set('appLangBackUp', JSON.stringify(appLangBackUp));
        Storage.createCookie('language', getlang, 1);
        TranslationInit.SetForParsingTranslation( appLang, appLangBackUp );
        if (typeof callback === 'function') {
          setTimeout(() => {
            // console.log('dddd');
            callback();
          });
        }
        // callback();
      });
    }
  }
  public static getLanguages(http: HttpClient, callback) {
    let lang;
    this.http.get(AppSettings.apiEndpoint + 'home/get-languages').subscribe(data => {
      let Status = true;
      if (data['Error'] !== undefined) {
        Status = false;
      }
      if (!Status) {
        setTimeout(() => {
          App.getLanguages(http, callback);
        }, 1000);
        return;
      }
      Storage.set('activelang', JSON.stringify(data));
      callback(data);
      lang = data;
    });
    return lang;
  }

}
