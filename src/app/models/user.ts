import { Injectable } from '@angular/core';
import { Storage, Session } from '../helpers/storage';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import { Signature } from './app';
import Base64 from 'crypto-js/enc-base64';
import { Pair } from './market';
// import { ApiCall } from '../helpers/apicall';



@Injectable()
export class Signup {
    // public Name: string;
    public Email: string;
    public Password: string;
    public ConfirmPassword: string;
    public RecaptchaResponse: string;
    // public PhoneVerif: string;
    public termCondition: boolean;
}

export class Login {
    public RecaptchaResponse;
    public Email: string;
    public Password: string;
}
export class InvestorWithDraw {
    public WithdrawAmount: number;
}
export class PasswordReset {
    public Id: number;
    public Hash1: string;
    public Hash2: string;
    public Password: string;
    public ConfirmPassword: string;
    public RecaptchaResponse: string;
}
export class User {
    public static initialized = false;
    private static info: object;
    private static readonly key: string = 'userInfo';
    // private static apiCall: ApiCall;
    public static http;
    private static router: Router;
    public static init(http?: HttpClient, router?: Router) {
        this.info = JSON.parse(Storage.get(this.key));
        if (http) {
            this.http = http;
            // this.apiCall = new ApiCall(http, router);
        }
        if (router) {
            this.router = router;
        }
        this.initialized = true;
    }
    public static reload() {
        this.info = JSON.parse(Storage.get(this.key));
    }
    public static pendingTokenEnable() {
        Storage.set('tokenst', 1);
    }
    public static pendingTokenDisable() {
        Storage.remove('tokenst');
    }
    public static pendingTokenExists() {
        return Storage.exists('tokenst');
    }
    public static createTwoFaRestriction() {
        Storage.set('2fa-verification-key', 'true');
    }
    public static isTwoFaRestriction() {
        return Storage.exists('2fa-verification-key');
    }
    public static removeTwoFaRestriction() {
        Storage.remove('2fa-verification-key');
    }
    public static enableTwoFa(): void {
        Storage.set('2faEnabled', true);
    }
    public static disableTwoFa(): void {
        if (Storage.exists('2faEnabled')) {
            Storage.remove('2faEnabled');
        }
    }
    public static isTwoFaEnabled(): boolean {
        return Storage.exists('2faEnabled');
    }
    public static save(userData: object) {
        //        Storage.set(this.key, JSON.stringify(userData));
        Storage.set(this.key, JSON.stringify(userData));
        this.init();
    }
    public static updateTwoFaSettings(enableTwoFa = false) {
        this.info['TwoFa'] = enableTwoFa;
        this.save(this.info);
    }
    public static logout() {
        this.disableTwoFa();
        Storage.remove(this.key);
    }
    private static update() {
        this.save(this.info);
    }
    public static getName(): string {
        return this.info['Name'];
    }
    public static setName(name: string): void {
        this.info['Name'] = name;
        this.update();
    }
    public static setEmail(email: string): void {
        this.info['Email'] = email;
        this.update();
    }
    public static getEmail(): string {
        return this.info['Email'];
    }
    public static getToken(): string {
        try {
            return this.info['Token'];
        } catch (err) {
            return '';
        }
    }
    public static getTokenId(): string {
        try {
            return this.info['TI'];
        } catch (err) {
            return '';
        }
    }
    public static getTokenSignature(signature: Signature): string {
        try {
            return hmacSHA256(this.info['Token'], signature.key).toString();
        } catch (err) {
            // console.error(err);
            return '';
        }
    }
    public static getId(): number {
        return this.info ? this.info['Id'] : null;
    }
    /*
    public static LoginFilter(): void {
        if (this.isTwoFaRestriction()) {
            this.router.navigate(['/account/authenticate-2fa']);
        }
        if (this.getId() > 0) {
            this.apiCall.method = 'POST';
            this.apiCall.authenticate = true;
            this.apiCall.endPoint = 'account/isLogin';
            this.apiCall.body = { Id: this.getId() + '' };
            this.apiCall.send(
                success => {
                    if (!success.Status) {
                        Storage.remove(this.key);
                        this.router.navigate(['login']);
                    }
                },
                error => {
                }
            );
        } else {
            this.router.navigate(['login']);
        }
    }*/
}
