import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-cancel-modal',
  templateUrl: './order-cancel-modal.component.html',
  styleUrls: ['./order-cancel-modal.component.css']
})
export class OrderCancelModalComponent implements OnInit {
  public orderLength: number;
  public http: HttpClient;
  constructor(
    public dialogRef: MatDialogRef<OrderCancelModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, http: HttpClient) {
    this.http = http;
  }

  ngOnInit() {
    this.orderLength = this.data.orderLength;

    if (!this.orderLength) {
      document.getElementsByClassName('order-cancel-modal')[0].classList.add('empty');
    }
  }

  closeModal(response): void {
    this.dialogRef.close(response);
  }

}
