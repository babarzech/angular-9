import { Injectable } from '@angular/core';
import { AppSettings } from '../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { URLSearchParams } from '@angular/http';
import { App, Signature } from '../models/app';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { Info } from './info';
import { Redirect } from '../helpers/redirect';
import { Subscription } from 'rxjs';
import { Notification, NotificationType } from './notification';
import { BoundCallbackObservable } from 'rxjs/observable/BoundCallbackObservable';
import { NotificationHelper } from './notificationhelper';
import { Storage } from './storage';

declare var jquery: any;
declare var $: any;
declare var JSEncrypt: any;

@Injectable()
export class ApiCall {
    // private static requests: {[k: string]: Subscription} = {};
    public method: string;
    public body: object;
    public endPoint: string;
    public http: HttpClient;
    public authenticate: boolean;
    public done: (response: object) => void;
    public error: (error: object) => void;
    private router: Router;
    public encryptBody = true;
    public offlineRetry = false;
    public notconnected;
    constructor(http: HttpClient, route: Router) {
        this.http = http;
        this.router = route;
        this.authenticate = false;
        App.init();
    }
    public static getAuth(body: object): object {
        body = this.encryptObject(body);
        const signature: Signature = App.generateSignature('', 'POST', body);
        return {
            'XSig': signature.key,
            'XNonce': signature.nonce.toString(),
            'XRef': App.getId().toString(),
            'UserAuthenticationToken': User.getTokenSignature(signature),
            'XTi': User.getTokenId()
        };
    }
    private static encryptObject(response: object): object {
        const resp1 = Object.assign({}, response);
        return this.iterateObject(resp1, '', this.encrypt, App.getPublicKey());
    }
    private static encrypt(text: string): string {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(App.getPublicKey());
        return encodeURIComponent(encrypt.encrypt(text));
        // return encrypt.encrypt(text);
    }
    private static iterateObject(obj: object, stack, func, key) {
        for (const property in obj) {
            if ((new RegExp('picture|file|_|recaptcharesponse|geetest_validate|geetest_challenge|geetest_seccode'))
                .test(property.toString().toLocaleLowerCase())) {
                continue;
            }
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] === 'object') {
                    this.iterateObject(obj[property], stack + '.' + property, func, key);
                } else {
                    try {
                        if (!(new RegExp('picture|file|_|recaptcharesponse')).test(property)) {
                            obj[property] = func(obj[property].toString(), key);
                        }
                    } catch (err) {
                        throw err;
                    }
                }
            }
        }
        return obj;
    }
    public send(success: (data) => void, error: (err) => void, count = 0) {
        // if (this.endPoint === 'account/isLogin') {
        //   // console.warn('islogin')
        // }
        if (!Info.loaded) {
            Info.addCallBack(() => {
                this.send(success, error);
            });
            return;
        }
        if (this.method === 'POST' || this.method === 'GET') {
            const body = this.encryptBody ? ApiCall.encryptObject(this.body) : Object.assign({}, this.body);
            const url = AppSettings.apiEndpoint + this.endPoint;
            // const url1 = 'http://localhost:59788/' + this.endPoint;
            const signature: Signature = App.generateSignature(url, this.method, body);
            let headers: HttpHeaders;
            if (User.initialized === false) {
                User.init();
            }
            // consoel.log('')
            // debugger;
            if (this.authenticate) {
                if (!Storage.exists('appCreds') || signature == null) {
                    setTimeout(() => {
                        if (count < 20) {
                            this.send(success, error, ++count);
                        }
                    }, 300);
                    return;
                }
                headers = new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-sig': signature.key,
                    'x-nonce': signature.nonce.toString(),
                    'x-ref': App.getId().toString(),
                    'user-auth-token': User.getTokenSignature(signature),
                    'x-ti': User.getTokenId() !== undefined ? User.getTokenId().toString() : '0'
                    // 'userAuthenticationToken': User.getToken()
                    // 'Ref-Id': User.getId().toString()
                });
                if (User.getTokenId() === undefined || User.getTokenId() === null || User.getTokenId().length === 0) {
                    success({ Status: false });
                    return;
                }
            } else {
                headers = new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'x-sig': signature.key,
                    'x-nonce': signature.nonce.toString(),
                    'x-ref': App.getId().toString()
                });
            }
            // if (this.authenticate) {
            //     headers.append('userAuthenticationToken', User.getToken());
            // }
            const params = new URLSearchParams();
            for (const key in body) {
                if (body.hasOwnProperty(key)) {
                    params.append(key, body[key]);
                }
            }
            const req = this.http.post(url, params.toString(), {
                headers: headers
            }).subscribe(
                data => {
                    data['Message'] = NotificationHelper.getMessageTranslation(data['Message']);
                    // console.warn('successlog', {body: body, headers: (<any> headers).headers, rs: data});
                    // delete ApiCall.requests[url];
                    if (data['Status'] === false) {
                        switch (data['Code']) {
                            case 1: // login error
                                if (this.authenticate === true) {
                                    if (count === 0) {
                                        this.send(success, error, 1);
                                    } else {
                                        this.router.navigate(['login']);
                                        // Redirect.setReturnurl();
                                    }
                                }
                                break;
                            case 2: // app creds error
                                App.reInit(
                                    () => {
                                        this.send(success, error, 1);
                                    }
                                );
                                break;
                            default:
                                success(data);
                                break;
                        }
                    } else {
                        success(data);
                    }
                },
                err => {
                    // console.warn('errorlog', { body: body, headers: (<any>headers).headers, rs: err });
                    // delete ApiCall.requests[url];
                    // for (const _key in ApiCall.requests) {
                    //   if (ApiCall.requests[_key] !== undefined) {
                    //     // ApiCall.requests[_key].unsubscribe();
                    //     delete ApiCall.requests[_key];
                    //   }
                    // }
                    // ApiCall.requests = {};
                    if (err.status === 401) {
                        if (this.authenticate === true) {
                            if (count === 0) {
                                this.send(success, error, 1);
                            } else {
                                this.router.navigate(['login']);
                                // Redirect.setReturnurl();
                            }
                        }
                    } else if (err.status === 429) {
                        const data = { Status: true, Message: err.error.Message, Result: null, Code: 0 };
                        success(data);
                    } else if (err.status === 0) {
                        count++;
                        if (count === 2) {
                            this.endPoint = AppSettings.apiEndpoint + 'home/info';
                            this.send(success, error, 5);
                        } else if (count < 2) {
                            this.send(success, error, count);
                        } else if (count === 6) {
                            Notification.send('Offline', 'Unabletoaccessserver',
                                NotificationType.Danger);
                        }
                    }
                    error(err);
                }
            );
            // ApiCall.requests[url] = req;
        } else {
            throw new Error('Invalid method type');
        }
    }
}
