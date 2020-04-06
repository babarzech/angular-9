import { Injectable } from '@angular/core';

@Injectable()
export class Redirect {
    // public static setReturnurl() {
    //     const t = (window.location.pathname).replace('/trade', '');
    //     if (t.indexOf('login') === -1 && t.length > 2) {
    //         localStorage.setItem('returnurl', t);
    //     }
    // }
    // public static getReturnurl() {
    //     return localStorage.getItem('returnurl');
    // }
    public static exists(): boolean {
        if (localStorage.getItem('returnurl') != null && localStorage.getItem('returnurl').length > 2) {
            return true;
        } else {
            return false;
        }
    }
    public static remove() {
        localStorage.removeItem('returnurl');
    }
    // public static getReturnUrl() {
    //     return (window.location.pathname).replace('/trade/', '');
    // }
    public static getReturnUrl() {
        // return (window.location.pathname).replace('/trade/', '');
        let uri = (window.location.pathname).split("/");
        let newuri = '';
        for (let i = 0; i < uri.length; i++) {
            if (i === 0 || i === 1 || i === 2) {
                continue;
            }
            newuri = newuri + uri[i] + '/';
        }
        if (newuri == undefined) {
            return '/';
        }
        return newuri;
    }
}
