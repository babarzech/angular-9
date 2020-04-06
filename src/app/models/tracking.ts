import { ApiCall } from '../helpers/apicall';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '../helpers/storage';
import { AppSettings } from '../config/config';

export class Tracking {
    private static apiCall: ApiCall;
    private static router: Router;
    public static init(http: HttpClient, router: Router) {
        this.apiCall = new ApiCall(http, router);
        this.router = router;
    }

    public static Filter(callback): boolean {
        // sessionStorage.setItem('_trackingData'

        this.apiCall.method = 'POST';
        this.apiCall.authenticate = true;
        this.apiCall.encryptBody = false;
        this.apiCall.endPoint = 'account/tracking';
        this.apiCall.body = {};
        if (sessionStorage.getItem('_trackingData') !== null) {
            this.apiCall.body[AppSettings.ucparam] = sessionStorage.getItem('_trackingData');
        }
        this.apiCall.send(
            success => {
                if (success.Result !== null) {
                    if (success.Result.Modal !== undefined) {
                        Storage.set('bonus_html', success.Result.Modal);
                        sessionStorage.removeItem('_trackingData');
                        this.router.navigate(['/bonus']);
                        callback(true);
                        return;
                    }
                }
                callback();

            },
            err => {
                this.router.navigate(['/']);

            }
        );
        return true;
    }

}

