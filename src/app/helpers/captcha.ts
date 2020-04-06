import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../config/config';
import { tap } from 'rxjs/operators';
import { Loader } from './loader';

declare var initGeetest: any;
declare var $: any;
class Ld {
  public static show() {
    $('#loader321').show();
  }
  public static hide() {
    $('#loader321').hide();
  }
}

export class Captcha {
  public static counter = 0;
  private static initalizing = false;
  private initialized = false;
  public data: { [k: string]: any } = {};
  private captchaObj: { [k: string]: any } = {};
  private result: any;
  public capStatus: boolean;
  public loaded = false;
  public isGoogleAcessable = false;
  public constructor(public form: any, public elementId: string,public http: HttpClient) {
    this.capStatus = false;

    $('#' + elementId).append('<div class="loading-anim"><mat-progress-bar mode="indeterminate"></mat-progress-bar></div>');
    // if (!isGoogleAcessable) {
      http.get(AppSettings.apiEndpoint + 'home/initialize-captcha?t=' + (new Date()).getTime()).subscribe(
        // http.get('https://www.geetest.com/demo/gt/register-slide-en?t=' + (new Date()).getTime()).subscribe(
        resp => {
          setTimeout(() => {
            this.data = resp;
            // console.log(this.data,'gee resp');
            this.init();
          }, 5000);
        }
      );
    // }

  }
  public static isGoogleAccessAble(http, callback) {
    // let isGoogleAcessable = true;
    // console.log('google recaptcha');
    // http.get('https://www.google.com/').subscribe( // Log the result or error
    //   data => console.log('success data from google'),
    //   error => {
      setTimeout(() => {
        if (window['grecaptcha'] === undefined) {
          // isGoogleAcessable = true;
          callback(false);
        } else {
          callback(true);
          // isGoogleAcessable = false;
        }
      }, 1000);
      // });
    // isGoogleAcessable = false;
  }
  private init() {
    initGeetest({
      gt: this.data.gt,
      challenge: this.data.challenge,
      offline: !this.data.success,
      new_captcha: this.data.new_captcha,
      product: 'popup',
      lang: 'en',
      width: '100%',
      timeout: 3000000,
      https: false
    }, captchaObj => {
      captchaObj.onReady(() => {
        this.loaded = true;
        Loader.hide();
      });
      captchaObj.onClose(() => {
        Ld.hide();
      });
      captchaObj.onSuccess(() => {
        // Ld.show();
        this.capStatus = true;
        // $('#' + this.form).trigger('click');
      });
      this.callback(captchaObj);
    });
  }



  private callback(captchaObj) {
    if (this.initialized === true) {
      return;
    }
    this.initialized = true;
    if (Captcha.initalizing) {
      return;
    }
    Captcha.initalizing = true;
    Captcha.counter += 1;
    $('#' + this.elementId).html('');
    setTimeout(() => {
      captchaObj.appendTo('#' + this.elementId);
      captchaObj.onReady(() => {
        Captcha.initalizing = false;
        $('#' + this.elementId).find('mat-progress-bar').remove();
      });
      this.captchaObj = captchaObj;
    });
  }
  public validate(): boolean {
    // this.result = { test: true }; // for testing
    // return true; // for testing
    // un comment bottom after testing
    if (typeof this.captchaObj.getValidate === 'function') {
      this.result = this.captchaObj.getValidate();
      if (this.capStatus === false) {
        this.openCaptcha();
      }
      return this.capStatus;
    } else {
      return false;
    }
  }
  public reset() {
    if (this.captchaObj.reset !== undefined) {
      this.captchaObj.reset();
    }
    this.capStatus = false;
  }
  public get() {
    return this.result;
  }

  public openCaptcha() {
    // Ld.show();
    // $('#' + this.form).trigger('click'); // for testing
    // return; // for testing
    // uncomment bottom after testing
    if (this.loaded) {
      $('.geetest_radar_btn').trigger('click');
    } else {
      setTimeout(() => {
        this.openCaptcha();
      }, 100);
    }
  }

  public addToModel(obj: { [k: string]: any }) {
    return Object.assign({}, obj, this.get());
    // const rs = this.get();
    // for (const key in rs) {
    //   obj[key] = rs[key];
    // }
    // return obj;
  }
}


