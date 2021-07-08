class Tortise {
    constructor(obj) {
        this.obj = obj;
        this._x = 0;
        this._y = 0;
        this._rx = 0;
        this._ry = 0;
        this.maxX = window.innerWidth - obj.offsetWidth;
        this.maxY = window.innerHeight - obj.offsetHeight;
        this._angle = 0;
        this.bounded = true;
        console.log(this)

        Object.defineProperties(this, {
            x: {
                get: () => { return this._x },
                set: x => {
                    if ((x <= this.maxX && x >= 0)|| !this.bounded) {
                        this.obj.style.left = x + "px";
                        this._x = x
                        this._rx = Math.round(x)
                    } else if (x > this.maxX) {
                        console.log(x + ": oob max")
                        this.x = this.maxX
                    } else if (x < 0) {
                        console.log(x + ": oob min")
                        this.x = 0
                    }
                }
            },
        
            y: {
                get: () => { return this._y },
                set: y => {
                    if ((y <= this.maxY && y >= 0) || !this.bounded) {
                        this.obj.style.top = y + "px";
                        this._y = y;
                        this._ry = Math.round(y);
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
                    //$('#box').css('transform', `rotate(${angle - 90}deg)`)
                    this._angle = angle
                },

                get: () => {
                    return this._angle
                }
            }
        })

        window.onresize = () => {
            this.maxX = window.innerWidth - obj.offsetWidth;
            this.maxY = window.innerHeight - obj.offsetHeight;
            if (this.x > this.maxX) { this.x = this.maxX };
            if (this.y > this.maxY) { this.y = this.maxY };
        };
    };

    goto(x, y) {
        this.x = x;
        this.y = y;
    }

    center() {
        this.x = this.maxX / 2;
        this.y = this.maxY / 2;
    }

    forward(n) {
        this.x = this.x + (Math.floor(Math.sin(this.angle * Math.PI / 180) * n));
        this.y = this.y - (Math.floor(Math.cos(this.angle * Math.PI / 180) * n));
    }

    moveX(x) {
        var newX = this.x + x
        if (newX < this.maxX && newX >= 0) {
            this.obj.style.left = newX + "px";
            this.x = newX;
        }
    }

    atEdge() {
        return this.atXEdge() || this.atYEdge();
    }

    atCorner() {
        return this.atXEdge() && this.atYEdge();
    }

    atXEdge() {
        return this._rx == this.maxX || this._rx == 0;
    }

    atYEdge() {
        return this._ry == this.maxY || this._ry == 0;
    }

    edgeCorrect() {
        if (this.atCorner()) { this.angle += 180 }
        else if (this.atEdge) {
            if ((this.angle >= 0 && this.angle < 90) || (this.angle >= 180 && this.angle < 270)) {
                console.log(1)
                this.angle += this.atXEdge() ? -90 : 90
            } else if ((this.angle >= 90 && this.angle < 180) || (this.angle >= 270 && this.angle < 360)) {
                console.log(2)
                this.angle += this.atXEdge() ? 90 : -90
            }
        }
        console.log("ang: " + this.angle)
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

let t = new Tortise($('#box')[0]);

t.bounded = true
t.center()
t.angle = 45

window.onload = () => {
    run()
}

var run = async () => {
    console.log('run')
    while (true) {
        console.log("do loop")
        while (!t.atEdge()) {
            t.forward(5);
            await sleep(30);
        }
    
        t.edgeCorrect();
    
        t.forward(5);
    }
}

