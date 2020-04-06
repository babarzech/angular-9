import { Injectable } from '@angular/core';
import { ApiCall } from '../helpers/apicall';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Pair } from '../models/market';

@Injectable()
export class Order {
    public id: number;
    public quantity: number;
    public quantityRemaining: number;
    public rate: number;
    public pricePerUnit: number;
    public filled: number;
    public totalFill: number;
    public commissionPaid: number;
    public type: OrderType;
    public status: OrderStatus;
    public date: string;
    public OrderType: oType;
    public trendUp: boolean;
}
export enum OrderType {
    Buy,
    Sell
}
export enum oType {
    Market,
    Limit,
    'Stop-limit',
    'Coco-Limit',
    'Coco-Stop'
}


export enum OrderStatus {
    Active, Completed, Cancelled, OnHold, __
}

export class Orders {
    public static http;
    public static router;
    public static model: any = {};
    public static init(http: HttpClient, router: Router) {
        this.http = http;
        this.router = router;

    }
    public static cancelOrder(orderIds: number[], callBack?: (data) => void) {
        if (orderIds.length > 0) {
            const apiCaller = new ApiCall(this.http, this.router);
            apiCaller.authenticate = true;
            apiCaller.method = 'POST';
            apiCaller.endPoint = 'trade/cancel-order';
            apiCaller.encryptBody = false;
            apiCaller.body = { Ids: orderIds.join(',') };
            apiCaller.send(
                success => {
                    callBack(success);
                },
                error => {
                }
            );
        }
    }
    public static getUserOrders(pair: Pair, callBack?: (data) => void) {
        if (pair !== null) {
            const apiCaller = new ApiCall(this.http, this.router);
            apiCaller.authenticate = true;
            apiCaller.method = 'POST';
            apiCaller.encryptBody = false;
            apiCaller.endPoint = 'trade/get-user-orders';
            apiCaller.body = { PairId: pair.id };
            apiCaller.send(
                success => {
                    callBack(success);
                },
                error => {
                }
            );
        }
    }
    public static getMyOrders(callBack) {
        this.model['marketCurrency'] = 0;
        this.model['baseCurrency'] = 0;
        this.model['side'] = 3;
        this.model['Submit'] = 0;
        this.model['type'] = 1;
        this.model['Date'] = 'null';
        const apiCaller = new ApiCall(this.http, this.router);
        apiCaller.method = 'POST';
        apiCaller.encryptBody = false;
        apiCaller.body = this.model;
        apiCaller.authenticate = true;
        apiCaller.endPoint = 'trade/user-orders';
        apiCaller.send(
            success => {
                const orderhistory = [];
                if (success.Result != null) {
                    success.Result.forEach(order => {
                        orderhistory.push(order);
                        // if (order[9] === 1 || order[9] === 2) {
                        //       orderhistory.push(order);
                        //   }
                    });
                }
                callBack(orderhistory);
            },
            error => {

            }
        );
    }
    public static getUserHistoryOrders(pair: Pair, callBack?: (data) => void) {
        if (pair !== null) {
            const apiCaller = new ApiCall(this.http, this.router);
            apiCaller.authenticate = true;
            apiCaller.method = 'POST';
            apiCaller.encryptBody = false;
            apiCaller.endPoint = 'trade/get-user-history-orders';
            apiCaller.body = { PairId: pair.id };
            apiCaller.send(
                success => {
                    callBack(success);
                },
                error => {
                }
            );
        }
    }
    public static mergeOrder(orders: Order[], order: Order): Order[] {
        let found = false;
        orders.forEach(function (_order, index) {
            if (_order.rate === order.rate) {
                orders[index].quantity += order.quantity;
                found = true;
                return;
            }
        });
        if (found === false) {
            orders.unshift(order);
        }
        return orders;
    }
}
