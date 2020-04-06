import { AppSettings, chartLangSettings } from './config';
import { Storage } from '../helpers/storage';

declare var Datafeeds: any;
export class ChartConfiguration {
  public static defaultConfig = {
    fullscreen: false,
    disabled_features: [
      'remove_library_container_border', 'symbol_search_hot_key', 'show_interval_dialog_on_key_press', 'volume_force_overlay',
      'header_settings', 'border_around_the_chart', 'left_toolbar', 'study_buttons_in_legend',
      'show_hide_button_in_legend', 'study_templates', 'header_symbol_search', 'use_localstorage_for_settings',
      'header_screenshot', 'header_compare', 'header_undo_redo',
      'display_market_status', 'legend_context_menu', 'compare_symbol', 'symbol_info', 'edit_buttons_in_legend'],
    enabled_features: ['dont_show_boolean_study_arguments', 'hide_last_na_study_output'],
    symbol: 'DTEP',
    interval: '30',
    timeframe: '7D',
    autosize: true,
    timezone: 'UTC',
    locale: 'en',
    // time_frames: [
    //   { text: "1", resolution: "1", description: "50 Years" },
    //   { text: "3y", resolution: "W", description: "3 Years", title: "3yr" },
    //   { text: "8m", resolution: "D", description: "8 Month" },
    //   { text: "3d", resolution: "5", description: "3 Days" },
    //   { text: "1000y", resolution: "W", description: "All", title: "All" },
    // ],
    // studies_access : {
    //   type: 'black',
    //   tools: [
    //     {
    //       name: 'moving average',
    //       grayed: false
    //     }
    //   ]
    // },
    // drawings_access: { tools: [] },
    // dont_show_boolean_study_arguments: false,
    toolbar_bg: '#303030',
    overrides: {
      // 'paneProperties.legendProperties.showStudyArguments': true,
      // 'paneProperties.legendProperties.showStudyTitles': true,
      // 'paneProperties.legendProperties.showStudyValues': true,
      // 'paneProperties.legendProperties.showSeriesTitle': true,
      // 'paneProperties.legendProperties.showSeriesOHLC': true,
      // 'paneProperties.legendProperties.showBarChange': true,
      // 'paneProperties.legendProperties.showOnlyPriceSource': true,
      'scalesProperties.lineColor': '#555',
      // 'paneProperties.legendProperties.showLegend': false,
      'paneProperties.background': '#171717',
      'paneProperties.vertGridProperties.color': '#111',
      'paneProperties.horzGridProperties.color': '#111',
      'symbolWatermarkProperties.transparency': 90,
      'scalesProperties.textColor': '#AAA',
      'mainSeriesProperties.candleStyle.upColor': '#00C896', // green
      'mainSeriesProperties.candleStyle.downColor': '#FB5959', // red
      'mainSeriesProperties.candleStyle.drawWick': true,
      'mainSeriesProperties.candleStyle.drawBorder': true,
      'mainSeriesProperties.candleStyle.borderColor': '#00C896',
      'mainSeriesProperties.candleStyle.borderUpColor': '#00C896',
      'mainSeriesProperties.candleStyle.borderDownColor': '#FB5959',
      'mainSeriesProperties.candleStyle.wickUpColor': '#00C896', // 'rgba( 115, 115, 117, 1)',
      'mainSeriesProperties.candleStyle.wickDownColor': '#FB5959', // 'rgba( 115, 115, 117, 1)',
      'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
      'mainSeriesProperties.hollowCandleStyle.upColor': '#00C896',
      'mainSeriesProperties.hollowCandleStyle.downColor': '#FB5959',
      'mainSeriesProperties.hollowCandleStyle.drawWick': true,
      'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
      'mainSeriesProperties.hollowCandleStyle.borderColor': '#404861',
      'mainSeriesProperties.hollowCandleStyle.borderUpColor': '#4caf50',
      'mainSeriesProperties.hollowCandleStyle.borderDownColor': '#f44336',
      'mainSeriesProperties.hollowCandleStyle.wickColor': '#404861',
      'mainSeriesProperties.haStyle.upColor': '#4caf50',
      'mainSeriesProperties.haStyle.downColor': '#f44336',
      'mainSeriesProperties.haStyle.drawWick': false,
      'mainSeriesProperties.haStyle.drawBorder': false,
      'mainSeriesProperties.haStyle.borderColor': '#CC0000',
      'mainSeriesProperties.haStyle.borderUpColor': '#4caf50',
      'mainSeriesProperties.haStyle.borderDownColor': '#f44336',
      'mainSeriesProperties.haStyle.wickColor': '#CC0000',
      'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,
      'mainSeriesProperties.barStyle.upColor': '#4caf50',
      'mainSeriesProperties.barStyle.downColor': '#f44336',
      'mainSeriesProperties.areaStyle.color1': '#2196f3',
      'mainSeriesProperties.areaStyle.color2': 'rgba(0,0,0,0)',
      'mainSeriesProperties.lineStyle.color': '#c00',
      'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0.00)',
      volumePaneSize: 'small'
    },
    loading_screen: { backgroundColor: '#171717', foregroundColor: '#171717' },
    container_id: 'chartdiv',
    datafeed: new Datafeeds.UDFCompatibleDatafeed(AppSettings.apiEndpoint + 'chart'), // ('http://18.191.14.83:1130/chart'),
    // datafeed: new Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'), // ('http://18.191.14.83:1130/chart'),
    library_path: 'assets/charting_library/',
    client_id: 'tradingview.com',
    volumePaneSize: 'tiny',
    studies_overrides: {
      'volume.volume.transparency': 50,
      'volume.volume ma.linewidth': 1,
      'volume.volume.color.0': '#FB5959',
      'volume.volume.color.1': '#00C896',
      'bollinger bands.median.color': '#f30',
      'bollinger bands.upper.linewidth': 7,
      'moving average.precision': 8
    },
    user_id: 'public_user_id'
  };

  /////// Important to activate drawing toolbar just   
  //////  remove left_toolbar from disabled features
  //////  uncomment drawings_access
  public static defaultConfig2 = {
    fullscreen: false,
    disabled_features: [
      'remove_library_container_border', 'symbol_search_hot_key', 'show_interval_dialog_on_key_press', 'volume_force_overlay',
      'header_settings', 'border_around_the_chart', 'study_buttons_in_legend',
      'show_hide_button_in_legend', 'study_templates', 'header_symbol_search', 'use_localstorage_for_settings',
      'header_screenshot', 'header_compare', 'header_undo_redo',
      'display_market_status', 'legend_context_menu', 'compare_symbol', 'symbol_info', 'edit_buttons_in_legend'],
    enabled_features: ['dont_show_boolean_study_arguments', 'hide_last_na_study_output'],
    symbol: 'DTEP',
    interval: '30',
    // timeframe: '7D',
    autosize: true,
    timezone: 'UTC',
    locale: 'en',

    // time_frames: [
    //   { text: "1", resolution: "1", description: "50 Years" },
    //   { text: "3y", resolution: "W", description: "3 Years", title: "3yr" },
    //   { text: "8m", resolution: "D", description: "8 Month" },
    //   { text: "3d", resolution: "5", description: "3 Days" },
    //   { text: "1000y", resolution: "W", description: "All", title: "All" },
    // ],
    // studies_access : {
    //   type: 'black',
    //   tools: [
    //     {
    //       name: 'moving average',
    //       grayed: true
    //     }
    //   ]
    // },

    drawings_access: {
      type: 'white',
      tools: [
        { name: 'Regression Trend' },
        { name: 'Trend Angle' },
        { name: 'Brush' },
        { name: 'Cyclic Lines' },
        { name: 'Cyclic Lines' },
        { name: 'Rectangle' },
        // Geomatry
        { name: 'Fib Circles' },
        { name: 'Fib Retracement' },
        { name: 'Fib Retracement/ko' },
        { name: 'Fib Speed Resistance Arcs' },
        { name: 'Fib Speed Resistance Fan' },
        { name: 'Fib Time Zone' },
        { name: 'Fib Wedge' },
        { name: 'Gann Box' },
        { name: 'Gann Fan' },
        { name: 'Gann Square' },
        { name: 'Inside Pitchfork' },
        { name: 'Pitchfan' },
        { name: 'Pitchfork' },
        { name: 'Schiff Pitchfork' },
        { name: 'Trend-Based Fib Extension' },
        { name: 'Trend-Based Fib Extension/ko' },
        { name: 'Trend-Based Fib Time' },
        // Marks
        { name: 'Arrow Marks' },
        { name: 'Flag Mark' },
        { name: 'Price Label' },
        { name: 'Thumb Up/Down Marks' },
        // shapes
        { name: 'Arc' },
        { name: 'Ellipse' },
        { name: 'Paint Brush' },
        { name: 'Polyline' },
        { name: 'Rectangle' },
        { name: 'Triangle' },
        // Lines and Arrays
        { name: 'Arrow' },
        { name: 'Extended Line' },
        { name: 'Extended Line/ko' },
        { name: 'Horizontal Line' },
        { name: 'Horizontal Line/ko' },
        { name: 'Horizontal Ray' },
        { name: 'Parallel Channel' },
        { name: 'Ray' },
        { name: 'Regression Trend' },
        { name: 'Trend Line' },
        { name: 'Trend Line/ko' },
        { name: 'Vertical Line' },
        // pattern and waves
        { name: 'ABCD Pattern' },
        { name: 'Elliott Major Retracement' },
        { name: 'Elliott Minor Retracement' },
        { name: 'Elliott Wave Circle' },
        { name: 'Elliott Wave Minor' },
        { name: 'Elliott Wave Subminuette' },
        { name: 'Head & Shoulders' },
        { name: 'Three Drives Pattern' },
        { name: 'Triangle Pattern' },
        { name: 'XABCD Pattern' },
        { name: 'XABCD Pattern/ko' },
        // Positions and Forecasting
        { name: 'Bars Pattern' },
        { name: 'Date Range' },
        { name: 'Forecast' },
        { name: 'Long Position' },
        { name: 'Price Range' },
        { name: 'Projection' },
        { name: 'Short Position' },
        // Text
        { name: 'Anchored Text' },
        { name: 'Balloon' },
        { name: 'Callout' },
        { name: 'Text' },
      ]
    },
    // dont_show_boolean_study_arguments: false,
    toolbar_bg: '#080c34',
    toolbar_fg: '#ffffff',
    overrides: {
      // 'paneProperties.legendProperties.showStudyArguments': true,
      // 'paneProperties.legendProperties.showStudyTitles': true,
      // 'paneProperties.legendProperties.showStudyValues': true,
      // 'paneProperties.legendProperties.showSeriesTitle': true,
      // 'paneProperties.legendProperties.showSeriesOHLC': true,
      // 'paneProperties.legendProperties.showBarChange': true,
      // 'paneProperties.legendProperties.showOnlyPriceSource': true,
      'scalesProperties.lineColor': '#555',
      // 'paneProperties.legendProperties.showLegend': false,
      'paneProperties.background': '#080c34',
      'paneProperties.vertGridProperties.color': '#080c34',
      'paneProperties.horzGridProperties.color': '#080c34',
      'symbolWatermarkProperties.transparency': 90,
      'scalesProperties.textColor': '#AAA',
      'mainSeriesProperties.candleStyle.upColor': '#284e3e', // green
      'mainSeriesProperties.candleStyle.downColor': '#550823', // red
      'mainSeriesProperties.candleStyle.drawWick': true,
      'mainSeriesProperties.candleStyle.drawBorder': true,
      'mainSeriesProperties.candleStyle.borderColor': '#00c896',
      'mainSeriesProperties.candleStyle.borderUpColor': '#00c896', //'rgba(92, 170, 78, 0.42)',
      'mainSeriesProperties.candleStyle.borderDownColor': '#fc4c4c', //'#fc4c4c',
      'mainSeriesProperties.candleStyle.wickUpColor': '#00c896', // 'rgba( 115, 115, 117, 1)',
      'mainSeriesProperties.candleStyle.wickDownColor': '#fc4c4c', // 'rgba( 115, 115, 117, 1)',
      'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
      'mainSeriesProperties.hollowCandleStyle.upColor': '#00c896',
      'mainSeriesProperties.hollowCandleStyle.downColor': '#fc4c4c',
      'mainSeriesProperties.hollowCandleStyle.drawWick': true,
      'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
      'mainSeriesProperties.hollowCandleStyle.borderColor': '#404861',
      'mainSeriesProperties.hollowCandleStyle.borderUpColor': '#00c896',
      'mainSeriesProperties.hollowCandleStyle.borderDownColor': '#f44336',
      'mainSeriesProperties.hollowCandleStyle.wickColor': '#404861',
      'mainSeriesProperties.haStyle.upColor': '#00c896',
      'mainSeriesProperties.haStyle.downColor': '#f44336',
      'mainSeriesProperties.haStyle.drawWick': false,
      'mainSeriesProperties.haStyle.drawBorder': false,
      'mainSeriesProperties.haStyle.borderColor': '#CC0000',
      'mainSeriesProperties.haStyle.borderUpColor': '#00c896',
      'mainSeriesProperties.haStyle.borderDownColor': '#f44336',
      'mainSeriesProperties.haStyle.wickColor': '#CC0000',
      'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,
      'mainSeriesProperties.barStyle.upColor': '#00c896', //'#4caf50',
      'mainSeriesProperties.barStyle.downColor': '#fc4c4c',
      'mainSeriesProperties.areaStyle.color1': '#2196f3',
      'mainSeriesProperties.areaStyle.color2': 'rgba(0,0,0,0)',
      'mainSeriesProperties.lineStyle.color': '#c00',
      'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0.00)',
      volumePaneSize: 'small',
    },
    loading_screen: { backgroundColor: '#080c34', foregroundColor: '#080c34' },
    container_id: 'chartdiv',
    datafeed: new Datafeeds.UDFCompatibleDatafeed(AppSettings.apiEndpoint + 'chart'), // ('http://18.191.14.83:1130/chart'),
    // datafeed: new Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'), // ('http://18.191.14.83:1130/chart'),
    library_path: 'assets/charting_library/',
    client_id: 'tradingview.com',
    // volumePaneSize: 'tiny',
    studies_overrides: {
      'volume.volume.transparency': 50,
      'volume.volume ma.linewidth': 1,
      'volume.volume.color.0': '#893838',
      'volume.volume.color.1': '#0a6d5b',
      'bollinger bands.median.color': '#f30',
      'bollinger bands.upper.linewidth': 7,
      'moving average.precision': 8
    },
    user_id: 'public_user_id'
  };
  public static setValidLang() {
    const urii = location.href.split('/')[3];
    if (urii !== '' && urii !== undefined && urii !== null) {
      const uriiFromStore = chartLangSettings[location.href.split('/')[3]].lang;
      if (uriiFromStore !== '' && uriiFromStore !== undefined || uriiFromStore !== null) {
        return uriiFromStore.toString().replace(/\s/g, '');
      }
    }

    if (Storage.existsCookie('language')) {
      return Storage.readCookie('language').toString().replace(/\s/g, '');
    } else {
      return 'en';
    }
  }

  constructor() {
    ChartConfiguration.defaultConfig.locale = ChartConfiguration.setValidLang().toString();
    ChartConfiguration.defaultConfig2.locale = ChartConfiguration.setValidLang().toString();
  }


  public static timezones =
    [
      {
        "value": "Dateline Standard Time",
        "abbr": "DST",
        "offset": -12,
        "isdst": false,
        "text": "(UTC-12:00) International Date Line West",
        "utc": [
          "Etc/GMT+12"
        ]
      },
      {
        "value": "UTC-11",
        "abbr": "U",
        "offset": -11,
        "isdst": false,
        "text": "(UTC-11:00) Coordinated Universal Time-11",
        "utc": [
          "Etc/GMT+11",
          "Pacific/Midway",
          "Pacific/Niue",
          "Pacific/Pago_Pago"
        ]
      },
      {
        "value": "Hawaiian Standard Time",
        "abbr": "HST",
        "offset": -10,
        "isdst": false,
        "text": "(UTC-10:00) Hawaii",
        "utc": [
          "Etc/GMT+10",
          "Pacific/Honolulu",
          "Pacific/Johnston",
          "Pacific/Rarotonga",
          "Pacific/Tahiti"
        ]
      },
      {
        "value": "Alaskan Standard Time",
        "abbr": "AKDT",
        "offset": -8,
        "isdst": true,
        "text": "(UTC-09:00) Alaska",
        "utc": [
          "America/Anchorage",
          "America/Juneau",
          "America/Nome",
          "America/Sitka",
          "America/Yakutat"
        ]
      },
      {
        "value": "Pacific Standard Time (Mexico)",
        "abbr": "PDT",
        "offset": -7,
        "isdst": true,
        "text": "(UTC-08:00) Baja California",
        "utc": [
          "America/Santa_Isabel"
        ]
      },
      {
        "value": "Pacific Daylight Time",
        "abbr": "PDT",
        "offset": -7,
        "isdst": true,
        "text": "(UTC-07:00) Pacific Time (US & Canada)",
        "utc": [
          "America/Dawson",
          "America/Los_Angeles",
          "America/Tijuana",
          "America/Vancouver",
          "America/Whitehorse"
        ]
      },
      {
        "value": "Pacific Standard Time",
        "abbr": "PST",
        "offset": -8,
        "isdst": false,
        "text": "(UTC-08:00) Pacific Time (US & Canada)",
        "utc": [
          "America/Dawson",
          "America/Los_Angeles",
          "America/Tijuana",
          "America/Vancouver",
          "America/Whitehorse",
          "PST8PDT"
        ]
      },
      {
        "value": "US Mountain Standard Time",
        "abbr": "UMST",
        "offset": -7,
        "isdst": false,
        "text": "(UTC-07:00) Arizona",
        "utc": [
          "America/Creston",
          "America/Dawson_Creek",
          "America/Hermosillo",
          "America/Phoenix",
          "Etc/GMT+7"
        ]
      },
      {
        "value": "Mountain Standard Time (Mexico)",
        "abbr": "MDT",
        "offset": -6,
        "isdst": true,
        "text": "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
        "utc": [
          "America/Chihuahua",
          "America/Mazatlan"
        ]
      },
      {
        "value": "Mountain Standard Time",
        "abbr": "MDT",
        "offset": -6,
        "isdst": true,
        "text": "(UTC-07:00) Mountain Time (US & Canada)",
        "utc": [
          "America/Boise",
          "America/Cambridge_Bay",
          "America/Denver",
          "America/Edmonton",
          "America/Inuvik",
          "America/Ojinaga",
          "America/Yellowknife",
          "MST7MDT"
        ]
      },
      {
        "value": "Central America Standard Time",
        "abbr": "CAST",
        "offset": -6,
        "isdst": false,
        "text": "(UTC-06:00) Central America",
        "utc": [
          "America/Belize",
          "America/Costa_Rica",
          "America/El_Salvador",
          "America/Guatemala",
          "America/Managua",
          "America/Tegucigalpa",
          "Etc/GMT+6",
          "Pacific/Galapagos"
        ]
      },
      {
        "value": "Central Standard Time",
        "abbr": "CDT",
        "offset": -5,
        "isdst": true,
        "text": "(UTC-06:00) Central Time (US & Canada)",
        "utc": [
          "America/Chicago",
          "America/Indiana/Knox",
          "America/Indiana/Tell_City",
          "America/Matamoros",
          "America/Menominee",
          "America/North_Dakota/Beulah",
          "America/North_Dakota/Center",
          "America/North_Dakota/New_Salem",
          "America/Rainy_River",
          "America/Rankin_Inlet",
          "America/Resolute",
          "America/Winnipeg",
          "CST6CDT"
        ]
      },
      {
        "value": "Central Standard Time (Mexico)",
        "abbr": "CDT",
        "offset": -5,
        "isdst": true,
        "text": "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
        "utc": [
          "America/Bahia_Banderas",
          "America/Cancun",
          "America/Merida",
          "America/Mexico_City",
          "America/Monterrey"
        ]
      },
      {
        "value": "Canada Central Standard Time",
        "abbr": "CCST",
        "offset": -6,
        "isdst": false,
        "text": "(UTC-06:00) Saskatchewan",
        "utc": [
          "America/Regina",
          "America/Swift_Current"
        ]
      },
      {
        "value": "SA Pacific Standard Time",
        "abbr": "SPST",
        "offset": -5,
        "isdst": false,
        "text": "(UTC-05:00) Bogota, Lima, Quito",
        "utc": [
          "America/Bogota",
          "America/Cayman",
          "America/Coral_Harbour",
          "America/Eirunepe",
          "America/Guayaquil",
          "America/Jamaica",
          "America/Lima",
          "America/Panama",
          "America/Rio_Branco",
          "Etc/GMT+5"
        ]
      },
      {
        "value": "Eastern Standard Time",
        "abbr": "EDT",
        "offset": -4,
        "isdst": true,
        "text": "(UTC-05:00) Eastern Time (US & Canada)",
        "utc": [
          "America/Detroit",
          "America/Havana",
          "America/Indiana/Petersburg",
          "America/Indiana/Vincennes",
          "America/Indiana/Winamac",
          "America/Iqaluit",
          "America/Kentucky/Monticello",
          "America/Louisville",
          "America/Montreal",
          "America/Nassau",
          "America/New_York",
          "America/Nipigon",
          "America/Pangnirtung",
          "America/Port-au-Prince",
          "America/Thunder_Bay",
          "America/Toronto",
          "EST5EDT"
        ]
      },
      {
        "value": "US Eastern Standard Time",
        "abbr": "UEDT",
        "offset": -4,
        "isdst": true,
        "text": "(UTC-05:00) Indiana (East)",
        "utc": [
          "America/Indiana/Marengo",
          "America/Indiana/Vevay",
          "America/Indianapolis"
        ]
      },
      {
        "value": "Venezuela Standard Time",
        "abbr": "VST",
        "offset": -4.5,
        "isdst": false,
        "text": "(UTC-04:30) Caracas",
        "utc": [
          "America/Caracas"
        ]
      },
      {
        "value": "Paraguay Standard Time",
        "abbr": "PYT",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Asuncion",
        "utc": [
          "America/Asuncion"
        ]
      },
      {
        "value": "Atlantic Standard Time",
        "abbr": "ADT",
        "offset": -3,
        "isdst": true,
        "text": "(UTC-04:00) Atlantic Time (Canada)",
        "utc": [
          "America/Glace_Bay",
          "America/Goose_Bay",
          "America/Halifax",
          "America/Moncton",
          "America/Thule",
          "Atlantic/Bermuda"
        ]
      },
      {
        "value": "Central Brazilian Standard Time",
        "abbr": "CBST",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Cuiaba",
        "utc": [
          "America/Campo_Grande",
          "America/Cuiaba"
        ]
      },
      {
        "value": "SA Western Standard Time",
        "abbr": "SWST",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
        "utc": [
          "America/Anguilla",
          "America/Antigua",
          "America/Aruba",
          "America/Barbados",
          "America/Blanc-Sablon",
          "America/Boa_Vista",
          "America/Curacao",
          "America/Dominica",
          "America/Grand_Turk",
          "America/Grenada",
          "America/Guadeloupe",
          "America/Guyana",
          "America/Kralendijk",
          "America/La_Paz",
          "America/Lower_Princes",
          "America/Manaus",
          "America/Marigot",
          "America/Martinique",
          "America/Montserrat",
          "America/Port_of_Spain",
          "America/Porto_Velho",
          "America/Puerto_Rico",
          "America/Santo_Domingo",
          "America/St_Barthelemy",
          "America/St_Kitts",
          "America/St_Lucia",
          "America/St_Thomas",
          "America/St_Vincent",
          "America/Tortola",
          "Etc/GMT+4"
        ]
      },
      {
        "value": "Pacific SA Standard Time",
        "abbr": "PSST",
        "offset": -4,
        "isdst": false,
        "text": "(UTC-04:00) Santiago",
        "utc": [
          "America/Santiago",
          "Antarctica/Palmer"
        ]
      },
      {
        "value": "Newfoundland Standard Time",
        "abbr": "NDT",
        "offset": -2.5,
        "isdst": true,
        "text": "(UTC-03:30) Newfoundland",
        "utc": [
          "America/St_Johns"
        ]
      },
      {
        "value": "E. South America Standard Time",
        "abbr": "ESAST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Brasilia",
        "utc": [
          "America/Sao_Paulo"
        ]
      },
      {
        "value": "Argentina Standard Time",
        "abbr": "AST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Buenos Aires",
        "utc": [
          "America/Argentina/La_Rioja",
          "America/Argentina/Rio_Gallegos",
          "America/Argentina/Salta",
          "America/Argentina/San_Juan",
          "America/Argentina/San_Luis",
          "America/Argentina/Tucuman",
          "America/Argentina/Ushuaia",
          "America/Buenos_Aires",
          "America/Catamarca",
          "America/Cordoba",
          "America/Jujuy",
          "America/Mendoza"
        ]
      },
      {
        "value": "SA Eastern Standard Time",
        "abbr": "SEST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Cayenne, Fortaleza",
        "utc": [
          "America/Araguaina",
          "America/Belem",
          "America/Cayenne",
          "America/Fortaleza",
          "America/Maceio",
          "America/Paramaribo",
          "America/Recife",
          "America/Santarem",
          "Antarctica/Rothera",
          "Atlantic/Stanley",
          "Etc/GMT+3"
        ]
      },
      {
        "value": "Greenland Standard Time",
        "abbr": "GDT",
        "offset": -3,
        "isdst": true,
        "text": "(UTC-03:00) Greenland",
        "utc": [
          "America/Godthab"
        ]
      },
      {
        "value": "Montevideo Standard Time",
        "abbr": "MST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Montevideo",
        "utc": [
          "America/Montevideo"
        ]
      },
      {
        "value": "Bahia Standard Time",
        "abbr": "BST",
        "offset": -3,
        "isdst": false,
        "text": "(UTC-03:00) Salvador",
        "utc": [
          "America/Bahia"
        ]
      },
      {
        "value": "UTC-02",
        "abbr": "U",
        "offset": -2,
        "isdst": false,
        "text": "(UTC-02:00) Coordinated Universal Time-02",
        "utc": [
          "America/Noronha",
          "Atlantic/South_Georgia",
          "Etc/GMT+2"
        ]
      },
      {
        "value": "Mid-Atlantic Standard Time",
        "abbr": "MDT",
        "offset": -1,
        "isdst": true,
        "text": "(UTC-02:00) Mid-Atlantic - Old",
        "utc": []
      },
      {
        "value": "Azores Standard Time",
        "abbr": "ADT",
        "offset": 0,
        "isdst": true,
        "text": "(UTC-01:00) Azores",
        "utc": [
          "America/Scoresbysund",
          "Atlantic/Azores"
        ]
      },
      {
        "value": "Cape Verde Standard Time",
        "abbr": "CVST",
        "offset": -1,
        "isdst": false,
        "text": "(UTC-01:00) Cape Verde Is.",
        "utc": [
          "Atlantic/Cape_Verde",
          "Etc/GMT+1"
        ]
      },
      {
        "value": "Morocco Standard Time",
        "abbr": "MDT",
        "offset": 1,
        "isdst": true,
        "text": "(UTC) Casablanca",
        "utc": [
          "Africa/Casablanca",
          "Africa/El_Aaiun"
        ]
      },
      {
        "value": "UTC",
        "abbr": "UTC",
        "offset": 0,
        "isdst": false,
        "text": "(UTC) Coordinated Universal Time",
        "utc": [
          "America/Danmarkshavn",
          "Etc/GMT"
        ]
      },
      {
        "value": "GMT Standard Time",
        "abbr": "GMT",
        "offset": 0,
        "isdst": false,
        "text": "(UTC) Edinburgh, London",
        "utc": [
          "Europe/Isle_of_Man",
          "Europe/Guernsey",
          "Europe/Jersey",
          "Europe/London"
        ]
      },
      {
        "value": "British Summer Time",
        "abbr": "BST",
        "offset": 1,
        "isdst": true,
        "text": "(UTC+01:00) Edinburgh, London",
        "utc": [
          "Europe/Isle_of_Man",
          "Europe/Guernsey",
          "Europe/Jersey",
          "Europe/London"
        ]
      },
      {
        "value": "GMT Standard Time",
        "abbr": "GDT",
        "offset": 1,
        "isdst": true,
        "text": "(UTC) Dublin, Lisbon",
        "utc": [
          "Atlantic/Canary",
          "Atlantic/Faeroe",
          "Atlantic/Madeira",
          "Europe/Dublin",
          "Europe/Lisbon"
        ]
      },
      {
        "value": "Greenwich Standard Time",
        "abbr": "GST",
        "offset": 0,
        "isdst": false,
        "text": "(UTC) Monrovia, Reykjavik",
        "utc": [
          "Africa/Abidjan",
          "Africa/Accra",
          "Africa/Bamako",
          "Africa/Banjul",
          "Africa/Bissau",
          "Africa/Conakry",
          "Africa/Dakar",
          "Africa/Freetown",
          "Africa/Lome",
          "Africa/Monrovia",
          "Africa/Nouakchott",
          "Africa/Ouagadougou",
          "Africa/Sao_Tome",
          "Atlantic/Reykjavik",
          "Atlantic/St_Helena"
        ]
      },
      {
        "value": "W. Europe Standard Time",
        "abbr": "WEDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
        "utc": [
          "Arctic/Longyearbyen",
          "Europe/Amsterdam",
          "Europe/Andorra",
          "Europe/Berlin",
          "Europe/Busingen",
          "Europe/Gibraltar",
          "Europe/Luxembourg",
          "Europe/Malta",
          "Europe/Monaco",
          "Europe/Oslo",
          "Europe/Rome",
          "Europe/San_Marino",
          "Europe/Stockholm",
          "Europe/Vaduz",
          "Europe/Vatican",
          "Europe/Vienna",
          "Europe/Zurich"
        ]
      },
      {
        "value": "Central Europe Standard Time",
        "abbr": "CEDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
        "utc": [
          "Europe/Belgrade",
          "Europe/Bratislava",
          "Europe/Budapest",
          "Europe/Ljubljana",
          "Europe/Podgorica",
          "Europe/Prague",
          "Europe/Tirane"
        ]
      },
      {
        "value": "Romance Standard Time",
        "abbr": "RDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
        "utc": [
          "Africa/Ceuta",
          "Europe/Brussels",
          "Europe/Copenhagen",
          "Europe/Madrid",
          "Europe/Paris"
        ]
      },
      {
        "value": "Central European Standard Time",
        "abbr": "CEDT",
        "offset": 2,
        "isdst": true,
        "text": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
        "utc": [
          "Europe/Sarajevo",
          "Europe/Skopje",
          "Europe/Warsaw",
          "Europe/Zagreb"
        ]
      },
      {
        "value": "W. Central Africa Standard Time",
        "abbr": "WCAST",
        "offset": 1,
        "isdst": false,
        "text": "(UTC+01:00) West Central Africa",
        "utc": [
          "Africa/Algiers",
          "Africa/Bangui",
          "Africa/Brazzaville",
          "Africa/Douala",
          "Africa/Kinshasa",
          "Africa/Lagos",
          "Africa/Libreville",
          "Africa/Luanda",
          "Africa/Malabo",
          "Africa/Ndjamena",
          "Africa/Niamey",
          "Africa/Porto-Novo",
          "Africa/Tunis",
          "Etc/GMT-1"
        ]
      },
      {
        "value": "Namibia Standard Time",
        "abbr": "NST",
        "offset": 1,
        "isdst": false,
        "text": "(UTC+01:00) Windhoek",
        "utc": [
          "Africa/Windhoek"
        ]
      },
      {
        "value": "GTB Standard Time",
        "abbr": "GDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Athens, Bucharest",
        "utc": [
          "Asia/Nicosia",
          "Europe/Athens",
          "Europe/Bucharest",
          "Europe/Chisinau"
        ]
      },
      {
        "value": "Middle East Standard Time",
        "abbr": "MEDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Beirut",
        "utc": [
          "Asia/Beirut"
        ]
      },
      {
        "value": "Egypt Standard Time",
        "abbr": "EST",
        "offset": 2,
        "isdst": false,
        "text": "(UTC+02:00) Cairo",
        "utc": [
          "Africa/Cairo"
        ]
      },
      {
        "value": "Syria Standard Time",
        "abbr": "SDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Damascus",
        "utc": [
          "Asia/Damascus"
        ]
      },
      {
        "value": "E. Europe Standard Time",
        "abbr": "EEDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) E. Europe",
        "utc": [
          "Asia/Nicosia",
          "Europe/Athens",
          "Europe/Bucharest",
          "Europe/Chisinau",
          "Europe/Helsinki",
          "Europe/Kiev",
          "Europe/Mariehamn",
          "Europe/Nicosia",
          "Europe/Riga",
          "Europe/Sofia",
          "Europe/Tallinn",
          "Europe/Uzhgorod",
          "Europe/Vilnius",
          "Europe/Zaporozhye"

        ]
      },
      {
        "value": "South Africa Standard Time",
        "abbr": "SAST",
        "offset": 2,
        "isdst": false,
        "text": "(UTC+02:00) Harare, Pretoria",
        "utc": [
          "Africa/Blantyre",
          "Africa/Bujumbura",
          "Africa/Gaborone",
          "Africa/Harare",
          "Africa/Johannesburg",
          "Africa/Kigali",
          "Africa/Lubumbashi",
          "Africa/Lusaka",
          "Africa/Maputo",
          "Africa/Maseru",
          "Africa/Mbabane",
          "Etc/GMT-2"
        ]
      },
      {
        "value": "FLE Standard Time",
        "abbr": "FDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
        "utc": [
          "Europe/Helsinki",
          "Europe/Kiev",
          "Europe/Mariehamn",
          "Europe/Riga",
          "Europe/Sofia",
          "Europe/Tallinn",
          "Europe/Uzhgorod",
          "Europe/Vilnius",
          "Europe/Zaporozhye"
        ]
      },
      {
        "value": "Turkey Standard Time",
        "abbr": "TDT",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Istanbul",
        "utc": [
          "Europe/Istanbul"
        ]
      },
      {
        "value": "Israel Standard Time",
        "abbr": "JDT",
        "offset": 3,
        "isdst": true,
        "text": "(UTC+02:00) Jerusalem",
        "utc": [
          "Asia/Jerusalem"
        ]
      },
      {
        "value": "Libya Standard Time",
        "abbr": "LST",
        "offset": 2,
        "isdst": false,
        "text": "(UTC+02:00) Tripoli",
        "utc": [
          "Africa/Tripoli"
        ]
      },
      {
        "value": "Jordan Standard Time",
        "abbr": "JST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Amman",
        "utc": [
          "Asia/Amman"
        ]
      },
      {
        "value": "Arabic Standard Time",
        "abbr": "AST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Baghdad",
        "utc": [
          "Asia/Baghdad"
        ]
      },
      {
        "value": "Kaliningrad Standard Time",
        "abbr": "KST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Kaliningrad, Minsk",
        "utc": [
          "Europe/Kaliningrad",
          "Europe/Minsk"
        ]
      },
      {
        "value": "Arab Standard Time",
        "abbr": "AST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Kuwait, Riyadh",
        "utc": [
          "Asia/Aden",
          "Asia/Bahrain",
          "Asia/Kuwait",
          "Asia/Qatar",
          "Asia/Riyadh"
        ]
      },
      {
        "value": "E. Africa Standard Time",
        "abbr": "EAST",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Nairobi",
        "utc": [
          "Africa/Addis_Ababa",
          "Africa/Asmera",
          "Africa/Dar_es_Salaam",
          "Africa/Djibouti",
          "Africa/Juba",
          "Africa/Kampala",
          "Africa/Khartoum",
          "Africa/Mogadishu",
          "Africa/Nairobi",
          "Antarctica/Syowa",
          "Etc/GMT-3",
          "Indian/Antananarivo",
          "Indian/Comoro",
          "Indian/Mayotte"
        ]
      },
      {
        "value": "Moscow Standard Time",
        "abbr": "MSK",
        "offset": 3,
        "isdst": false,
        "text": "(UTC+03:00) Moscow, St. Petersburg, Volgograd",
        "utc": [
          "Europe/Kirov",
          "Europe/Moscow",
          "Europe/Simferopol",
          "Europe/Volgograd"
        ]
      },
      {
        "value": "Samara Time",
        "abbr": "SAMT",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Samara, Ulyanovsk, Saratov",
        "utc": [
          "Europe/Astrakhan",
          "Europe/Samara",
          "Europe/Ulyanovsk"
        ]
      },
      {
        "value": "Iran Standard Time",
        "abbr": "IDT",
        "offset": 4.5,
        "isdst": true,
        "text": "(UTC+03:30) Tehran",
        "utc": [
          "Asia/Tehran"
        ]
      },
      {
        "value": "Arabian Standard Time",
        "abbr": "AST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Abu Dhabi, Muscat",
        "utc": [
          "Asia/Dubai",
          "Asia/Muscat",
          "Etc/GMT-4"
        ]
      },
      {
        "value": "Azerbaijan Standard Time",
        "abbr": "ADT",
        "offset": 5,
        "isdst": true,
        "text": "(UTC+04:00) Baku",
        "utc": [
          "Asia/Baku"
        ]
      },
      {
        "value": "Mauritius Standard Time",
        "abbr": "MST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Port Louis",
        "utc": [
          "Indian/Mahe",
          "Indian/Mauritius",
          "Indian/Reunion"
        ]
      },
      {
        "value": "Georgian Standard Time",
        "abbr": "GET",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Tbilisi",
        "utc": [
          "Asia/Tbilisi"
        ]
      },
      {
        "value": "Caucasus Standard Time",
        "abbr": "CST",
        "offset": 4,
        "isdst": false,
        "text": "(UTC+04:00) Yerevan",
        "utc": [
          "Asia/Yerevan"
        ]
      },
      {
        "value": "Afghanistan Standard Time",
        "abbr": "AST",
        "offset": 4.5,
        "isdst": false,
        "text": "(UTC+04:30) Kabul",
        "utc": [
          "Asia/Kabul"
        ]
      },
      {
        "value": "West Asia Standard Time",
        "abbr": "WAST",
        "offset": 5,
        "isdst": false,
        "text": "(UTC+05:00) Ashgabat, Tashkent",
        "utc": [
          "Antarctica/Mawson",
          "Asia/Aqtau",
          "Asia/Aqtobe",
          "Asia/Ashkhabad",
          "Asia/Dushanbe",
          "Asia/Oral",
          "Asia/Samarkand",
          "Asia/Tashkent",
          "Etc/GMT-5",
          "Indian/Kerguelen",
          "Indian/Maldives"
        ]
      },
      {
        "value": "Yekaterinburg Time",
        "abbr": "YEKT",
        "offset": 5,
        "isdst": false,
        "text": "(UTC+05:00) Yekaterinburg",
        "utc": [
          "Asia/Yekaterinburg"
        ]
      },
      {
        "value": "Pakistan Standard Time",
        "abbr": "PKT",
        "offset": 5,
        "isdst": false,
        "text": "(UTC+05:00) Islamabad, Karachi",
        "utc": [
          "Asia/Karachi"
        ]
      },
      {
        "value": "India Standard Time",
        "abbr": "IST",
        "offset": 5.5,
        "isdst": false,
        "text": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        "utc": [
          "Asia/Kolkata"
        ]
      },
      {
        "value": "Sri Lanka Standard Time",
        "abbr": "SLST",
        "offset": 5.5,
        "isdst": false,
        "text": "(UTC+05:30) Sri Jayawardenepura",
        "utc": [
          "Asia/Colombo"
        ]
      },
      {
        "value": "Nepal Standard Time",
        "abbr": "NST",
        "offset": 5.75,
        "isdst": false,
        "text": "(UTC+05:45) Kathmandu",
        "utc": [
          "Asia/Kathmandu"
        ]
      },
      {
        "value": "Central Asia Standard Time",
        "abbr": "CAST",
        "offset": 6,
        "isdst": false,
        "text": "(UTC+06:00) Astana",
        "utc": [
          "Antarctica/Vostok",
          "Asia/Almaty",
          "Asia/Bishkek",
          "Asia/Qyzylorda",
          "Asia/Urumqi",
          "Etc/GMT-6",
          "Indian/Chagos"
        ]
      },
      {
        "value": "Bangladesh Standard Time",
        "abbr": "BST",
        "offset": 6,
        "isdst": false,
        "text": "(UTC+06:00) Dhaka",
        "utc": [
          "Asia/Dhaka",
          "Asia/Thimphu"
        ]
      },
      {
        "value": "Myanmar Standard Time",
        "abbr": "MST",
        "offset": 6.5,
        "isdst": false,
        "text": "(UTC+06:30) Yangon (Rangoon)",
        "utc": [
          "Asia/Rangoon",
          "Indian/Cocos"
        ]
      },
      {
        "value": "SE Asia Standard Time",
        "abbr": "SAST",
        "offset": 7,
        "isdst": false,
        "text": "(UTC+07:00) Bangkok, Hanoi, Jakarta",
        "utc": [
          "Antarctica/Davis",
          "Asia/Bangkok",
          "Asia/Hovd",
          "Asia/Jakarta",
          "Asia/Phnom_Penh",
          "Asia/Pontianak",
          "Asia/Saigon",
          "Asia/Vientiane",
          "Etc/GMT-7",
          "Indian/Christmas"
        ]
      },
      {
        "value": "N. Central Asia Standard Time",
        "abbr": "NCAST",
        "offset": 7,
        "isdst": false,
        "text": "(UTC+07:00) Novosibirsk",
        "utc": [
          "Asia/Novokuznetsk",
          "Asia/Novosibirsk",
          "Asia/Omsk"
        ]
      },
      {
        "value": "China Standard Time",
        "abbr": "CST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
        "utc": [
          "Asia/Hong_Kong",
          "Asia/Macau",
          "Asia/Shanghai"
        ]
      },
      {
        "value": "North Asia Standard Time",
        "abbr": "NAST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Krasnoyarsk",
        "utc": [
          "Asia/Krasnoyarsk"
        ]
      },
      {
        "value": "Singapore Standard Time",
        "abbr": "MPST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Kuala Lumpur, Singapore",
        "utc": [
          "Asia/Brunei",
          "Asia/Kuala_Lumpur",
          "Asia/Kuching",
          "Asia/Makassar",
          "Asia/Manila",
          "Asia/Singapore",
          "Etc/GMT-8"
        ]
      },
      {
        "value": "W. Australia Standard Time",
        "abbr": "WAST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Perth",
        "utc": [
          "Antarctica/Casey",
          "Australia/Perth"
        ]
      },
      {
        "value": "Taipei Standard Time",
        "abbr": "TST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Taipei",
        "utc": [
          "Asia/Taipei"
        ]
      },
      {
        "value": "Ulaanbaatar Standard Time",
        "abbr": "UST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Ulaanbaatar",
        "utc": [
          "Asia/Choibalsan",
          "Asia/Ulaanbaatar"
        ]
      },
      {
        "value": "North Asia East Standard Time",
        "abbr": "NAEST",
        "offset": 8,
        "isdst": false,
        "text": "(UTC+08:00) Irkutsk",
        "utc": [
          "Asia/Irkutsk"
        ]
      },
      {
        "value": "Japan Standard Time",
        "abbr": "JST",
        "offset": 9,
        "isdst": false,
        "text": "(UTC+09:00) Osaka, Sapporo, Tokyo",
        "utc": [
          "Asia/Dili",
          "Asia/Jayapura",
          "Asia/Tokyo",
          "Etc/GMT-9",
          "Pacific/Palau"
        ]
      },
      {
        "value": "Korea Standard Time",
        "abbr": "KST",
        "offset": 9,
        "isdst": false,
        "text": "(UTC+09:00) Seoul",
        "utc": [
          "Asia/Pyongyang",
          "Asia/Seoul"
        ]
      },
      {
        "value": "Cen. Australia Standard Time",
        "abbr": "CAST",
        "offset": 9.5,
        "isdst": false,
        "text": "(UTC+09:30) Adelaide",
        "utc": [
          "Australia/Adelaide",
          "Australia/Broken_Hill"
        ]
      },
      {
        "value": "AUS Central Standard Time",
        "abbr": "ACST",
        "offset": 9.5,
        "isdst": false,
        "text": "(UTC+09:30) Darwin",
        "utc": [
          "Australia/Darwin"
        ]
      },
      {
        "value": "E. Australia Standard Time",
        "abbr": "EAST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Brisbane",
        "utc": [
          "Australia/Brisbane",
          "Australia/Lindeman"
        ]
      },
      {
        "value": "AUS Eastern Standard Time",
        "abbr": "AEST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Canberra, Melbourne, Sydney",
        "utc": [
          "Australia/Melbourne",
          "Australia/Sydney"
        ]
      },
      {
        "value": "West Pacific Standard Time",
        "abbr": "WPST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Guam, Port Moresby",
        "utc": [
          "Antarctica/DumontDUrville",
          "Etc/GMT-10",
          "Pacific/Guam",
          "Pacific/Port_Moresby",
          "Pacific/Saipan",
          "Pacific/Truk"
        ]
      },
      {
        "value": "Tasmania Standard Time",
        "abbr": "TST",
        "offset": 10,
        "isdst": false,
        "text": "(UTC+10:00) Hobart",
        "utc": [
          "Australia/Currie",
          "Australia/Hobart"
        ]
      },
      {
        "value": "Yakutsk Standard Time",
        "abbr": "YST",
        "offset": 9,
        "isdst": false,
        "text": "(UTC+09:00) Yakutsk",
        "utc": [
          "Asia/Chita",
          "Asia/Khandyga",
          "Asia/Yakutsk"
        ]
      },
      {
        "value": "Central Pacific Standard Time",
        "abbr": "CPST",
        "offset": 11,
        "isdst": false,
        "text": "(UTC+11:00) Solomon Is., New Caledonia",
        "utc": [
          "Antarctica/Macquarie",
          "Etc/GMT-11",
          "Pacific/Efate",
          "Pacific/Guadalcanal",
          "Pacific/Kosrae",
          "Pacific/Noumea",
          "Pacific/Ponape"
        ]
      },
      {
        "value": "Vladivostok Standard Time",
        "abbr": "VST",
        "offset": 11,
        "isdst": false,
        "text": "(UTC+11:00) Vladivostok",
        "utc": [
          "Asia/Sakhalin",
          "Asia/Ust-Nera",
          "Asia/Vladivostok"
        ]
      },
      {
        "value": "New Zealand Standard Time",
        "abbr": "NZST",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Auckland, Wellington",
        "utc": [
          "Antarctica/McMurdo",
          "Pacific/Auckland"
        ]
      },
      {
        "value": "UTC+12",
        "abbr": "U",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Coordinated Universal Time+12",
        "utc": [
          "Etc/GMT-12",
          "Pacific/Funafuti",
          "Pacific/Kwajalein",
          "Pacific/Majuro",
          "Pacific/Nauru",
          "Pacific/Tarawa",
          "Pacific/Wake",
          "Pacific/Wallis"
        ]
      },
      {
        "value": "Fiji Standard Time",
        "abbr": "FST",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Fiji",
        "utc": [
          "Pacific/Fiji"
        ]
      },
      {
        "value": "Magadan Standard Time",
        "abbr": "MST",
        "offset": 12,
        "isdst": false,
        "text": "(UTC+12:00) Magadan",
        "utc": [
          "Asia/Anadyr",
          "Asia/Kamchatka",
          "Asia/Magadan",
          "Asia/Srednekolymsk"
        ]
      },
      {
        "value": "Kamchatka Standard Time",
        "abbr": "KDT",
        "offset": 13,
        "isdst": true,
        "text": "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
        "utc": [
          "Asia/Kamchatka"
        ]
      },
      {
        "value": "Tonga Standard Time",
        "abbr": "TST",
        "offset": 13,
        "isdst": false,
        "text": "(UTC+13:00) Nuku'alofa",
        "utc": [
          "Etc/GMT-13",
          "Pacific/Enderbury",
          "Pacific/Fakaofo",
          "Pacific/Tongatapu"
        ]
      },
      {
        "value": "Samoa Standard Time",
        "abbr": "SST",
        "offset": 13,
        "isdst": false,
        "text": "(UTC+13:00) Samoa",
        "utc": [
          "Pacific/Apia"
        ]
      }
    ]
}