import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export class TradeModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TradeModalComponent>) { }

  ngOnInit() {
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
