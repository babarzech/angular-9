
import { Pairs, Pair, Wallet, Wallets } from '../models/market';
import * as signalR from '@aspnet/signalr';
import { AppSettings, Hubs } from '../config/config';
import { Order, OrderStatus } from '../models/order';
import { CommonJs } from '../helpers/commonfunctions';
import { ApiCall } from '../helpers/apicall';
import { Notification, NotificationType } from '../helpers/notification';
import * as signalRMsg from '@aspnet/signalr-protocol-msgpack';
import { DataFeed } from '../helpers/tradingview';
import { TradeComponent } from '../trade/trade.component';
import { UserOrdersComponent } from '../trade/user-orders/user-orders.component';
import { Storage } from '../helpers/storage';
import { ChartConfiguration } from '../config/chartconfig';
// import { ExpandOperator } from 'rxjs/operators/expand';

export class SocketJob {
    private static socketConnection: signalR.HubConnection;
    private static lastPair: Pair;
    private static parent: TradeComponent;
    private static userOrders: UserOrdersComponent;
    private static lock = false;
    private static manualClose = false;
    public static processedOrder = [];
    public static pairinConnection: Pair;
    public static NewPriceBarUrl = 'NewPriceBar/';
    public static resolution = null;
    public static connectionInit = false;
    public custommsg;

    public static init(
        _parent: TradeComponent,
        pair: Pair, onOrderUpdate: (data) => void,
        onTickerUpdate: (data) => void,
        error = false,
    ): void {
        DataFeed.candleUpdate = SocketJob;
        this.parent = _parent;
        // try {
        //   // this.socketConnection.send('JoinPairChannel', this.lastPair.name);
        //   // this.userAuth(pair);
        // } catch (err) { }
        this.NewPriceBarUrl = 'NewPriceBar/';
        this.resolution = Storage.get('tradingViewResolution');
        // this.chartCandleUpdates();
        // if (this.resolution === null) {
        //     this.NewPriceBarUrl = this.NewPriceBarUrl + this.parent.mainPair.id + '_' + ChartConfiguration.defaultConfig2.interval;
        // }
        // if (this.resolution === '1') {
        //     this.NewPriceBarUrl = this.NewPriceBarUrl + this.parent.mainPair.id;
        // } else {
        //     this.NewPriceBarUrl = this.NewPriceBarUrl + this.parent.mainPair.id + '_' + this.resolution;
        // }
        try {
            if (!error) {
                this.manualClose = !error;
                this.socketConnection.stop();
            }
        } catch (err) {
            this.manualClose = false;
        }
        try {
            this.socketConnection.stop(); // .done(() => {  })
        } catch (err) { }
        const dt = Date.now();
        this.socketConnection = new signalR.HubConnectionBuilder().withHubProtocol(new signalRMsg.MessagePackHubProtocol())
            .withUrl(AppSettings.socketEndpoint + Hubs.marketHub, {
              skipNegotiation: true,
              transport: signalR.HttpTransportType.WebSockets
            })
            .configureLogging({
                log: (level, msg) => {
                }
            })
            .build();

        // this.socketConnection.stop();
        // this.socketConnection.b
        // this.socketConnection.serverTimeoutInMilliseconds = 1000 * 60 * 10; // 1 second * 60 * 10 = 10 minutes.
        this.socketConnection.serverTimeoutInMilliseconds = 8000;
        this.socketConnection.keepAliveIntervalInMilliseconds = 4000;
        this.socketConnection.start().then(() => {
            // this.socketConnection['mainPair'] = pair.name;
            // this.socketConnection.serverTimeoutInMilliseconds = 7000;
            // if (pair.name !== this.parent.mainPair.name) {
            //     SocketJob.destroy();
            //     SocketJob.init(_parent, this.parent.mainPair, onOrderUpdate, onTickerUpdate, true);
            //     return;
            // }
            // if (this.parent.mainPair.name !== pair.name) {
            //     return;
            // }

            this.pairinConnection = pair;
            this.connectionInit = true;
            // if (pair.name === this.parent.mainPair.name) {
            //     this.parent.reInitOrderBookd();
            // }

            this.parent.socketstatus = true;
            this.joinPairChannel(this.parent.mainPair);
        }).catch(err => {
            if (this.manualClose === true) {
                this.manualClose = false;
            } else {
                this.lock = true;
                setTimeout(() => {
                    if (this.lock === true) {
                        this.lock = false;
                        SocketJob.init(_parent, this.parent.mainPair, onOrderUpdate, onTickerUpdate, true);
                        this.parent.socketstatus = false;
                    }
                }, 2000);
            }
        });
        this.socketConnection.on('UserOrderUpdates', data => {
            // console.log('user tsdfd');
            this.processUserOrder(data);
            this.parent.checkOrderExits();
        });
        this.socketConnection.on('WalletUpdate', data => {
            data = JSON.parse(data);
            if (data[4] === true) {
                data.forEach(dtt => {
                    this.parent.wallets[dtt[1]].available = Number(dtt[2]);
                    this.parent.wallets[dtt[1]].balance = Number(dtt[3]);
                });
            } else {
                data.forEach(dtt => {
                    this.parent.wallets[dtt[1]].available = Number(dtt[2]);
                    this.parent.wallets[dtt[1]].balance = Number(dtt[3]);
                });
            }
            Wallets.updateBtcBalance();
        });
        this.socketConnection.on('TickerUpdates', data => {
            data = JSON.parse(data);
            // this.parent.tickerRate = data[0][5];
            // onTickerUpdate(data);
            this.parent.onTickerUpdates(data);
        });
        this.socketConnection.onclose(err => {
            this.parent.socketstatus = false;
            setTimeout(() => {
                if (this.lock !== true && this.parent.socketstatus === false) {
                    this.lock = false;
                    SocketJob.init(_parent, this.parent.mainPair, onOrderUpdate, onTickerUpdate, true);
                    this.parent.socketstatus = false;
                }
            }, 2000);
            // if (this.manualClose === true) {
            //     this.manualClose = false;
            // } else {
            //     setTimeout(() => {
            //         if (this.parent.mainPair.name !== pair.name) {
            //             if (this.socketConnection.state) {
            //                 this.socketConnection.stop();
            //                 return;
            //             }
            //             return;
            //         }
            //         if ((this.parent.mainPair.name === pair.name) && this.socketConnection.state) {
            //             return;
            //         }
            //         SocketJob.init(_parent, pair, onOrderUpdate, onTickerUpdate, true);
            //     }, 5000);
            // }
        });
        this.lastPair = pair;

    }
    public static joinPairChannel(pair: Pair) {
        // tslint:disable-next-line: prefer-const
        let t = this;
        if (t.socketConnection.state) {
            t.socketConnection.send('JoinPairChannel', this.parent.mainPair.id);
            if (this.parent.isLogin) {
                t.userAuth(pair);
            }
            // console.log('join pair channel');
            if (this.parent.socketstatus) {
                t.destroyAllEvents();
            }
        }
    }
    public static destroyAllEvents() {
        if (SocketJob.socketConnection) {
            if (this.socketConnection.state) {
                // console.log('destorying events');
                this.socketConnection.off('OrderUpdates/' + this.parent.prevPair[1]);
                this.socketConnection.off('OrderUpdates/' + this.parent.prevPair[1]);
                this.socketConnection.off(this.NewPriceBarUrl);
                this.socketConnection.off('OrderHistoryUpdates/' + this.parent.prevPair[1]);
                // this.socketConnection.off('UserOrderUpdates');
                // this.socketConnection.off('WalletUpdate');
                // this.socketConnection.off('message');
                // this.socketConnection.off('WalletUpdate');
                // this.socketConnection.off('TickerUpdates');
            }
        }
        this.reinitAllEvents();
        // this.socketConnection.on('OrderUpdates/' + this.parent.mainPair.id, data => {
        //     console.log('order updates came', data);
        //     // this.onOrderUpdate(JSON.parse(data));
        //     this.parent.checkOrderExits();
        // });
    }
    public static chartCandleUpdates(resolution?) {
        if (this.socketConnection.state) {
            this.socketConnection.off(this.NewPriceBarUrl);
        }
        this.NewPriceBarUrl = 'NewPriceBar/';
        if (CommonJs.isNotEmpty(resolution)) {
            this.resolution = resolution;
        }
        // SocketJob.resolution = Storage.get('tradingViewResolution');
        if (this.resolution === null) {
            this.NewPriceBarUrl = this.NewPriceBarUrl +
                this.parent.mainPair.id + '_' + ChartConfiguration.defaultConfig2.interval;
        }
        if (this.resolution === '1') {
            this.NewPriceBarUrl = this.NewPriceBarUrl + this.parent.mainPair.id;
        } else {
            this.NewPriceBarUrl = this.NewPriceBarUrl + this.parent.mainPair.id + '_' + this.resolution;
        }
        // if (CommonJs.isNotEmpty(resolution)) {
        this.socketConnection.on(this.NewPriceBarUrl, data => {
            // console.log('chart update came');
            data = JSON.parse(data);
            DataFeed.onPriceBarUpdate({
                time: data[6] * 1000, // ms
                low: Number(data[4]),
                high: Number(data[3]),
                open: Number(data[1]),
                close: Number(data[2]),
                volume: Number(data[5])
            });
        });
        // }
    }

    public static reinitAllEvents() {
        this.socketConnection.on('OrderUpdates/' + this.parent.mainPair.id, data => {
            // console.log('order updates came');
            // onOrderUpdate(JSON.parse(data));
            this.parent.onOrderUpdate(JSON.parse(data));
            this.parent.checkOrderExits();
        });
        this.socketConnection.on(this.NewPriceBarUrl, data => {
            // console.log('chart update came');
            data = JSON.parse(data);
            DataFeed.onPriceBarUpdate({
                time: data[6] * 1000, // ms
                low: Number(data[4]),
                high: Number(data[3]),
                open: Number(data[1]),
                close: Number(data[2]),
                volume: Number(data[5])
            });
        });
        this.socketConnection.on('OrderHistoryUpdates/' + this.parent.mainPair.id, data => {
            data = JSON.parse(data);
            // if(DataFeed.resolution === '1'){
                DataFeed.onMarketHistory(data);    
            // }
            
            data.forEach(ord => {
                const order = new Order();
                order.rate = Number(ord[0]); // .R;
                order.quantity = Number(ord[1]); // .Q;
                order.date = ord[2];
                order.trendUp = ord[3];
                // order.type = ord[1]; // .T;
                // const d = new Date();
                // order.date = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

                this.parent.historyOrders.unshift(order);

                if (this.parent.historyOrders.length > 60) {
                    this.parent.historyOrders.splice(-1, 1);
                }
                // if (ord.T === OrderType.Buy) {
                //   this.parent.historyBuyOrders.unshift(order);
                // } else {
                //   this.parent.historySellOrders.unshift(order);
                // }
            });
        });
        // this.socketConnection.on('message', data => {
        // });
        // this.socketConnection.on('WalletUpdate', data => {
        // });
        // this.socketConnection.on('UserOrderUpdates', data => {
        //     // console.log('user tsdfd');
        //     this.processUserOrder(data);
        //     this.parent.checkOrderExits();
        // });
        // this.socketConnection.on('WalletUpdate', data => {
        //     data = JSON.parse(data);
        //     if (data[4] === true) {
        //         data.forEach(dtt => {
        //             this.parent.wallets[dtt[1]].available = Number(dtt[2]);
        //             this.parent.wallets[dtt[1]].balance = Number(dtt[3]);
        //         });
        //     } else {
        //         data.forEach(dtt => {
        //             this.parent.wallets[dtt[1]].available = Number(dtt[2]);
        //             this.parent.wallets[dtt[1]].balance = Number(dtt[3]);
        //         });
        //     }
        //     Wallets.updateBtcBalance();
        // });
        // this.socketConnection.on('TickerUpdates', data => {
        //     data = JSON.parse(data);
        //     // this.parent.tickerRate = data[0][5];
        //     // onTickerUpdate(data);
        //     this.parent.onTickerUpdates(data);
        // });
    }
    public static destroy() {
        if (this.socketConnection !== undefined) {
            this.manualClose = true;
            this.socketConnection.stop();
            try {
                // setTimeout(() => {
                //   this.socketConnection.stop();
                // }, 100);
            } catch (err) {
            }
        }
    }
    public static detectOtherPairConnection(pair) {
        // setInterval(() => {

        // }, 500);
    }
    public static userAuth(pair: Pair) {
        const t = this;
        const data = {};
        const payload: object = ApiCall.getAuth(data);
        payload['pair'] = pair.name;
        t.socketConnection.send('UserAuth', JSON.stringify(payload));
    }
    public static processUserOrder(data) {
        data = JSON.parse(data);
        data.forEach(value => {
            const ar = [1, 2, 3, 4, 5, 13, 14];
            ar.forEach(vr => {
                value[vr] = Number(CommonJs.formatNumberComma(value[vr]));
            });
            if (value.length === 14) {
                value[14] = 0;
            }
            const cr = this.parent.mainPair[value[11] === 0 ? 'marketCurrency' : 'baseCurrency'];
            this.parent.wallets[cr.id].balance += value[14]; // .Bi;
            this.parent.wallets[cr.id].available += value[14]; // .Bi;
            if (value[7] === OrderStatus.Completed) {
                // this.parent.userOrders.forEach(ord => {
                //   if (ord.id === value[0]) {
                //     this.parent.userOrders.splice(this.parent.userOrders.indexOf(ord), 1);
                //   }
                // });
                let mypair: Pair;
                // Pairs.init(this.parent.httpClient, () => {
                mypair = Pairs.getPair(value[12]);
                // });
                const symb = mypair.marketCurrency.symbol;
                const amount = value[2].toFixedFloor(mypair.marketPrecision);
                this.parent.custommsg = 'YourorderhasbeencompletelyFilled';
                if (value[9] === 0) {
                    Notification.send(
                        'Congrats',
                        this.parent.custommsg,
                        NotificationType.Success
                    );
                } else {
                    this.parent.custommsg = 'YourorderwithratehasbeencompletelyfilledwithAmount';
                    Notification.send(
                        'Congrats',
                        this.parent.custommsg,
                        NotificationType.Success,
                        60,
                        {
                            Rate: Number(value[1]).toFixedFloor(mypair.basePrecision),
                            Currency: mypair.baseCurrency.symbol,
                            Amount: Number(amount).toFixedFloor(mypair.marketPrecision),
                            Symbol: symb
                        }
                    );
                }

            } else if (value[7] === OrderStatus.Cancelled) {
                if (this.processedOrder.indexOf(value[0]) < 0) {
                    this.processedOrder.push(value[0]);
                    // this.parent.userOrders.forEach(ord => {
                    //   if (ord.id === value[0]) {
                    //     this.parent.userOrders.splice(this.parent.userOrders.indexOf(ord), 1);
                    //   }
                    // });
                    // this.parent.userOrders.splice(this.parent.userOrders.indexOf(value[0]), 1)
                    const mypair: Pair = Pairs.getPair(value[12]);
                    if (value[9] !== 0) {

                        if (value[11] === 1) {
                            Notification.send(
                                'OrderCancelled',
                                'SellOrderCancelledSuccess',
                                NotificationType.Info,
                                60,
                                { Rate: Number(value[1]).toFixedFloor(mypair.basePrecision), Currency: mypair.baseCurrency.symbol }
                            );
                        } else {
                            Notification.send(
                                'OrderCancelled',
                                'BuyOrderCancelledSuccess',
                                NotificationType.Info,
                                60,
                                { Rate: Number(value[1]).toFixedFloor(mypair.basePrecision), Currency: mypair.baseCurrency.symbol }
                            );
                        }
                    }

                }
                // else {
                // }
            }
            // if (!this.parent.userOrders) {
            //   return;
            // }
            let newOrder = true;
            this.parent.myOrders.forEach((order, index) => {
                if (order[0] === value[0]) {
                    newOrder = false;
                    this.parent.myOrders[index][7] = value[2] - value[3];
                    this.parent.myOrders[index][9] = value[7];
                    if (newOrder) {
                        this.parent.myOrders[index][0] = value[0];
                    }
                    // this.parent.userOrders[index].status = value[3] === 0 ? 1 : 0; // value[7];
                    if (value[17] !== null) {
                        value[17].forEach(fill => {
                            if (this.parent.myOrders[index][11] == null) {
                                this.parent.myOrders[index][11] = [];
                            }
                            this.parent.myOrders[index][11].push(fill);
                        });
                    }
                    const st = this.parent.calculateFillStats(this.parent.myOrders[index], 11);
                    this.parent.myOrders[index][4] = st.p; // AVERAGE
                    // this.parent.myOrders[index][7] = order[2]; // this.parent.calculateFillStats(order).p; // AVERAGE
                }
            });
            // this.parent.userOrders.forEach((order, index) => {
            //   if (order.id === value[0]) {
            //     newOrder = false;
            //     if (value[7] === OrderStatus.Cancelled) { // cancelled
            //       this.parent.userOrders[index].status = OrderStatus.Cancelled;
            //     }
            //     this.parent.userOrders[index].quantityRemaining = value[3];
            //     this.parent.userOrders[index].status = value[7];
            //     if (newOrder) {
            //       this.parent.userOrders[index].id = value[0];
            //     }
            //     this.parent.userOrders[index].status = value[3] === 0 ? 1 : 0; // value[7];
            //     this.parent.userOrders[index].filled = value[2] - value[3];
            //     this.parent.userOrders[index].totalFill = (value[2] - value[3]) * this.parent.userOrders[index].rate;
            //   }
            // });

            if ((newOrder === true && (value[7] === OrderStatus.Active ||
                value[7] === OrderStatus.OnHold))) {// || value[7] !== OrderStatus.Active) {
                // const order = new Order();
                // order.date = value[8];
                // order.rate = value[1];
                // order.quantity = value[2];
                // order.id = value[0];
                // order.filled = value[2] - value[3];
                // order.totalFill = value[14];
                // order.status = value[7] === 0 ? OrderStatus.Active : (value[7] === 1 ? OrderStatus.Completed : OrderStatus.Cancelled);
                // order.type = value[11] === 0 ? OrderType.Buy : OrderType.Sell;
                // order.quantityRemaining = value[3];
                // order.commissionPaid = value[13];
                const ord = [
                    value[0], // id
                    value[12], // pairid
                    value[9], // mainordertype
                    value[11], // ordertype
                    value['null'], // Average
                    value[1], // Rate
                    value[2], // Quantity
                    value[2] - value[3], // QuantityRemaining
                    value[9] === 2 || value[9] === 4 ? value[5] : '-', // Stopprice
                    value[7], // Status
                    value[8], // Date
                    value[17] // Fills
                ];
                this.parent.myOrders.unshift(ord);
                // order.pricePerUnit = value.PPU;
                if (newOrder && (value[7] === OrderStatus.Active || value[7] === OrderStatus.OnHold)) {

                    if (value[11] === 1) {
                        Notification.send(
                            'OrderCreated',
                            'ASellorderhasbeensuccessfullycreated',
                            NotificationType.Success
                        );
                    } else {
                        Notification.send(
                            'OrderCreated',
                            'ABuyorderhasbeensuccessfullycreated',
                            NotificationType.Success
                        );
                    }


                    // this.parent.userOrders.unshift(order);
                } else {
                    // this.parent.userHistoryOrders.unshift(order);
                }
            }
            this.parent.userOrderChild.updateFills();
        });
    }


}

// class sdfsd {
//   public ttransform(string msg, obj) {
//     foreach (obj with key => value)
//     msg = msg.replaceAll('[' + key + ']', value)
//   }
// }

// var exp = new sdfsd();
// exp.ttransform('Your Buy order with rate [Rate] has been cANCLED', {Rate: 0.84398})
