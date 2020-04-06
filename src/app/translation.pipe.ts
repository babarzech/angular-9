import { Pipe, PipeTransform } from '@angular/core';
import { Storage } from './helpers/storage';
import { TranslationInit } from './helpers/languageservice';
import { NotificationHelper } from './helpers/notificationhelper';

@Pipe({
  name: 'tx',
  pure: false
})
export class TranslationPipe implements PipeTransform {
  public lang: any = {};
  public backupLang: any = {};
  constructor() {
    // this.lang = JSON.parse(Storage.get('appLang'));
    // this.backupLang = JSON.parse(Storage.get('appLangBackUp'));
    const x = TranslationInit.GetParsedTranslation();
    this.lang = x.CTranslation;
    this.backupLang = x.BackupTransl;
    if (this.backupLang == null) {
      this.backupLang = this.lang;
    }
  }
  transform(value: any, args = null): string {

    if (value === null) {
      return;
    }
    if (this.lang === null && this.backupLang == null) {
      return value;
    }
    const orgvalue = value;
    value = value.toLowerCase();

    const clang_translation = this.lang[value];
    const blang_translation = this.backupLang[value];

    // Injecting dynimic value
    if (args !== null) {
      if (clang_translation === '' || clang_translation === null || clang_translation === undefined) {
        if (blang_translation === '' || blang_translation === null || blang_translation === undefined) {
          return orgvalue;
        } else {
          return NotificationHelper.TransformComplexStx(blang_translation, args);
        }
      }
      return NotificationHelper.TransformComplexStx(clang_translation, args);
    }

    return clang_translation !== undefined ? clang_translation :
      this.backupLang != null && blang_translation !== undefined ? blang_translation : orgvalue;
  }
}
