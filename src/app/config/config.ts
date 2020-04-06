import { environment } from '../../environments/environment';

export class AppSettings {
    public static apiEndpoint = environment.apiEndpoint;
    public static socketEndpoint = environment.socketEndpoint;
    public static apiEndpointSig = 'http://localhost:59788/';
    // public static recaptchaApiKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
    public static recaptchaApiKey = '6Lf49tkUAAAAACrAlvp4iUPnQGgmQhlkiY-5uAUd';
    // public static 6Lf49tkUAAAAACrAlvp4iUPnQGgmQhlkiY-5uAUd
    public static dateTimeFormat = 'dd-MM-yy    HH:mm:ss'; // 'short';
    public static dateFormat = 'd-M-yy'; // 'short';
    public static monthsigTimeFormat = 'MMM-dd-yy    HH:mm:ss';
    public static timeFormatMobile = 'yyyy-MM-dd    HH:mm:ss'; // 'short';
    public static indacoinEndpoint = environment.indacoinEndpoint;
    public static ucparam = '_ucparams';
}

export class Hubs {
    public static marketHub = '/market-data';
}
export const withdrawPatterns = [
    { 'Symbol': 'BTC', 'Pattern': '^[13]{1}[0-9a-zA-Z]{30,38}$' },
    { 'Symbol': 'DTEP', 'Pattern': '^[D]{1}[0-9a-zA-Z]{33,34}$' },
    { 'Symbol': 'LTC', 'Pattern': '^[L3]{1}[0-9a-zA-Z]{33}$' },
    { 'Symbol': 'XRP', 'Pattern': '^[r]{1}[0-9a-zA-Z]{33,34}$' },
    { 'Symbol': 'DASH', 'Pattern': '^[X7]{1}[0-9a-zA-Z]{33,34}$' },
    { 'Symbol': 'ADA', 'Pattern': '^[4DA]{1}[0-9a-zA-Z]{30,114}$' },
    { 'Symbol': 'ETH', 'Pattern': '^[0x]{2}[0-9a-fA-F]{40}$' },
    { 'Symbol': 'XLM', 'Pattern': '^[G]{1}[0-9a-zA-Z]{55,56}$' },
    { 'Symbol': 'NEO', 'Pattern': '^(AN)[0-9a-zA-Z]{32,34}$' },
    { 'Symbol': 'USDT', 'Pattern': '^^[13]{1}[0-9a-zA-Z]{30,38}$' },
    { 'Symbol': 'FTR', 'Pattern': '^[G]{1}[0-9a-zA-Z]{55,56}$' },
    { 'Symbol': 'TRX', 'Pattern': '^((T)|(41))[0-9a-zA-Z]{28,50}$' },
    { 'Symbol': 'BTT', 'Pattern': '^((T)|(41))[0-9a-zA-Z]{28,50}$' },
    { 'Symbol': 'XRP', 'Pattern': '^(r)[0-9a-zA-Z]{24,34}$' },
    { 'Symbol': 'EOS', 'Pattern': '^[a-zA-Z0-9]{12,12}$' },
    { 'Symbol': 'BCH', 'Pattern': '^((bitcoincash:)?[pq])[a-z0-9]{38,45}|[13]{1}[0-9a-zA-Z]{30,38}$' },
    { 'Symbol': 'ETC', 'Pattern': '^[0x]{2}[0-9a-fA-F]{40}$' },
    { 'Symbol': 'NEO', 'Pattern': '^(A)[0-9a-zA-Z]{32,34}$' },
    { 'Symbol': 'QTUM', 'Pattern': '^(Q)[0-9a-zA-Z]{30,38}$' },
];

export const memoSettings: MemoInterface = {
    'XRP': {
        label: 'XRPdestinationTag',
        memo: 'Tag'
    },
    'XLM': {
        label: 'RecipientXLMMEMO',
        memo: 'MEMO',
    },
    'FTR': {
        label: 'RecipientFTRMEMO',
        memo: 'Memo',
    },
    'EOS': {
        label: 'RecipientEOSMEMO',
        memo: 'Memo',
    },
};
export const disabledDeposit: any = {
    'FTR': true
};
export interface MemoInterface {
    [index: string]: {
        label: string,
        memo: string
    };
}

export const chartLangSettings: ChartInterface = {
    'en': {
        lang: 'en'
    },
    'ru': {
        lang: 'ru'
    },
    'zh': {
        lang: 'zh'
    },
    'tw': {
        lang: 'tw'
    },
    'ja': {
        lang: 'ja'
    },
    'de': {
        lang: 'de'
    },
    'pt': {
        lang: 'pt'
    },
    'it': {
        lang: 'it'
    },
    'es': {
        lang: 'es'
    },
    'fr': {
        lang: 'fr'
    },
    'vi': {
        lang: 'vi'
    },
    'he_IL': {
        lang: 'he_IL'
    },
    'fa': {
        lang: 'fa'
    },
    'cs': {
        lang: 'cs'
    },
    'th': {
        lang: 'th'
    },
    'ko': {
        lang: 'ko'
    },
    'tr': {
        lang: 'tr'
    },
};
export interface ChartInterface {
    [index: string]: {
        lang: string
    };
}

export const leverageCurriencies = [
  {name: 'btc(-1)', id: 20},
  {name: 'btc(-10)', id: 19},
  {name: 'btc(10)', id: 18}
];

// ##############Indacoin Currencies rate  per USD############## //
export class IndacoinConfigs {
    // public static IndacoinCurricesList = ['eur', 'usd', 'rub', 'aud', 'gbp', 'sek', 'cad', 'chf', 'dkk', 'pln', 'czk', 'nok'];
    public static indacoinRestrictCoins = ['dtep', 'ftr', 'btt', 'usdt', 'qtum', 'bch'];
    // public static MinIndacoinRate = 50;
    // public static MaxIndacoinRate = 6000;
    public static indacoinCurrencyRatePerDollar = [
        { name: 'eur', min: 30, max: 6000 },
        { name: 'usd', min: 30, max: 6000 },
        { name: 'rub', min: 500, max: 180000 },
        { name: 'aud', min: 30, max: 6000 },
        { name: 'gbp', min: 30, max: 6000 },
        { name: 'sek', min: 30, max: 6000 },
        { name: 'cad', min: 30, max: 6000 },
        { name: 'chf', min: 30, max: 6000 },
        { name: 'dkk', min: 30, max: 6000 },
        { name: 'pln', min: 30, max: 6000 },
        { name: 'czk', min: 30, max: 6000 },
        { name: 'nok', min: 30, max: 6000 }
    ];
}
// ##############End Indacoin Section#############//
// ##### info to know beofore adding new currency or pairs#####
// ##pair_table##
// with which currencies did they have pair

// ##currenc_tabe##
// min_withdraw
// withdraw_fee
// min_confirmation

