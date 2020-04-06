import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Loader } from "../helpers/loader";
import { ApiCall } from "../helpers/apicall";
import { Notification, NotificationType } from "../helpers/notification";
import { NgModel } from "@angular/forms";
import { Injectable } from "@angular/core";

@Injectable()

export class apikeys {
  public data: { [k: string]: any } = {};
  public keys = [];
  public model: any;
  public static http;
  public static router;
  public ApiKeyId : 0;
  public GetApiKeys(http: HttpClient, route: Router,CurrentPageIndex:number, callBack) {
    Loader.show();
    const apiCall = new ApiCall(http, route);
    apiCall.method = 'POST';
    apiCall.authenticate = true;
    apiCall.encryptBody = false;
    apiCall.endPoint = 'apiaccount/get-api-keys';
    apiCall.body = { 'Submit': '0', CurrentPageIndex:CurrentPageIndex };
    apiCall.send(
      success => {
        let wt = [];
        wt=success.Result;
        //  success.Result.forEach(val => {
        //     wt.push(val);
        // });
        callBack(success.Result);
    }, error => {
    }
    );
  }

  public static onSubmit(http: HttpClient, route: Router,model:any,callBack) {
    Loader.show();
    const apiCall = new ApiCall(http, route);
    var ApiKeyId = 0;
    model['TwoFa'] = '0';
    model['Label'] = window['apiKey'].Label;
    apiCall.method = 'POST';
    apiCall.authenticate = true;
    apiCall.endPoint = 'apiaccount/create-keys';
    apiCall.body = model;
    apiCall.send(
      success => {
        Loader.hide();
        if (success.Status) {
          window['ApiKeyId'] = success.Result.Id;
          delete window['apiKey'];
          Loader.hide();
          callBack(success);
        } else {
          callBack(success);
        }
      },
      error => {
        Loader.hide();
        alert('Something went wrong');
      }
    );
  }
  public static GetApiKey(http: HttpClient, router: Router, acRoute: ActivatedRoute) {
    var data: { [k: string]: any } = {};
    acRoute.params.subscribe(
      (params: ParamMap) => {
        Loader.show();
        const apiCaller = new ApiCall(http, router);
        apiCaller.method = 'POST';
        apiCaller.authenticate = true;
        apiCaller.encryptBody = false;
        apiCaller.body = { Id: Number(params['id']), Hash: params['hash'] };
        apiCaller.endPoint = 'apiaccount/get-api-key';
        apiCaller.send(
          success => {
            Loader.hide();
            if (success.Status) {
              data = success.Result;
            } else {
              this.router.navigate(['login']);
            }
          },
          error => {
          }
        );
      }
    );

  }
}
