import { ApiCall } from '../helpers/apicall';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Redirect } from '../helpers/redirect';
import { Storage } from '../helpers/storage';

export class UserLogin {
  private static loginAttempts = 0;
  private static apiCall: ApiCall;
  private static router: Router;
  public static init(http: HttpClient, router: Router) {
    this.apiCall = new ApiCall(http, router);
    this.router = router;
    if (!User.initialized) {
      User.init(http, router);
    }
  }

  public static Filter(redirect = true, callback?: (data) => void, count = 0, noHttp = false): boolean {
    User.reload();
    if (User.isTwoFaRestriction()) {
      User.removeTwoFaRestriction();
    }
    if (User.getId() > 0 && !User.pendingTokenExists()) {
      if (noHttp) {
        return true;
      }

      const dc = Storage.get('_dc');
      this.apiCall.method = 'POST';
      this.apiCall.authenticate = true;
      this.apiCall.encryptBody = false;
      this.apiCall.endPoint = 'account/isLogin';
      this.apiCall.body = { Id: User.getId().toString() };
      if (dc !== null) {
        this.apiCall.body['_dcRedirect'] = JSON.parse(dc).dcard.toString();
        this.apiCall.body['_lang'] = JSON.parse(dc).lang.toString();
      }

      this.apiCall.send(
        success => {
          if (!success.Status) {
            if (success.Message === 'Invalid Request') {
              if (count === 0) {
                UserLogin.Filter(redirect, callback, 1);
              } else {
                if (callback) {
                  callback(false);
                }
              }
            } else {
              UserLogin.loginAttempts += 1;
              if (UserLogin.loginAttempts <= 1) {
                UserLogin.Filter(redirect, callback);
                return;
              }
              User.logout();
              // this.router.navigate(['login']);
              if (callback) {
                callback(false);
              }
            }
          } else {
            if (success.Result !== null && success.Result.Rd) {
              Storage.remove('_dc');
              window.location.href = success.Result.RedirectURL;
            }
            UserLogin.loginAttempts = 0;
            if (callback) {
              callback(true);
            }

          }
        },
        error => {
          if (error.status === 401) {
            if (callback) {
              callback(false);
            }
          }
        }
      );
      return true;
    } else {
      if (callback) {
        callback(false);
        return false;
      }
      if (redirect === true) {
        // Redirect.setReturnurl();
        this.router.navigate(['login'], { queryParams: { returnurl: Redirect.getReturnUrl() } });
        return false;
      }
    }

  }
}
