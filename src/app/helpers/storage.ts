import { Injectable } from '@angular/core';

@Injectable()
export class Storage {
    public static set(name: string, value) {
        localStorage.setItem(name, value);
    }
    public static get(name: string) {
        return localStorage.getItem(name);
    }
    public static exists(name: string): boolean {
        if (localStorage.getItem(name) === null) {
            return false;
        } else {
            return true;
        }
    }
    public static remove(name: string) {
        localStorage.removeItem(name);
    }
    public static existsCookie(name: string): boolean {
        if (this.readCookie(name) === null || this.readCookie(name) === undefined) {
            return false;
        } else {
            return true;
        }
    }

    public static createCookie(name: string, value: string, days: number) {
        let expires = '';
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }

    public static readCookie(name: string) {
        let nameEQ = name + '=';
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    public static eraseCookie(name: string) {
        this.createCookie(name, '', -1);
    }
}

export class Session {
    public static set(name: string, value) {
        sessionStorage.setItem(name, value);
    }
    public static get(name: string) {
        return sessionStorage.getItem(name);
    }
    public static exists(name: string): boolean {
        if (sessionStorage.getItem(name) === null) {
            return false;
        } else {
            return true;
        }
    }
    public static remove(name: string) {
        sessionStorage.removeItem(name);
    }
}
