import { Storage } from '../helpers/storage';
import { ChartConfiguration } from '../config/chartconfig';

export const CurrentAvilableLang = ['en', 'ja', 'zh', 'ko', 'pt', 'ru'];

export class LanguageManager {

  // ---------------------------- Get Symbol of current select language --------------------------
  public static getURISym() {

    const spliturl = window.location.href.split('/');
    const _sym = spliturl[3];

    if (CurrentAvilableLang.includes(_sym)) {
      return _sym;
    }

    return null;

  }

  // ---------------------------- Get Symbol of current select language or default --------------------------
  public static getCLangSym() {

    let _currentLanguage = localStorage.getItem('Clang');

    if (_currentLanguage === null || _currentLanguage === '' || _currentLanguage === undefined) {

      const _uriSym = LanguageManager.getURISym();

      if (_uriSym !== null && _uriSym !== undefined && _uriSym !== '') {

        _currentLanguage = _uriSym;

      } else {

        _currentLanguage = 'en';

      }

    }

    return _currentLanguage;

  }

  // ---------------------------- Get valid language symbol to be set in url in app.moudule.ts --------------------------
  public static ReturnValidLang() {

    let validLang = 'en';

    const _uriSym = LanguageManager.getURISym();

    if (_uriSym !== null && _uriSym !== undefined && _uriSym !== '') {

      if (_uriSym !== Storage.readCookie('language') || _uriSym !== localStorage.getItem('Clang')) {

        Storage.eraseCookie('language');
        Storage.remove('Clang');
        Storage.remove('appLang');
        Storage.remove('appLangBackUp');
        Storage.set('returnurl', '/BTC-USDT');

      }

      validLang = _uriSym;

    } else {

      validLang = ((Storage.readCookie('language') === null) ? 'en' : (Storage.readCookie('language')));
      if (validLang !== Storage.readCookie('language')) {

        Storage.eraseCookie('language');
        Storage.remove('Clang');
        Storage.remove('appLang');
        Storage.remove('appLangBackUp');

      }
      Storage.set('returnurl', '/BTC-USDT');

    }


    if (validLang !== Storage.readCookie('language')) {
      Storage.eraseCookie('language');
      Storage.remove('Clang');
      Storage.remove('appLang');
      Storage.remove('appLangBackUp');
    }


    ChartConfiguration.defaultConfig.locale = validLang.toString();
    ChartConfiguration.defaultConfig2.locale = validLang.toString();
    return validLang;
  }

}


export class TranslationInit {
  public static CurrentTranslation: any = {};
  public static BackUpTranslation: any = {};
  public static IsSet: Boolean = false;
  constructor() {

  }

  public static GetParsedTranslation() {

    while (!TranslationInit.IsSet) {
      TranslationInit.SetForParsingTranslationAuto();
    }
    return  {
              CTranslation: TranslationInit.CurrentTranslation,
              BackupTransl: TranslationInit.BackUpTranslation
            };
  }

  public static SetForParsingTranslationAuto() {
    if (Storage.exists('appLang') && Storage.exists('appLangBackUp')) {
      TranslationInit.CurrentTranslation = JSON.parse(Storage.get('appLang'));
      TranslationInit.BackUpTranslation = JSON.parse(Storage.get('appLangBackUp'));
      TranslationInit.IsSet = true;
    }
  }

  public static SetForParsingTranslation ( CT, BT ) {
    if (CT === null || CT === undefined || BT === null || BT === undefined ) {
      TranslationInit.IsSet = false;
      return;
    }else {
      TranslationInit.CurrentTranslation = CT;
      TranslationInit.BackUpTranslation = BT;

      TranslationInit.IsSet = true;
    }
  }

  public static IsTransSet () {
    return TranslationInit.IsSet;
  }

}


