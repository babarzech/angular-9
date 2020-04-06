import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Pair, Wallets, Wallet } from '../../../models/market';


@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.css']
})
export class DepositModalComponent implements OnInit {
  public mainPair: Pair;
  public wallets: { [id: number]: Wallet } = {};
  public http: HttpClient;
  public marketAddress;
  public baseAddress;
  public currency;
  public address;
  constructor(
    public dialogRef: MatDialogRef<DepositModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient) {
    this.http = http;
  }

  ngOnInit() {
    this.address = this.wallets[this.currency.id].address ? this.wallets[this.currency.id].address : '';
    // this.marketAddress = this.mainPair ? (
    //   this.wallets[this.mainPair.marketCurrency.id] ?
    //   this.wallets[this.mainPair.marketCurrency.id].address : 'Generating Address...') : 'Loading...';

    //   this.baseAddress = this.mainPair ? (
    //     this.wallets[this.mainPair.baseCurrency.id] ?
    //     this.wallets[this.mainPair.baseCurrency.id].address : 'Generating Address...') : 'Loading...';
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
