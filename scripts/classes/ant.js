class Ant {
    // lifetime, x, y, moveAngle, color
	constructor(settings, planeWidth, planeHeight, gridType) {
        for (let setting in settings) {
            this[setting] = settings[setting];
        }

        this.move = this.initMovement(planeWidth, planeHeight, gridType);
    }

    initMovement(planeWidth, planeHeight, gridType) {
        //TODO: combine both cases
        if (gridType == 4) {
            return () => {
                let res = false;

                if (this.lifetime > 0) {
                    const direction = this.getDirection(gridType);

                    switch (direction) {
                        case 1:
                            this.moveY(-1, planeHeight);
                            break;

                        case 2:
                            this.moveX(-1, planeWidth);
                            break;

                        case 3:
                            this.moveY(1, planeHeight);
                            break;

                        default: //0
                            this.moveX(1, planeWidth);
                            break;
                    }
                    
                    this.lifetime--;
                    res = this.coords;
                }

                return res;
            };
        }

        if (gridType == 6) {
            return () => {
                let res = false;

                if (this.lifetime > 0) {
                    const direction = this.getDirection(gridType);

                    switch (direction) {
                        case 1:
                            this.moveY(-1, planeHeight);
                            if (this.y % 2 == 0) this.moveX(1, planeWidth);
                            break;

                        case 2:
                            this.moveY(-1, planeHeight);
                            if (this.y % 2) this.moveX(-1, planeWidth);
                            break;

                        case 3:
                            this.moveX(-1, planeWidth);
                            break;

                        case 4:
                            this.moveY(1, planeHeight);
                            if (this.y % 2) this.moveX(-1, planeWidth);
                            break;

                        case 5:
                            this.moveY(1, planeHeight);
                            if (this.y % 2 == 0) this.moveX(1, planeWidth);
                            break;

                        default: //0
                            this.moveX(1, planeWidth);
                            break;
                    }
                    
                    this.lifetime--;
                    res = this.coords;
                }

                return res;
            };
        }
    }

    getDirection(gridType) {
        return Math.floor( ((this.moveAngle + 180/gridType) % 360) / (360/gridType) );
    }

    set turn(turn) {
        // in degrees
        if (turn < 0)
            turn = turn % 360 + 360;

        this.moveAngle = (this.moveAngle + turn) % 360;
    }

    moveX(moving, planeWidth) {
        // 1 or -1
        if (moving > 0)
            this.x = (this.x + 1 == planeWidth) ? 0 : (this.x + 1);
        else
            this.x = this.x ? (this.x - 1) : (planeWidth - 1);
    }

    moveY(moving, planeHeight) {
        // 1 or -1
        if (moving > 0)
            this.y = (this.y + 1 == planeHeight) ? 0 : (this.y + 1);
        else
            this.y = this.y ? (this.y - 1) : (planeHeight - 1);
    }

    get coords() {
        return {'x': this.x, 'y': this.y};
    }

    /*get renderData() {
        return {'coords': this.coords, 'color': this.color};
    }*/
}
