import { Injectable, Inject } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CommonJs } from './commonfunctions';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class CommonService {
    // private notify = new Subject<any>();
    public volume;
    /**
     * Observable string streams
     */
    // notifyObservable$ = this.notify.asObservable();

    constructor(public http: HttpClient) {
        this.setVolume();
    }
    setVolume() {
        this.volume = CommonJs.getTotalVolume(this.http);
    }

    // public notifyOther(data: any) {
    //     if (data) {
    //         this.notify.next(data);
    //     }
    // }
}
