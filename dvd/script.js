class Tortise {
    constructor(obj) {
        this.obj = obj;
        this._x = 0;
        this._y = 0;
        this._angle = 0;
        this.maxX = window.innerWidth - obj.offsetWidth;
        this.maxY = window.innerHeight - obj.offsetHeight;
        
        Object.defineProperties(this, {
            x: {
                get: () => { return this._x },
                set: x => {
                    if (x <= this.maxX && x >= 0) {
                        this.obj.style.left = x + "px";
                        this._x = x
                    } else if (x > this.maxX) {
                        this.x = this.maxX
                    } else if (x < 0) {
                        this.x = 0
                    }
                }
            },
        
            y: {
                get: () => { return this._y },
                set: y => {
                    if (y <= this.maxY && y >= 0) {
                        this.obj.style.top = y + "px";
                        this._y = y;
                    } else if (y > this.maxY) {
                        this.y = this.maxY
                    } else if (y < 0) {
                        this.y = 0
                    }
                }
            },

            angle: {
                set: angle => {
                    angle = angle % 360
                    if (angle < 0) { angle += 360 }
                    this._angle = angle
                },

                get: () => { return this._angle }
            }
        })

        window.onresize = () => {
            this.maxX = window.innerWidth - obj.offsetWidth;
            this.maxY = window.innerHeight - obj.offsetHeight;
            if (this.x > this.maxX) { this.x = this.maxX };
            if (this.y > this.maxY) { this.y = this.maxY };
        };
    };

    goto(x, y) { this.x = x; this.y = y; }

    center() { this.x = this.maxX / 2; this.y = this.maxY / 2; }

    forward(n) {
        this.x = this.x + Math.sin(this.angle * Math.PI / 180) * n;
        this.y = this.y - Math.cos(this.angle * Math.PI / 180) * n;
    }

    setColor(c) {
        this.obj.style.fill = c
        this.obj.style.stroke = c
    }

    atXEdge() { return this.x == this.maxX || this.x == 0; }

    atYEdge() { return this.y == this.maxY || this.y == 0; }

    atEdge() { return this.atXEdge() || this.atYEdge(); }

    atCorner() { return this.atXEdge() && this.atYEdge(); }

    bounce() {
        if (this.atCorner()) { this.angle += 180 }
        else if (this.atEdge) {
            if ((this.angle >= 0 && this.angle < 90) || (this.angle >= 180 && this.angle < 270)) {
                this.angle += this.atXEdge() ? -90 : 90
            } else if ((this.angle >= 90 && this.angle < 180) || (this.angle >= 270 && this.angle < 360)) {
                this.angle += this.atXEdge() ? 90 : -90
            }
        }
        
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fwdAmt = 3;

window.onload = async () => {
    const logo_div = $('#box')[0]

    let t = new Tortise(logo_div);
    t.setColor('#fff')
    console.log(t.maxX)
    t.goto(Math.floor(Math.random() * t.maxX), Math.floor(Math.random() * t.maxY))
    //t.center()
    //t.angle = Math.floor(Math.random() * 360)
    t.angle = 45
    while (true) {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        t.setColor('#' + randomColor)
        while (!t.atEdge()) {
            t.forward(fwdAmt);
            await sleep(20);
        }
        t.bounce();
        t.forward(fwdAmt)
        
    }
}

