import { EventEmitter, Component, OnInit, ViewChild, ElementRef, HostListener, Input, Output } from '@angular/core';
import { CommonService } from '../../helpers/commonservice';


@Component({
    selector: 'range-slider',
    templateUrl: './range-slider.component.html',
    styleUrls: ['./range-slider.component.css'],
})
export class RangeSliderComponent implements OnInit {
    @Input() isLogin;
    @Input() percentageValue;
    @Input() userBalance;
    @ViewChild('sliderBar',{static:true}) sliderBar: ElementRef;
    @Input('barvalue') barValue: number;
    @Input('ordertype') orderType: string;
    @Output() onValueChange = new EventEmitter();

    // below three are for only stop order
    @Input("ordertab") ordertab: string = "";
    @Input("rate") rate: number = 0;
    @Input("stop") stop: any;

    steps = [0, 25, 50, 75, 100];
    percentage: any;
    thumb;
    overlay;
    dot;
    filledBar;
    initMouseMove;
    isBuyOrder: boolean;
    offsetLeft = 0;
    initialOffset = 0;
    initTouchMove;

    sliderModel: any = {
        orderType: this.orderType,
        percentage: this.percentage
    }

    sliderConfig: any = {
        min: 0,
        max: 100,
        start: 0,
        thumbShow: true,
        barColor: "",
        dotColor: "",
        thumbColor: "",
        filledBarColor: "",
        barWidth: "",
        //selectCallBack: this.selectCallBack.bind(this)
    }

    /**
     * constructor function of the component 
     */
    constructor(private commonService: CommonService) { }

    /**
     * called on the component initialization
     */
    ngOnInit() {
        this.isBuyOrder = this.orderType == "Buy";
        // store slider move function in a variable for same reference in add/remove listeners
        this.initMouseMove = this.onMouseMoveOnSlider.bind(this);

        // calculate initial percentage
        //this.percentage = (this.sliderConfig.start / this.sliderConfig.max) * 100;

        // get thumb, overlay, dot and bar
        this.thumb = this.sliderBar.nativeElement.querySelector('.c2-thumb-value');
        this.overlay = this.sliderBar.nativeElement.querySelector('.overlay');
        this.dot = this.sliderBar.nativeElement.querySelector('.c2-js-slider-movable-thumb-dot');
        this.filledBar = this.sliderBar.nativeElement.querySelector('.c2-filled-bar');
        this.dot.click();
        if (!this.sliderConfig.thumbShow) {
            this.thumb.classList.add('hide-completely')
        }
        this.sliderModel.orderType = this.orderType;
        this.sliderConfig.dotColor = this.isBuyOrder ? "#00c896" : "#fc4c4c";
        this.thumb.classList.add(this.isBuyOrder ? "buy" : "sell");
        this.sliderConfig.filledBarColor = this.isBuyOrder ? "#00c896" : '#fc4c4c'
        this.setSliderUIValues(0, this.sliderConfig);
    }

    ngDoCheck() {
        //this.sliderModel.percentage = this.percentage;
    }

    resetSlider() {
        this.percentage = 0;
        this.setSliderUIValues(0, null);
    }

	/**
	 * check for mouse click and mouse move, set ui values of slider
     * @param {Object} event - mousemove event object
	 */
    onMouseMoveOnSlider(event: MouseEvent) {
        if (!this.isLogin || this.userBalance <= 0)
            return;
        // show overlay
        this.overlay.classList.remove('c2-hide');

        // check for slider bar
        if (this.sliderBar) {

            // show thumb
            this.thumb.classList.remove('c2-hide');

            let offSetWIdth = this.sliderBar.nativeElement.offsetWidth

            this.percentage = ((event.pageX - this.initialOffset) / offSetWIdth) * 100;
            if (event.target['className'] === "0"
                || event.target['className'] === "25"
                || event.target['className'] === "50"
                || event.target['className'] === "75"
                || event.target['className'] === "100") {
                this.percentage = parseInt(event.target['className'], 10);
            }
            if (this.percentage < 0) {
                this.percentage = 0;
            } else if (this.percentage > 100) {
                this.percentage = 100;
            }
            this.setSliderUIValues(this.percentage, null);
            this.sliderModel.percentage = this.percentage;
            this.onValueChange.emit(this.sliderModel);
            return parseInt(this.percentage); // return calculated/set percentage
        }
    }
    /**
     * add mouse move event on document
     * @param {Object} event - mousedown event object
     */
    onMouseDown(event) {
        // if clicked on long bar div
        if (event.target.className.indexOf('c2-slider-bar c2-js-slider-bar c2-pointer') > -1) {
            var offsetLeft = event.pageX - event.layerX;
            this.initialOffset = offsetLeft;
        }
        // if click on static dots at 25, 50, 75... %
        else if (event.target.className.indexOf('c2-movable-thumb-dot-static') > -1) {
            this.initialOffset = event.pageX - event.target.offsetLeft
        }
        // if user clicks on moveable dot at any point on slider
        else if (event.target.className.indexOf('c2-movable-thumb-dot c2-js-slider-movable-thumb-dot') > -1) {
            this.initialOffset = event.pageX - event.target.offsetLeft
        }
        document.addEventListener('mousemove', this.initMouseMove);
        document.addEventListener('touchmove', this.initMouseMove);
        this.preventHilight(event);
    }

    /**
     * prevent hilihgt of text during drag
     * @param e clicked event
     */
    preventHilight(e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }

    onMoveableDotClick(e) {
    }

    /**
	 * check for mouse click and Touch move, set ui values of slider
     * @param {Object} event - mousemove event object
	 */
    onTouchMoveOnSlider(event: MouseEvent) {
        if (!this.isLogin || this.userBalance <= 0)
            return;
        // show overlay
        this.overlay.classList.remove('c2-hide');

        // check for slider bar
        if (this.sliderBar) {
            event = event['targetTouches'][0]

            // show thumb
            this.thumb.classList.remove('c2-hide');

            // calculate percentage according to mouse movement
            let sliderLeftPos = this.sliderBar.nativeElement.offsetLeft;
            let sliderRightPos = sliderLeftPos + this.sliderBar.nativeElement.offsetWidth;
            let mouseLeft = event.pageX;
            if (mouseLeft < sliderLeftPos) {
                this.percentage = 0;
            } else if (mouseLeft > sliderRightPos) {
                this.percentage = 100;
            } else {
                this.percentage = ((event.pageX - sliderLeftPos) / this.sliderBar.nativeElement.offsetWidth) * 100;
            }

            this.setSliderUIValues(this.percentage, null);

            if (this.sliderConfig.selectCallBack) {
                this.sliderConfig.selectCallBack(this.percentage);
            }
            this.sliderModel.percentage = this.percentage;
            this.onValueChange.emit(this.sliderModel);
            return parseInt(this.percentage); // return calculated/set percentage
        }
    }

    /**
     * add mouse up event on window
     * remove mouse move event on document
     * @param {Object} event - mouseup event object
     */
    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event) {
        this.thumb.classList.add('c2-hide');
        this.overlay.classList.add('c2-hide');
        document.removeEventListener('mousemove', this.initMouseMove);
    }

    /**
     * move dot on click
     * set ui values of slider
     * @param event - click event object
     */
    onClick(event) {

        this.onMouseMoveOnSlider(event);

        // hide thumb and overlay
        setTimeout(() => {
            this.thumb.classList.add('c2-hide');
            this.overlay.classList.add('c2-hide');
        }, 300);
    }

    /**
     * add touch move event on window
     * remove touch move event on document
     * @param {Object} event - mouseup event object
     */
    @HostListener('touchmove', ['$event'])
    onTouchMove($event) {
        document.addEventListener('touchmove', this.initTouchMove);
    }

    @HostListener('touchend', ['$event'])
    onTouchEnd(event) {
        this.thumb.classList.add('c2-hide');
        this.overlay.classList.add('c2-hide');
        document.removeEventListener('touchmove', this.initTouchMove);
    }


    /**
     * set filled bar value
     * set dot position
     * set thumb value
     * @param { number } percentage - any number
     * @param { Object } sliderConfig - custom slider configuration
     */
    setSliderUIValues(percentage, sliderConfig) {

        if (percentage < 0) {
            this.dot.style.left = "0%";
        } else if (percentage > 100) {
            this.dot.style.left = "100%";
        } else {
            this.dot.style.left = percentage + "%";
        }
        this.filledBar.style.width = percentage + "%";
        this.thumb.innerHTML = parseInt(percentage) + "%";

        // set slider ui configuration
        if (sliderConfig) {
            if (sliderConfig.barColor) {
                this.sliderBar.nativeElement.style.backgroundColor = sliderConfig.barColor;
            }
            if (sliderConfig.barWidth) {
                this.sliderBar.nativeElement.style.width = sliderConfig.barWidth;
            }
            if (sliderConfig.dotColor) {
                this.dot.style.backgroundColor = sliderConfig.dotColor;
            }
            if (sliderConfig.thumbColor) {
                this.thumb.style.backgroundColor = sliderConfig.thumbColor;
            }
            if (sliderConfig.filledBarColor) {
                this.filledBar.style.backgroundColor = sliderConfig.filledBarColor;
            }
        }
    }

    // updating value when user changes amount in input
    public updateValue(percentage: number, orderType: string) {
        if (!this.isLogin || this.userBalance <= 0) {
            return;
        }
        this.sliderConfig.percentage = percentage;
        this.sliderConfig.orderType = orderType;
        this.percentage = percentage;
        this.setSliderUIValues(percentage, this.sliderConfig);
    }
}