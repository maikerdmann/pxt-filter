namespace Filter {

    class BaseFilter{
        current: number

        constructor(){

        }

        get_last_value():number{
            return this.current
        }
    }

    class windowFilter extends BaseFilter{
        window: number[]
        windowsize: number

        constructor(windowsize: number){
            super()
            this.windowsize = windowsize
            this.window = []
        }

        add_measurement(measurement: number) {
            this.window.push(measurement)
            if (this.window.length > this.windowsize) { this.window.shift() }
        }
    }

    export class MA extends windowFilter {
        constructor(windowsize: number){
            super(windowsize)
        }

        update(measurement: number): number{
            this.add_measurement(measurement)
            if (this.window.length < this.windowsize) { return measurement }

            this.current =  this.calculate()
            return this.current
        }

        calculate(): number {
            let window_average = round(average(this.window), 10)
            return window_average
        }
    }

    export class WMA extends windowFilter {
        constructor(windowsize: number) {
            super(windowsize)
        }

        update(measurement: number): number {
            this.add_measurement(measurement)
            if (this.window.length < this.windowsize) { return measurement }

            this.current = this.calculate()
            return this.current
        }

        calculate(): number {
            const window_ww = this.window.map((value, index) => value * (index + 1));

            let av = 2 * sum(window_ww) / (this.windowsize * (this.windowsize + 1))
            return round(av, 10)
        }
    }

    export class EMA extends BaseFilter {
        alpha: number
        last_ema: number

        constructor(alpha: number) {
            super()
            this.alpha = alpha
            this.last_ema = 0
        }

        update(measurement: number): number {
            if (this.last_ema == 0) {
                this.last_ema = measurement
                return measurement
            }
            this.current = this.calculate(measurement)
            return this.current
        }

        calculate(measurement: number): number {
            this.last_ema = this.alpha * measurement + (1 - this.alpha) * this.last_ema
            return round(this.last_ema, 10)
        }
    }

    export class LMS extends windowFilter {
        mu: number
        h: number[]

        constructor(windowsize: number, mu: number) {
            super(windowsize)
            this.mu = mu

            let temp: number[] = []
            for (let i=0 ; i < windowsize;i++){
                temp.push(0)
            }
            this.h = temp
        }

        update(measurement: number): number {
            if (this.window.length == this.windowsize) {
                this.current = this.calculate(measurement)
                this.add_measurement(measurement)

                return this.current
            }

            this.add_measurement(measurement)

            return measurement
        }

        calculate(measurement: number) {
            let input = this.window
            let xhatn = matdot(this.h, input)
            let en = measurement - xhatn

            let temp1 = mattimesnum(input, en)
            let temp2 = mattimesnum(temp1, this.mu)

            this.h = matadd(temp2, this.h)

            return xhatn
        }
    }

    export class NLMS extends windowFilter{
        h: number[]

        constructor(windowsize: number) {
            super(windowsize)
            
            let temp: number[] = []
            for (let i = 0; i < windowsize; i++) {
                temp.push(0)
            }
            this.h = temp
        }

        update(measurement: number): number {
            if (this.window.length == this.windowsize) {
                this.current = this.calculate(measurement)
                this.add_measurement(measurement)
                return this.current
            }

            this.add_measurement(measurement)

            return measurement
        }

        calculate(measurement: number) {
            let input = this.window
            let xhatn = matdot(this.h, input)
            let en = measurement - xhatn

            let temp1 = mattimesnum(input, en)
            let temp2 = matdot(input, input)
            let temp3 = vecdivnum(temp1, temp2)

            this.h = matadd(temp3, this.h)

            return xhatn
        }
    }

    export class Kalman extends BaseFilter{
        // initial state estimate
        private x: number;
        private P: number;

        // state transition matrix
        private F: number;

        // control input matrix
        private B: number;

        // observation matrix
        private H: number;

        // measurement noise covariance matrix
        private R: number;

        // process noise covariance matrix
        private Q: number;

        constructor(x: number, P: number, F: number, B: number, H: number, R: number, Q: number) {
            super()
            this.x = x;
            this.P = P;
            this.F = F;
            this.B = B;
            this.H = H;
            this.R = R;
            this.Q = Q;
        }

        public update(measurement: number) {
            this.current = this.calculate(measurement)
            return this.current
        }

        calculate(measurement: number) {
            // prediction step
            const x_pred = this.F * this.x;
            const P_pred = this.F * this.P * this.F + this.Q;

            // measurement update step
            const y = measurement - this.H * x_pred;
            const S = this.H * P_pred * this.H + this.R;
            const K = P_pred * this.H / S;
            this.x = x_pred + K * y;
            this.P = (1 - K * this.H) * P_pred;

            return this.x
        }
    }

    function average(array: number[]) {
        const sum = array.reduce((a, b) => a + b, 0)
        const avg = (sum / array.length) || 0
        return avg
    }

    function sum(array: number[]) {
        return array.reduce((a, b) => a + b, 0)
    }

    function round(num: number, decimal: number) {
        let dec = Math.pow(10, decimal)
        return Math.round(num * dec) / dec
    }

    function matdot(h: number[], input: number[]): number {
        let newarr = []
        for (let i = 0; i < h.length; i++) {
            newarr[i] = h[i] * input[i]
        }
        return sum(newarr)
    }

    function matadd(arr1: number[], arr2: number[]): number[] {
        let newarr = []
        for (let i = 0; i < arr1.length; i++) {
            newarr[i] = arr1[i] + arr2[i]
        }
        return newarr
    }

    function mattimes(arr1: number[], arr2: number[]): number[] {
        let newarr = []
        for (let i = 0; i < arr1.length; i++) {
            newarr[i] = arr1[i] * arr2[i]
        }
        return newarr
    }

    function mattimesnum(arr1: number[], num: number): number[] {
        let newarr = []
        for (let i = 0; i < arr1.length; i++) {
            newarr[i] = arr1[i] * num
        }
        return newarr
    }

    function mataddnum(arr1: number[], num: number): number[] {
        let newarr = []
        for (let i = 0; i < arr1.length; i++) {
            newarr[i] = arr1[i] + num
        }
        return newarr
    }

    function vecdivnum(arr: number[], num: number): number[] {
        let newarr = []
        for (let i = 0; i < arr.length; i++) {
            newarr[i] = arr[i] / num
        }
        return newarr
    }
}