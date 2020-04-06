import { Injectable } from '@angular/core';
import { ApiCall } from '../helpers/apicall';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class transaction {

  constructor(public httpClient: HttpClient, public route: Router) { }

    public getDistributionHistory(userid: number, CurrentPageIndex:number, callBack) {
      const apiCall = new ApiCall(this.httpClient, this.route);
        apiCall.method = 'POST';
        apiCall.encryptBody = false;
        apiCall.body = { UserId : userid ,CurrentPageIndex:CurrentPageIndex};
        apiCall.endPoint = 'trade/distribution-history';
        apiCall.authenticate = true;
        apiCall.send(
            success => {
                let wt = [];
                wt=success.Result;
                //  success.Result.forEach(val => {
                //     wt.push(val);
                // });
                callBack(success.Result);
            }, error => {
            });
    }
}


