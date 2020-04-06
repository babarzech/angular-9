import { Storage } from '../helpers/storage';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../config/config';

export class Nationallities {
  private static readonly key: string = 'nationallity-data';
  public static nationallities;
  public static init(http: HttpClient, callBack?: () => void) {
    if (Storage.exists(this.key)) {
        this.initNationallity();
        if (callBack) {
            callBack();
        }
    } else {
        http.get(AppSettings.apiEndpoint + 'get-nationallity').subscribe(
            resp => {
                Storage.set(this.key, JSON.stringify(resp));
                this.initNationallity();
                if (callBack) {
                    callBack();
                }
            }
        );
    }
  }
  private static initNationallity() {
    this.nationallities = JSON.parse(Storage.get(this.key));
  }
}

