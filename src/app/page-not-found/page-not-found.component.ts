import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../models/userlogin';
import { Loader } from '../helpers/loader';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() {
    if (!UserLogin.Filter()) {
      return;
    }
  }

  ngOnInit() {
    Loader.hide();
  }

}
