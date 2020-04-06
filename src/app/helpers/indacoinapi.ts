import { Injectable } from '@angular/core';
import { AppSettings } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiCall } from './apicall';
import { Loader } from '../helpers/loader';
import { Notification, NotificationType } from '../helpers/notification';



@Injectable()
export class IndacoinApiCall {
  public accountInfo;
  constructor(public httpClient: HttpClient, public route: Router) { }
  getAmountIn(amount: number, cur_in: string, cur_out: string) {
    return this.httpClient.get(AppSettings.indacoinEndpoint + '/api/GetCoinConvertAmount' +
    '/' + cur_in + '/' + cur_out + '/' + amount + '/decoin');
  }
  getAmountOut(amount: number, cur_in: string, cur_out: string) {
    return this.httpClient.get(AppSettings.indacoinEndpoint + '/api/GetCoinConvertAmountOut' +
     '/' + cur_in + '/' + cur_out + '/' + amount + '/decoin');
  }

getCoinsList() {
  // for all curriences url => /api/mobgetcurrenciesinfoi
  // for active curriences url => /api/mobgetcurrenciesinfoi/1
  return  this.httpClient.get(AppSettings.indacoinEndpoint + '/api/mobgetcurrenciesinfoi/1');
}
getCashList() {
  // for all curriences url => /api/mobgetcurrenciesinfoi
  // for active curriences url => /api/mobgetcurrenciesinfoi/1
  return  this.httpClient.get(AppSettings.indacoinEndpoint + '/api/getcashinfo/1');
}

  createTransaction(cur_in: string, cur_out: string,  amount: number) { // user_id: string, bitcoinAddress: string,TargetTagAddress:string,
    const apiCall = new ApiCall(this.httpClient, this.route);
    apiCall.method = 'POST';
    apiCall.encryptBody = false;
    apiCall.body = { CurIn: cur_in, CurOut: cur_out,  AmountIn: amount};
    // UserId:user_id TargetAddress: bitcoinAddress,TagAddress:TargetTagAddress,
    apiCall.endPoint = 'indacoin/create-transaction';
    apiCall.authenticate = true;
    apiCall.send(
      success => {
        Loader.hide();
        if (success.Status) {
          const userAgent = window.navigator.userAgent;
          if (userAgent.match(/Safari/) && (userAgent.match(/Version\/9/) || userAgent.match(/Version\/10/))) {
            window.location.assign(success.Result);
            document.location.assign(success.Result);
          }
          if (window.open(success.Result, '_blank') === null) {
            setTimeout(() => {window.location.href = success.Result; }, 250);
          }
        }else {
          Notification.send('Error', success.Message[0].toUpperCase() + success.Message.slice(1) + '.', NotificationType.Danger);
        }
      },
      error => { Loader.hide(); }
    );

  }
  async userInfo(callback) {
    const apiCall = new ApiCall(this.httpClient, this.route);
    apiCall.method = 'POST';
    apiCall.authenticate = true;
    apiCall.encryptBody = false;
    apiCall.body = { Submit: '1' };
    apiCall.endPoint = 'account/account-info';
    apiCall.send(
      success => {
        if (success.Status) {
          callback(success.Result.Em);
        }
      },
      error => { Loader.hide(); }
    );
  }

}
