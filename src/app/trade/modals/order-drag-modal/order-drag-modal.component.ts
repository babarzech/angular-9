import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Pair } from '../../../../app/models/market';


@Component({
  selector: 'app-order-drag-modal',
  templateUrl: './order-drag-modal.component.html',
  styleUrls: ['./order-drag-modal.component.css']
})
export class OrderDragModalComponent implements OnInit {
  public model = { Rate: 0, Quantity: 0, dntShowAgain: false };
  public mainPair;
  public stepAndMinRate = 1;
  public stepAndMInQty = 1;
  public dontShowAgain = false;
  constructor(public dialogRef: MatDialogRef<OrderDragModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Rate, Quantity, pair }) { }

  ngOnInit() {

    this.model.Rate = this.data.Rate;
    this.model.Quantity = this.data.Quantity;
    this.mainPair = this.data.pair;
    this.stepAndMin(this.mainPair);
  }

  closeModal() {

    this.dialogRef.close();

  }
  onSubmit() {
    this.model.dntShowAgain = this.dontShowAgain;
    this.dialogRef.close(this.model);
  }
  stepAndMin(pair: Pair) {
    let sum = 1;
    if (pair.basePrecision !== undefined) {
      sum = Math.pow(10, pair.basePrecision);
      const value = 1 / sum;
      this.stepAndMinRate = value;
    }
    if (pair.marketPrecision !== undefined) {
      sum = Math.pow(10, pair.marketPrecision);
      const value = 1 / sum;
      this.stepAndMInQty = value;
    }
  }
  dntShowPopup(event) {
    this.dontShowAgain = event.checked ? true : false;
  }

}
