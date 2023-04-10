//% emitAsConstant
enum Filterlist {
    //% block="MA"
    //% blockIdentity="filters.pick"
    MA = 1,
    //% block="WMA"
    //% blockIdentity="filters.pick"
    WMA = 2,
    //% block="EMA"
    //% blockIdentity="filters.pick"
    EMA = 3,
    //% block="LMS"
    //% blockIdentity="filters.pick"
    LMS = 4,
    //% block="NLMS"
    //% blockIdentity="filters.pick"
    NLMS = 5,
    //% block="Kalman"
    //% blockIdentity="filters.pick"
    Kalman = 6
}

namespace filters {
    //% shim=TD_ID
    //% blockId=FilterlistItem
    //% block="Filter $pick"
    export function pick(pick: Filterlist){
        switch (pick) {
            case Filterlist.MA:
                return new Filter.MA(5)
            case Filterlist.WMA:
                return new Filter.WMA(5)
            case Filterlist.EMA:
                return new Filter.EMA(0.5)
            case Filterlist.LMS:
                return new Filter.LMS(5,0.1)
            case Filterlist.NLMS:
                return new Filter.NLMS(5)
            case Filterlist.Kalman:
                return new Filter.Kalman(0, 1, 1, 0, 1, 1, 1)
            default:
                return new Filter.MA(5)
        }
    }
}

//% enumIdentity="Filterlist.MA"
//% blockIdentity="filters.pick"
const MA = Filterlist.MA;

//% enumIdentity="Filterlist.WMA"
//% blockIdentity="filters.pick"
const WMA = Filterlist.WMA;

//% enumIdentity="Filterlist.EMA"
//% blockIdentity="filters.pick"
const EMA = Filterlist.EMA;

//% enumIdentity="Filterlist.LMS"
//% blockIdentity="filters.pick"
const LMS = Filterlist.LMS;

//% enumIdentity="Filterlist.NLMS"
//% blockIdentity="filters.pick"
const NLMS = Filterlist.NLMS;

//% enumIdentity="Filterlist.Kalman"
//% blockIdentity="filters.pick"
const Kalman = Filterlist.Kalman;

