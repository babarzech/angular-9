import { Storage } from '../helpers/storage';
// import { forEach } from '@angular/router/src/utils/collection';
import { TranslationInit } from './languageservice';




export class NotificationHelper {
  public static transforNotification: any = {};
  public static backupLang: any = {};

  public static escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Define functin to find and replace specified term with replacement string */
  public static replaceAll(str, term, replacement) {
    return str.replace(new RegExp(NotificationHelper.escapeRegExp(term), 'g'), replacement);
  }

  public static TransformComplexStx(msg, obj): string {
    for (const key in obj) {
      if (obj[key] !== undefined) {
        msg = NotificationHelper.replaceAll(msg, '[' + key + ']', obj[key]);
      }
    }

    return msg;
  }

  public static getMessageTranslation(key, args = null): string {
    if (key === null) {
      return;
    }
    const _orgKey = key;
    // const transforNotification = JSON.parse(Storage.get('appLang'));
    // const backupLang = JSON.parse(Storage.get('appLangBackUp'));

    // .then((x) => {
    const x = TranslationInit.GetParsedTranslation();
      this.transforNotification = x.CTranslation;
      this.backupLang = x.BackupTransl;
    // });
    if (this.backupLang == null) {
      this.backupLang = this.transforNotification;
    }

    const newKeyCheck = key.split(',,');
    const newdata = [newKeyCheck.length];


    if (args !== null) {


      key = key.toLowerCase();
      if (this.transforNotification === null) {
        if (this.backupLang === null || this.backupLang === undefined) {
          return _orgKey;
        }
        return _orgKey;
      }

      if (this.transforNotification[key] === '' || this.transforNotification[key] === null ||
        this.transforNotification[key] === undefined) {

        if (this.backupLang[key] === '' || this.backupLang[key] === null ||
          this.backupLang[key] === undefined) {
          return _orgKey;
        } else {
          const transs = this.backupLang[key];
          return NotificationHelper.TransformComplexStx(transs, args);
        }
      }

      const transs = this.transforNotification[key];
      // const StringFormat = (str: string, ...arg: string[]) =>
      //   str.replace(/{(\d+)}/g, (match, index) => arg[index] || '');

      // return StringFormat(transs, args);


      return NotificationHelper.TransformComplexStx(transs, args);
    }


    if (newKeyCheck.length > 1) {
      for (let i = 0; i < newKeyCheck.length; i++) {
        let item = newKeyCheck[i];
        const orgItem = item;
        item = item.toLowerCase().replace(/\s/g, '');
        const x = this.transforNotification[item];
        if (this.transforNotification[item] !== undefined && this.transforNotification[item] !== null) {
          newdata[i] = this.transforNotification[item];
        } else if (this.backupLang[item] !== undefined && this.backupLang[item] !== null) {
          newdata[i] = this.backupLang[item];
        } else {
          newdata[i] = orgItem;
        }
      }
      let returnNewData = '';
      newdata.forEach(element => {
        returnNewData = returnNewData + element;
      });
      return returnNewData;
    }

    key = key.toLowerCase();

    if (this.transforNotification === null) {
      if (this.backupLang === null || this.backupLang === undefined) {
        return _orgKey;
      }
      return _orgKey;
    }

    if (this.transforNotification[key] === '' || this.transforNotification[key] === null ||
      this.transforNotification[key] === undefined) {

      if (this.backupLang[key] === '' || this.backupLang[key] === null ||
        this.backupLang[key] === undefined) {
        return _orgKey;
      } else {
        return this.backupLang[key];
      }
    }
    return this.transforNotification[key];
  }
}
