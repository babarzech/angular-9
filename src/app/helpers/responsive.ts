declare var $: any;

export class Size {
    public static screenHeight = 0;
    public static screenWidth = 0;
    public static height = 0;
    public static width = 0;
    public static headerHeight = 0;
    public static headerOptionsHeight = 0;
    public static chartHeight = 0;
    public static chartWidth = 0;
    public static rightPanelHeight = 0;
    public static marketOrderCreateHeight = 0;
    public static pairHeight = 0;
    public static buySellHeight = 0;
    public static orderPanelHeight = 0;
    public static orderTblTrHeight = 0;
    public static orderTblPrateHeight = 0;
    public static totalOrderToShow = 0;
    public static tradeHeight = 0;
    public static tickerHeight = 0;
    public static isMobile = false;
    public static tabHeight = 0;
    public static favPairPanelWidth = 0;
    public static favPairTabWidth = 0;
    public static favPairHeight = 0;
    public static isMobileTrade = false;
    public static isMobileHeight = false;
    public static thSubPanlHeaderHeight = 0;
    public static thTabletheadHeight = 0;
    public static acctinfoLeftHeight = 0;
    public static orderHistoryTabHeight = 0;
    public static orderHistoryTabTheadHeight = 0;
    public static orderHistScrollHeight = 0;
    public static inputTooltipposition = 0;
    public static mainpairmenuBtnWidth = 0;
    public static update() {
        Responsive.updateSize();
    }
}
export class SizeEmpty {
    public static screenHeight = 0;
    public static screenWidth = 0;
    public static height = 0;
    public static width = 0;
    public static headerHeight = 0;
    public static headerOptionsHeight = 0;
    public static chartHeight = 0;
    public static chartWidth = 0;
    public static rightPanelHeight = 0;
    public static marketOrderCreateHeight = 0;
    public static pairHeight = 0;
    public static buySellHeight = 0;
    public static orderPanelHeight = 0;
    public static orderTblTrHeight = 0;
    public static orderTblPrateHeight = 0;
    public static totalOrderToShow = 0;
    public static tradeHeight = 0;
    public static tickerHeight = 0;
    public static isMobile = false;
    public static tabHeight = 0;
    public static favPairPanelWidth = 0;
    public static favPairTabWidth = 0;
    public static favPairHeight = 0;
    public static thSubPanlHeaderHeight = 0;
    public static isMobileTrade = false;
    public static isMobileHeight = false;
    public static thTabletheadHeight = 0;
    public static orderHistoryTabHeight = 0;
    public static orderHistoryTabTheadHeight = 0;
    public static orderHistScrollHeight = 0;
    public static inputTooltipposition = 0;
    public static mainpairmenuBtnWidth = 0;
    public static update() {
        Responsive.updateSize();
    }
}
export class Responsive {
    public static tversion;
    public static init(tversion) {
        Responsive.tversion = tversion;
        $(window).on('resize', this.updateSize);
        this.updateSize();
        let count = 0;
        const interval = setInterval(() => {
            this.updateSize();
            count++;
            if (count > 10) {
                clearInterval(interval);
            }
        }, 100);
    }
    public static updateSize() {
        const w = $(window);
        Size.height = w.height();
        Size.width = w.width();
        Size.screenHeight = window.screen.height;
        Size.screenWidth = window.screen.width;
        Size.isMobile = Size.screenWidth < 900;
        Size.isMobileTrade = Size.screenWidth < 1200;
        Size.isMobileHeight = Size.height < 1025 && Size.width < 1441;
        Size.headerHeight = $('header').outerHeight();
        Size.chartHeight = $('.stock-chart').outerHeight();
        Size.marketOrderCreateHeight = $('.subpanel.buySell-panel').outerHeight();
        Size.pairHeight = $('.pairs-panel').height();
        Size.rightPanelHeight = $('subpanel-right').height();
        Size.thSubPanlHeaderHeight = $('.tradeHistory-panel .subpanel-header').outerHeight();
        Size.thTabletheadHeight = $('.tradeHistory-panel .table1 thead').outerHeight();
        Size.orderPanelHeight = $('.order-panel').height();
        Size.buySellHeight = $('.buySell-panel').height();
        Size.orderTblPrateHeight = $('.orderbook-tbl13 table .tr-prate').outerHeight();
        Size.tradeHeight = $('.tradeHistory-panel').height();
        Size.tickerHeight = $('.mkt-info-wrap').outerHeight();
        Size.chartWidth = $('#chartdiv').outerWidth();
        Size.tabHeight = $('.tab325').height();
        Size.favPairHeight = $('.fav-pairs').outerHeight();
        Size.favPairPanelWidth = $('.favpair-items').width();
        Size.inputTooltipposition = $('.input-tooltip').outerWidth() / 2;
        Size.orderHistoryTabHeight = $('.orderHistoryTab32 .mat-tab-header').outerHeight();
        Size.orderHistoryTabTheadHeight = $('.orderHistoryTab32 .table1 thead').outerHeight();
        Size.orderHistScrollHeight = $('.orderHistoryTab32 .mat-tab-group').outerHeight();
        Size.orderHistScrollHeight = Size.orderHistScrollHeight - Size.orderHistoryTabHeight - Size.orderHistoryTabTheadHeight;
        Size.acctinfoLeftHeight = $('.acctinfo-left12').height() / 2;
        Size.favPairTabWidth = $('.favpair-items>ul>li').width();
        Size.mainpairmenuBtnWidth = $('.mainpairmenu-btn').width();
        const opt = $('.mat-menu-content .tradePair-list');


        Size.headerOptionsHeight =
            $('.mat-menu-content .search-input').outerHeight() +
            opt.outerHeight() +
            parseInt(opt.css('margin-top'), 10) +
            parseInt(opt.css('margin-bottom'), 10) + 8;

    }
}
