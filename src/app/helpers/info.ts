
import { HttpClient } from '@angular/common/http';
import { ApiCall } from './apicall';
import { Router } from '@angular/router';
import { AppSettings } from '../config/config';
import { Storage } from './storage';

export class Info {
    public static timeoffset = null;
    public static apiCall: ApiCall;
    public static callbacks = [];
    // public static timeKey = 'server_time_offset';
    public static loaded = false;
    public static init(http: HttpClient, callback): void {
        const startTime = Date.now();
        http.get(AppSettings.apiEndpoint + 'home/info').subscribe(
            resp => {
                // resp['Time'] = 1542877423171;
                // const timeTaken = (Date.now() - startTime) / 2;
                // Storage.set(this.timeKey, resp['Time']  - (Date.now() - (Date.now() - startTime) / 2));
                this.timeoffset = Number(resp['Time']) - (Date.now() - (Date.now() - startTime) / 2);
                this.loaded = true;
                callback(resp);
                this.onComplete();
            }
        );
    }
    public static addCallBack(callback): void {
        this.callbacks.push(callback);
    }
    private static onComplete(): void {
        this.callbacks.forEach(call => {
            call();
        });
    }
    public static getTimeOffset() {
        return this.timeoffset;
        // if (Storage.exists(this.timeKey)) {
        //     return Number(Storage.get(this.timeKey));
        // } else {
        //     return null;
        // }
    }
}
