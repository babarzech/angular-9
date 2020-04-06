import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Currency } from './../../../models/market';
import { ApiCall } from '../../../helpers/apicall';
import { Router } from '@angular/router';
import { Loader } from '../../../helpers/loader';
import { Notification, NotificationType } from './../../../helpers/notification';


@Component({
  selector: 'app-wallet-history-modal',
  templateUrl: './wallet-history-modal.component.html',
  styleUrls: ['./wallet-history-modal.component.css']
})
export class WalletHistoryModalComponent implements OnInit {
  public http: HttpClient;
  public currency: Currency;
  public apiCaller: ApiCall;
  // public deposits = [];
  // public withdraws = [];
  public walletTransactions = [];
  public walletTransactionsPager: any;
  constructor(
    public dialogRef: MatDialogRef<WalletHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient, router: Router) {
    this.http = http;
    this.apiCaller = new ApiCall(http, router);
  }

  ngOnInit() {
    Loader.show();
    this.apiCaller.method = 'POST';
    this.apiCaller.body = { Id: this.currency.id };
    this.apiCaller.authenticate = true;
    this.apiCaller.endPoint = 'trade/wallet-history';
    this.apiCaller.send(
      success => {
        Loader.hide();
        if (success.Status) {
          this.walletTransactions = success.Result;
          // this.withdraws = success.Result.Withdraws;
          // this.deposits = success.Result.Deposits;
        } else {
          Notification.send('Error', success.Message, NotificationType.Danger);
        }
      },
      error => {
        Loader.hide();
      }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
