import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Pair } from '../../../models/market';
import { ApiCall } from '../../../helpers/apicall';
import { Router } from '@angular/router';
import { Loader } from '../../../helpers/loader';
import { Wallet } from './../../../models/market';
import { Notification, NotificationType } from './../../../helpers/notification';

@Component({
  selector: 'app-withdraw-modal',
  templateUrl: './withdraw-modal.component.html',
  styleUrls: ['./withdraw-modal.component.css']
})
export class WithdrawModalComponent implements OnInit {
  public mainPair: Pair;
  public model: any;
  public matTab2: number;
  public apiCaller: ApiCall;
  public currency;
  public wallets: { [id: number]: Wallet };
  constructor(
    public dialogRef: MatDialogRef<WithdrawModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient, router: Router) {
    this.apiCaller = new ApiCall(http, router);
    this.model = {};
  }

  ngOnInit() {
  }
  closeModal(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    // if (this.matTab2 === 0) {
    //   this.model.CurrencyId = this.mainPair.baseCurrency.id;
    // } else {
    //   this.model.CurrencyId = this.mainPair.marketCurrency.id;
    // }
    this.model.CurrencyId = this.currency.id;
    this.wallets[this.model.CurrencyId].balance = this.wallets[this.model.CurrencyId].balance - this.model.Amount;
    this.wallets[this.model.CurrencyId].available = this.wallets[this.model.CurrencyId].balance;
    Loader.show();
    this.apiCaller.method = 'POST';
    this.apiCaller.body = this.model;
    this.apiCaller.authenticate = true;
    this.apiCaller.endPoint = 'trade/withdraw-funds';
    this.apiCaller.send(
      success => {
        Loader.hide();
        if (success.Status) {
          this.model = {};
          Notification.send('Success', success.Message, NotificationType.Success);
          this.closeModal();
        } else {
          Notification.send('Error', success.Message, NotificationType.Danger);
        }
      },
      error => {
        Loader.hide();
      }
    );


  }

}
