// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';

// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

// import { BrowserModule } from '@angular/platform-browser';
// import { NgModule } from '@angular/core';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';

// @NgModule({
//   declarations: [
//     AppComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule
//   ],
//   providers: [],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { AmChartsModule } from '@amcharts/amcharts3-angular';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClipboardModule } from 'ngx-clipboard';
// import { DataTablesModule } from 'angular-datatables';
import { APP_BASE_HREF } from '@angular/common';
import { Storage } from './helpers/storage';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';


MatProgressBarModule
// import {
//   MatButtonModule,
//   MatTabsModule,
//   MatRadioModule,
//   MatChipsModule,
//   // MatCardModule, //1
//   //    MatMenuModule,
//   // MatToolbarModule, //1
//   MatIconModule,
//   MatSelectModule,
//   MatTooltipModule,
//   MatDialogModule,
//   MatMenuModule,
//   MatCheckboxModule,
//   MatProgressSpinnerModule,
//   MatProgressBarModule
//   // MatSlider
//   //    MatInputModule
// } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AppComponent } from './app.component';
// import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TradeComponent } from './trade/trade.component';
import { DepositModalComponent } from './trade/modals/deposit-modal/deposit-modal.component';
import { WithdrawModalComponent } from './trade/modals/withdraw-modal/withdraw-modal.component';
// import { UserLoginComponent } from './user-login/user-login.component';
// import { UserSignupComponent } from './user-signup/user-signup.component';
import { RoundPipe, SpanWrapePipe, Round2Pipe } from '../app/helpers/utilities';
import { HeaderComponent } from './header/header.component';
// import { AccountComponent } from './settings/account/account.component';
import { LimitOrderComponent } from './trade/limit-order/limit-order.component';
// import { RecoverAccountComponent } from './user/recover-account/recover-account.component';
// import { ChangePasswordComponent } from './user/change-password/change-password.component';
// import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { RecaptchaModule } from 'ng-recaptcha';
// import { SetTwofaComponent } from './user/set-twofa/set-twofa.component';
// import { AuthenticateTwofaComponent } from './user/authenticate-twofa/authenticate-twofa.component';
import { MarketOrderComponent } from './trade/market-order/market-order.component';
import { StopOrderComponent } from './trade/stop-order/stop-order.component';
// import { AccountVerificationComponent } from './user/account-verification/account-verification.component';
// import { Ng2ImgToolsModule } from 'ng2-img-tools';
// import { AddBankComponent } from './user/add-bank/add-bank.component';
// import { ManageBankComponent } from './user/manage-bank/manage-bank.component';
import { FooterComponent } from './footer/footer.component';
// import { VerifyEmailComponent } from './account/verify-email/verify-email.component';
import { WalletHistoryModalComponent } from './trade/modals/wallet-history-modal/wallet-history-modal.component';
// import { Disable2faComponent } from './user/disable2fa/disable2fa.component';
// import { WalletComponent } from './wallet/wallet.component';
import { FilterPipe, FilterArray } from './helpers/pipe';
// import { ApikeyComponent } from './apikey/apikey.component';
// import { ApikeyDetailComponent } from './apikey-detail/apikey-detail.component';
// import { AuthenticateTwofaChildComponent } from './child/authenticate-twofa-child/authenticate-twofa-child.component';
// import { ApikeyModalComponent } from './modals/apikey-modal/apikey-modal.component';
// import { SafetyInstructionComponent } from './safety-instruction/safety-instruction.component';
// import { SmsComponent } from './user/sms/sms.component';
// import { AccountSettingsComponent } from './user/account-settings/account-settings.component';
// import { AuthenticateModalComponent } from './modals/authenticate-modal/authenticate-modal.component';
// import { DisablePhoneComponent } from './user/disable-phone/disable-phone.component';
// import { DeviceAuthorizationComponent } from './device-authorization/device-authorization.component';
// import { AffiliateComponent } from './affiliate/affiliate.component';
// import { DepositComponent } from './deposit/deposit.component';
// import { WithdrawComponent } from './withdraw/withdraw.component';
// import { HistoryComponent } from './history/history.component';
// import { KycComponent } from './kyc/kyc.component';
// import { WithdrawConfirmationComponent } from './withdraw-confirmation/withdraw-confirmation.component';
// import { MyOrdersComponent } from './my-orders/my-orders.component';
// import { OpenOrderComponent } from './my-orders/open-order/open-order.component';
// import { OrderHistoryComponent } from './my-orders/order-history/order-history.component';
// import { TradeHistoryComponent } from './my-orders/trade-history/trade-history.component';
// import { DepositHistoryComponent } from './deposit-history/deposit-history.component';
// import { WitdrawHistoryComponent } from './witdraw-history/witdraw-history.component';
// import { AntiPhishingComponent } from './anti-phishing/anti-phishing.component';
// import { KeepAliveComponent } from './keep-alive/keep-alive.component';
import { RangeSliderComponent } from './trade/range-slider/range-slider.component';
// import { AfterLoginComponent } from './after-login/after-login.component';
// import { DebitcardComponent } from './debitcard/debitcard.component';
import { OrderCancelModalComponent } from './trade/modals/order-cancel-modal/order-cancel-modal.component';
// import { IndacoinComponent } from './indacoin/indacoin.component';
import { CommonService } from './helpers/commonservice';
import { UserOrdersComponent } from './trade/user-orders/user-orders.component';
import { TranslationPipe } from './translation.pipe';
import { ChartConfiguration } from './config/chartconfig';
import { OrderDragModalComponent } from './trade/modals/order-drag-modal/order-drag-modal.component';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LanguageManager } from './helpers/languageservice';
// import { DistributionHistoryComponent } from './distribution-history/distribution-history.component';
// import { DisbaleAntiPhishingComponent } from './disbale-anti-phishing/disbale-anti-phishing.component';
// import { DisableantiphishingModalComponent } from './modals/disableantiphishing-modal/disableantiphishing-modal.component';
// import { ApikeyauthModalComponent } from './modals/apikeyauth-modal/apikeyauth-modal.component';
// import { ApikeyauthsmsModalComponent } from './modals/apikeyauthsms-modal/apikeyauthsms-modal.component';
// import { ApikeyauthemailModalComponent } from './modals/apikeyauthemail-modal/apikeyauthemail-modal.component';
// import { IndacoinconfirmationModalComponent } from './modals/indacoinconfirmation-modal/indacoinconfirmation-modal.component';
// import { ApikeyCreatedComponent } from './apikey-created/apikey-created.component';
// import { ApikeydeleteModelComponent } from './modals/apikeydelete-model/apikeydelete-model.component';
// import { ApikeyHistoryComponent } from './apikey-history/apikey-history.component';
import { CocoOrderComponent } from './trade/coco-order/coco-order.component';
// import { Apikeyauth2faModalComponent } from './modals/apikeyauth2fa-modal/apikeyauth2fa-modal.component';
// import { ReferalexportModalComponent } from './modals/referalexport-modal/referalexport-modal.component';

const appRoutes: Routes = [
  // { path: '', component: TradeComponent },
  // { path: 'login', component: UserLoginComponent },
  // { path: 'recover-account', component: RecoverAccountComponent },
  // { path: 'signup', component: UserSignupComponent },
  // // { path: 'account/update-info', component: AccountComponent },
  // { path: 'account/api-keys', component: ApikeyComponent },
  // {
  //   path: 'reset-password/:hash1/:hash2/:id',
  //   component: ResetPasswordComponent
  // },
  // {
  //   path: 'account/verify-email/:hash1/:hash2/:id',
  //   component: VerifyEmailComponent
  // },
  // { path: 'account/set-2fa', component: SetTwofaComponent },
  // { path: 'account/disable-2fa', component: Disable2faComponent },
  // { path: 'account/authenticate-2fa', component: AuthenticateTwofaComponent },
  // // { path: 'account/verification', component: AccountVerificationComponent },
  // { path: 'account/change-password', component: ChangePasswordComponent },
  // { path: 'account/anti-phishing', component: AntiPhishingComponent },
  // { path: 'account/disable-anti-phishing', component: DisbaleAntiPhishingComponent },
  // // { path: 'bank-accounts/add', component: AddBankComponent },
  // // { path: 'bank-accounts/manage', component: ManageBankComponent },
  // { path: 'balances', component: WalletComponent },
  // { path: 'deposit/:pair', component: DepositComponent },
  // { path: 'withdraw/:pair', component: WithdrawComponent },
  // { path: 'deposit', component: DepositComponent },
  // { path: 'withdraw', component: WithdrawComponent },
  // { path: 'history', component: HistoryComponent },
  // // launch uncomment
  // { path: 'apikeys/create', component: ApikeyComponent },
  // { path: 'apikeys/created/:id/:hash', component: ApikeyCreatedComponent },
  // // { path: 'apikeys/history', component: ApikeyHistoryComponent },
  // // { path: 'apikeys/management', component: ApikeyDetailComponent },
  // { path: 'safety-instructions', component: SafetyInstructionComponent },
  // { path: 'account/add-phone', component: SmsComponent },
  // { path: 'account/settings', component: AccountSettingsComponent },
  // {
  //   path: 'account/disable-phone-verification',
  //   component: DisablePhoneComponent
  // },
  // {
  //   path: 'device-authorization/:hash/:id',
  //   component: DeviceAuthorizationComponent
  // },
  // { path: 'referral', component: AffiliateComponent },
  // { path: 'kyc', component: KycComponent },
  // {
  //   path: 'withdraw-confirmation/:hash/:id/:type',
  //   component: WithdrawConfirmationComponent
  // },
  // { path: 'my-orders', component: MyOrdersComponent },
  // { path: 'orders', component: MyOrdersComponent },
  // { path: 'deposit-history', component: DepositHistoryComponent },
  // { path: 'withdraw-history', component: WitdrawHistoryComponent },
  // { path: 'orders/:ordertab', component: MyOrdersComponent },
  // { path: 'keep-alive', component: KeepAliveComponent },
  // { path: 'bonus', component: AfterLoginComponent },

  // { path: 'debitcard/:lang', component: DebitcardComponent },
  // { path: 'buy-sell-crypto', component: IndacoinComponent },
  // { path: 'distribution-history', component: DistributionHistoryComponent },
  /*
    { path: 'hero/:id', component: HeroDetailComponent },
    {
        path: 'heroes',
        component: HeroListComponent,
        data: { title: 'Heroes List' }
    },*/
  {
    path: ':pair',
    component: TradeComponent,
    // redirectTo: '/trade',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: '/BTC-USDT',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    
    AppComponent,
    TranslationPipe,
    RoundPipe,
    Round2Pipe,
    SpanWrapePipe,
    // HomeComponent,
    TradeComponent,
    PageNotFoundComponent,
    DepositModalComponent,
    WithdrawModalComponent,
    // UserLoginComponent,
    // UserSignupComponent,
   
    HeaderComponent,
    // AccountComponent,
    // ApikeysComponent,
    LimitOrderComponent,
    // RecoverAccountComponent,
    // ChangePasswordComponent,
    // ResetPasswordComponent,
    // SetTwofaComponent,
    // AuthenticateTwofaComponent,
    MarketOrderComponent,
    StopOrderComponent,
    // AccountVerificationComponent,
    // AddBankComponent,
    // ManageBankComponent,
    FooterComponent,
    // VerifyEmailComponent,
    WalletHistoryModalComponent,
    // Disable2faComponent,
    // WalletComponent,
    FilterPipe,
    FilterArray,
    // ApikeyComponent,
    // ApikeyDetailComponent,
    // AuthenticateTwofaChildComponent,
    // ApikeyModalComponent,
    // SafetyInstructionComponent,
    // SmsComponent,
    // AccountSettingsComponent,
    // AuthenticateModalComponent,
    // DisablePhoneComponent,
    // DeviceAuthorizationComponent,
    // AffiliateComponent,
    // DepositComponent,
    // WithdrawComponent,
    // HistoryComponent,
    // KycComponent,
    // WithdrawConfirmationComponent,
    // MyOrdersComponent,
    // OpenOrderComponent,
    // OrderHistoryComponent,
    // TradeHistoryComponent,
    // DepositHistoryComponent,
    // WitdrawHistoryComponent,
    // AntiPhishingComponent,
    // KeepAliveComponent,
    RangeSliderComponent,
    // AfterLoginComponent,
    // DebitcardComponent,
    // IndacoinComponent,
    OrderCancelModalComponent,
    UserOrdersComponent,
    OrderDragModalComponent,
    // DistributionHistoryComponent,
    // DisbaleAntiPhishingComponent,
    // DisableantiphishingModalComponent,
    // ApikeyauthModalComponent,
    // ApikeyauthsmsModalComponent,
    // ApikeyauthemailModalComponent,
    // IndacoinconfirmationModalComponent,
    // ApikeyCreatedComponent,
    // ApikeydeleteModelComponent,
    // ApikeyHistoryComponent,
    CocoOrderComponent,
    // Apikeyauth2faModalComponent,
    // ReferalexportModalComponent,
    // MatSlider,
  ],
  imports: [
    BrowserModule,
    // Ng2ImgToolsModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    //      MatInputModule,
    MatRadioModule,
    MatMenuModule,
    MatTabsModule,
    //   MatCardModule, //1
    //   MatToolbarModule, //1
    MatIconModule,
    //   AmChartsModule,
    MatDialogModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    NgxPaginationModule,
    // DataTablesModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    RecaptchaModule.forRoot(),
    ClipboardModule,
    RouterModule.forRoot(
      appRoutes // ,
      //   { enableTracing: true } // <-- debugging purposes only
    ),
    // ServiceWorkerModule
  ],
  // providers: [{ provide: APP_BASE_HREF, useValue: '/trade' }, CommonService],
  providers: [{
    provide: APP_BASE_HREF, useValue: '/' + LanguageManager.ReturnValidLang().toString() + '/trade/'
    // provide: APP_BASE_HREF, useValue: '/' + AppModule.ReturnValidLang().toString() + '/trade/'
  }, CommonService],
  bootstrap: [AppComponent],
  entryComponents: [
    DepositModalComponent,
    WithdrawModalComponent,
    WalletHistoryModalComponent,
    // ApikeyModalComponent,
    // AuthenticateModalComponent,
    OrderCancelModalComponent,
    OrderDragModalComponent,
    // DisableantiphishingModalComponent,
    // ApikeyauthModalComponent,
    // ApikeyauthemailModalComponent,
    // ApikeyauthsmsModalComponent,
    // IndacoinconfirmationModalComponent,
    // ApikeydeleteModelComponent,
    // Apikeyauth2faModalComponent,
    // ReferalexportModalComponent
  ]
})
export class AppModule {
}

