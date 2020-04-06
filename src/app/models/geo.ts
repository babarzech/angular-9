
import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../config/config';
import { Storage } from '../helpers/storage';

export class Geo {
  private static http: HttpClient;
  private static data = {};
  private static localKey = 'geo_data';
  public static init(http: HttpClient, done: () => void) {
    this.http = http;
    this.initCountries(done);
  }
  public static initCountries(done: () => void) {
    if (Storage.exists(this.localKey)) {
      this.data = JSON.parse(Storage.get(this.localKey));
      done();
    } else {
      this.http.get(AppSettings.apiEndpoint + 'geo/countries').subscribe(
        resp => {
          const Ids = resp['Result']['I'];
          const Names = resp['Result']['N'];
          this.data = {};
          for (let i = 0; i < Ids.length; i++) {
            this.data[Ids[i]] = {
              n: Names[i],
              d: {}
            };
          }
          this.save();
          done();
        }
      );
    }
  }
  private static save() {
    Storage.set(this.localKey, JSON.stringify(this.data));
  }
  public static getData() {
    return this.data;
  }
  public static getRegions(countryId: number, callback: () => void) {
    if (this.data[countryId]['d'].length > 0) {
      callback();
    } else {
      this.http.get(AppSettings.apiEndpoint + 'geo/regions/' + countryId).subscribe(
        resp => {
          const Ids = resp['Result']['I'];
          const Names = resp['Result']['N'];
          for (let i = 0; i < Ids.length; i++) {
            this.data[countryId]['d'][Ids[i]] = {
              n: Names[i],
              d: {}
            };
          }
          this.save();
          callback();
        }
      );
    }
  }
  public static getCities(countryId: number, regionId: number, callback: () => void) {
    if (this.data[countryId]['d'][regionId]['d'].length > 0) {
      callback();
    } else {
      this.http.get(AppSettings.apiEndpoint + 'geo/cities/' + regionId).subscribe(
        resp => {
          const Ids = resp['Result']['I'];
          const Names = resp['Result']['N'];
          for (let i = 0; i < Ids.length; i++) {
            this.data[countryId]['d'][regionId]['d'][Ids[i]] = Names[i];
          }
          this.save();
          callback();
        }
      );
    }
  }
}
