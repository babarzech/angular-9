import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Pair, Pairs } from './market';
import { ApiCall } from '../helpers/apicall';



@Injectable()
export class FavPair {
    public static initialized = false;
    private static info: object;
    // private static readonly key: string = 'userInfo';
    // private static apiCall: ApiCall;
    public static http;
    private static router: Router;
    public static init(http?: HttpClient, router?: Router) {
        if (http) {
            this.http = http;
            // this.apiCall = new ApiCall(http, router);
        }
        if (router) {
            this.router = router;
        }
        this.initialized = true;
    }
    public static updateFavPair(pair: Pair, callback) {
        const api = new ApiCall(this.http, this.router);
        api.method = 'POST';
        api.authenticate = true;
        api.body = { 'Pair': pair.id };
        api.endPoint = 'account/update-favp';
        api.encryptBody = false;
        api.send(success => {
            callback(success.Status);
        }, error => {
            callback(false);
        });
    }
    public static getFavPairs(callback) {
        const api = new ApiCall(this.http, this.router);
        api.method = 'POST';
        api.authenticate = true;
        api.body = { 'Submit': '1' };
        api.endPoint = 'account/get-favp';
        api.encryptBody = false;
        api.send(success => {
            const activefavpair = [];
            success.Result = Object.values(success.Result);
            for (let i = 0; i < success.Result.length; i++) {
                // if (Pairs.getPair(success.Result[i]).Status === 1) {
                activefavpair.push(success.Result[i]);
                // }
            }
            success.Result = activefavpair;
            callback(success);
        }, error => {
            callback(false);
        });
    }
}
