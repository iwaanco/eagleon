export class EagleonConsole {
    debug = false;
    points = [];
    constructor(debug) {
        this.debug = debug;
    }
    name1(title) {
        if (this.debug) {
            this.points.push({ type: "warn", log: [`<<<-----------------------|| ${title}`] })
        }
    }
    vaildInput2(data, data2) {
        if (this.debug) {
            this.points.push({ type: "warn", log: ["%c0) Vaild data/tag/text", "font-weight: bold"] })
            this.points.push({ type: "warn", log: [data] })
            if (data2) {
                this.points.push({ type: "warn", log: ["%c0) Use this", "font-weight: bold"] })
                this.points.push({ type: "warn", log: [data2] })
            }
        }
    }
    gotIt3(data, data2) {
        this.points = (typeof points == 'undefined') ? [] : this.points;
        if (this.debug) {
            this.points.push({ type: "warn", log: ["%c1) Value got it", "font-weight: bold"] })
            this.points.push({ type: "warn", log: [data] })
            if (data2) this.points.push({ type: "warn", log: [data2] })
        }
    }
    sendData4(data) {
        if (this.debug) {
            this.points.push({ type: "warn", log: ["%c2) Send Data to server", "font-weight: bold"] })
            this.points.push({ type: "warn", log: [data] })
        }
    }
    response5(res) {
        if (this.debug) {
            if (res && res.statusCode == 200) {
                this.points.push({ type: "warn", log: ["%c3) Data Saved on server", "font-weight: bold"] })
                this.points.push({ type: "warn", log: [res] })
            } else {
                this.points.push({ type: "error", log: ["%c3) Error Response", "font-weight: bold"] })
                this.points.push({ type: "warn", log: [res.message] })
            }
            this.print()
        }
    }
    error(title, data) {
        if (this.debug) {
            this.points.push({ type: "warn", log: [`%c${title}`, "font-weight: bold"] });
            this.points.push({ type: "warn", log: [data] });
        }
        this.print()
    }
    end() {
        if (this.debug) {
            this.points.push({ type: "warn", log: [`||----------------------->>> Printed by EagleonActivityTracking`] })
            this.points.push({ type: "log", log: ["  "] });
        }
    }
    print() {
        this.end()
        for (let i = 0; i < this.points.length; i++) {
            console[this.points[i].type](...this.points[i].log)
        }
    }
}