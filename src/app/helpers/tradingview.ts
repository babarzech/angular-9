import { HttpClient } from '@angular/common/http';
import { AppSettings } from '../config/config';
import { ChartConfiguration } from '../config/chartconfig';
import { Pairs } from '../models/market';
import { Storage } from '../helpers/storage';
import { TradeComponent } from '../trade/trade.component';
// import { SocketJob } from './socketjob';


export class DataFeed {
  public static supportedResolutions = [
    '1', '5', '10', '15', '30', '60', '120', '180', '360', '720', 'D', '2D', '3D', 'W', '3W', 'M', '6M'
  ];

  private static currentTickerBarCount = 0;
  private static onRealtimeUpdate;
  private static lastBar;
  public static lastClose;
  public static resolution;
  public static candleUpdate;
  private static parent: TradeComponent;
  private static currentCandle: ICandle = null;
  private static timeoutForMarket;
  // private static socketJobRef: SocketJob;
  public static config = {
    supported_resolutions: DataFeed.supportedResolutions
  };
  public static http: HttpClient;

  public static init(http: HttpClient, _parent: TradeComponent) {
    this.http = http;
    this.parent = _parent;
  }
  public static onReady(cb) {
    //console.log('tradingViewReady');
    setTimeout(() => {
      cb(this.config);
    });
  }
  public static searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
    console.log('=== Search Symbol running');
  }
  public static resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    // console.log('======resolveSymbol running');
    const split_data = symbolName.split(/[:/]/);
    // console.log(symbolName);
    // console.log(split_data);
    const symbol_stub = {
      name: symbolName,
      description: '',
      type: 'crypto',
      session: '24x7',
      // timezone: 'Etc/UTC',
      ticker: symbolName,
      exchange: null, // split_data[0],
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ["1", "5", "10", "15", "30", "60", "120", "180", "360", "720", "1D", "2D", "3D", "1W", "3W", "1M", "6M"],
      // supported_resolution: this.supportedResolutions,
      volume_precision: 8,
      data_status: 'streaming',
    };
    // console.log(symbol_stub);
    // console.log();
    symbol_stub.pricescale = Math.pow(10, Pairs.getPairByName(symbolName).basePrecision);
    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub);
      // console.log('Resolving that symbol....', symbol_stub);
    }, 0);
  }
  public static getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
    this.resolution = resolution;
    //console.log("get Bars " + resolution)
    try {
      this.http.get(AppSettings.apiEndpoint + 'chart/history?resolution=' + resolution + '&symbol=' + symbolInfo.name +
        '&from=' + from + '&to=' + to
      ).subscribe(
        (bars: any) => {
          // console.log(bars);
          const bars_1 = [];
          if (bars.c !== undefined) {
            bars.c.forEach((el, i) => {
              const bar = {
                time: bars.t[i] * 1000,
                low: bars.l[i],
                high: bars.h[i],
                open: bars.o[i],
                close: bars.c[i],
                volume: bars.v[i]
              };
              bars_1.push(bar);
              this.lastBar = bar;
              this.lastClose = bar.close;
            });
          }
          onHistoryCallback(bars_1, { noData: !bars_1.length });
        },
        error => {
          // console.log('error', error);
        },
        () => {
          // console.log('complete');
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  private static getEmptyCandle(): ICandle {
    return {
      time: 0,
      low: 0,
      high: 0,
      open: 0,
      close: 0,
      volume: 0
    };
  }
  private static getCurrentCandleTime(): number {
    const dt = new Date();
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes()).getTime();
  }
  public static subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
    // console.log('=====subscribeBars runnning resolution: '+resolution);
    Storage.set('tradingViewResolution', resolution);
    this.resolution = resolution;
    this.onRealtimeUpdate = onRealtimeCallback;
    if (resolution === 'D') {
      this.currentTickerBarCount = 1440;
    } else {
      this.currentTickerBarCount = resolution;
    }
    this.candleUpdate.chartCandleUpdates(resolution);
    // ChartResolutionChange.resolutionChanged(resolution);
    // this.parent.sock .chartCandleUpdates(resolution);
    // this.parent.connectToSocket(this.parent.mainPair);
    // this.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
  }
  public static unsubscribeBars(subscriberUID) {
    // console.log('=====unsubscribeBars running');
    // 	stream.unsubscribeBars(subscriberUID)
  }
  public static dataUpdateRate(rate) {
    // return;
    if (Number(this.resolution) === 1) {
      return;
    }
    if (this.lastBar === undefined) {
      return;
    }
    try {
      let high: number = 0;
      let low: number = 0;
      if (rate.high > this.lastBar.high) {
        high = rate.high;
      } else {
        high = this.lastBar.high;
      }
      if (rate.low < this.lastBar.low) {
        low = rate.low;
      } else {
        low = this.lastBar.low;
      }
      const dt = {
        time: this.lastBar.time,
        low: low,
        high: high,
        open: this.lastBar.open,
        close: Number(rate),
        volume: this.lastBar.volume
      };
      this.lastBar.close = this.lastClose;
      this.onRealtimeUpdate(this.lastBar);
      this.lastBar = dt;
      this.lastClose = dt.close;
      this.onRealtimeUpdate(dt);
    } catch (err) {
      // console.log(err);
    }
  }
  public static resetCandle() {
    if (this.currentCandle !== null) {
      this.currentCandle = this.getEmptyCandle();
    }
  }
  public static onMarketHistory(trades: any[]) {
    if (Number(this.resolution) !== 1 || trades.length < 1) {
      return;
    }
    const time = this.getCurrentCandleTime();
    if (this.currentCandle === null || this.currentCandle === undefined || time > this.currentCandle.time) {
      this.currentCandle = this.getEmptyCandle();
    }
    this.currentCandle.time = time;
    const rates = [];
    trades.forEach(ord => {
      if (new Date(ord[2]).getTime() >= time) {

        this.currentCandle.close = Number(ord[0]);
        this.currentCandle.volume += this.currentCandle.close * Number(ord[1]);
        this.currentCandle.high = this.currentCandle.close > this.currentCandle.high ? this.currentCandle.close : this.currentCandle.high;
        this.currentCandle.low = (this.currentCandle.low <= 0 || this.currentCandle.close < this.currentCandle.low) ?
          this.currentCandle.close : this.currentCandle.low;
        rates.push(this.currentCandle.close);
      }
    });
    if (this.currentCandle.open === 0 && rates.length > 0) {
      this.currentCandle.open = Number(rates[rates.length - 1]);
    }
    if (this.currentCandle.close > 0) {
      try {
        if (this.timeoutForMarket !== undefined && this.timeoutForMarket != null) {
          clearInterval(this.timeoutForMarket);
        }
        this.onRealtimeUpdate(this.currentCandle);
      } catch (er) {
        this.timeoutForMarket = setTimeout(() => {
          this.onRealtimeUpdate(this.currentCandle);
        }, 4000);
      }
    }
  }
  public static onPriceBarUpdate(data) {
    this.lastBar = data;
    this.onRealtimeUpdate(this.lastBar);
    // try {
    //   if (this.resolution === '1' || this.resolution === 1) {
    //   }
    // } catch (er) {
    //   console.log("update err " + er)
    // }
  }
  // calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
  // 	//optional
  // 	console.log('=====calculateHistoryDepth running')
  // 	// while optional, this makes sure we request 24 hours of minute data at a time
  // 	// CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
  // 	return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
  // },
  // getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
  // 	//optional
  // 	console.log('=====getMarks running')
  // },
  // getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
  // 	//optional
  // 	console.log('=====getTimeScaleMarks running')
  // },
  public static getServerTime(cb) {
    // console.log('=====getServerTime running');
  }
  private static getLowPrice(value1: number, value2: number): number {
    const result = value1 - value2;
    if (result >= 0) {
      return value2;
    } else {
      return value1;
    }
  }
  private static getHighPrice(value1: number, value2: number): number {
    const result = value1 - value2;
    if (result >= 0) {
      return value1;
    } else {
      return value2;
    }
  }
}
interface ICandle {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume: number;
}
